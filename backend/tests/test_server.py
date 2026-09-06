"""
Integration tests for FastAPI server and custom LLM middleware.
"""
import pytest
from fastapi.testclient import TestClient
from backend.server import app


@pytest.fixture
def client():
    return TestClient(app)


def test_health_check(client):
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "online"
    assert "version" in data


def test_deal_quote_endpoint(client):
    payload = {"seat_count": 30, "requested_discount_pct": 5.0}
    res = client.post("/api/deal/quote", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["seat_count"] == 30
    assert data["tier"] == "pro"
    assert data["discount_pct"] == 5.0
    assert data["effective_price_per_seat"] == 33.25


def test_deal_concession_endpoint(client):
    payload = {"seat_count": 80, "requested_discount_pct": 15.0, "current_tier": "enterprise"}
    res = client.post("/api/deal/concession", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "conditional_approval"
    assert data["approved_discount_pct"] == 15.0
    assert data["required_trade"] is not None


def test_custom_llm_discount_turn(client):
    # Test Agora /v1/chat/completions with a discount request
    payload = {
        "session_id": "test_convo_01",
        "messages": [
            {"role": "user", "content": "Can you give us a 10% discount on 50 seats?"}
        ]
    }
    res = client.post("/v1/chat/completions", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "choices" in data
    reply = data["choices"][0]["message"]["content"]
    assert "10%" in reply or "discount" in reply.lower()


def test_session_lifecycle_and_deal_memo(client):
    start_payload = {
        "channel_name": "test_channel_99",
        "customer_name": "Aditya Verma",
        "company": "Knotic Labs",
        "email": "aditya@knotic.ai",
        "seat_count": 40
    }
    res = client.post("/api/session/start", json=start_payload)
    assert res.status_code == 200
    session_data = res.json()
    assert session_data["channel_name"] == "test_channel_99"
    assert session_data["status"] == "connected"

    # Stop call session and retrieve Deal Memo
    stop_payload = {"conversation_id": "test_channel_99"}
    res2 = client.post("/api/session/stop", json=stop_payload)
    assert res2.status_code == 200
    stop_data = res2.json()
    assert stop_data["status"] == "call_ended"
    deal_memo = stop_data["deal_memo"]
    assert deal_memo["customer"]["name"] == "Aditya Verma"
    assert deal_memo["customer"]["company"] == "Knotic Labs"
    assert deal_memo["requirements_captured"]["seat_count"] == 40
    assert "financials" in deal_memo


def test_managed_llm_config_uses_agora_hosted_openai():
    from backend.services.agora_convo_client import build_llm_config

    cfg = build_llm_config("test_channel_managed")
    assert cfg["credential_mode"] == "managed"
    assert cfg["vendor"] == "openai"
    assert cfg["params"]["stream"] is True
    assert cfg["params"]["max_tokens"] == 300
    assert "api_key" not in cfg
    assert any(
        m.get("role") == "system" and "Emily" in m.get("content", "")
        for m in cfg["system_messages"]
    )


def test_update_session_state_tool_updates_memory(client):
    from backend.middleware.custom_llm import get_or_create_session, _apply_state_update

    session = get_or_create_session("test_state_update_01")
    _apply_state_update(
        {
            "seat_count": 80,
            "buyer_name": "Priya",
            "company": "Swiggy",
            "objection": {
                "type": "competitor",
                "label": "Competitor (Jira)",
                "resolved": False,
                "context": "4 years on Jira",
            },
        },
        session,
    )
    assert session.requirements.seat_count == 80
    assert session.deal_state.tier == "enterprise"
    assert session.customer.name == "Priya"
    assert session.customer.company == "Swiggy"
    assert any(o.type == "competitor" and not o.resolved for o in session.objections_raised)


def test_adaptive_persona_reflects_live_deal_state():
    from backend.middleware.custom_llm import get_or_create_session
    from backend.middleware.sales_persona import build_system_prompt, detect_stage

    session = get_or_create_session("test_persona_01")
    session.requirements.seat_count = 80
    prompt = build_system_prompt(session)
    assert "60 words or fewer" in prompt
    assert "Seats: 80" in prompt
    assert detect_stage(session) == "quote"


def test_discount_offer_survives_later_requote():
    import asyncio
    from backend.middleware.custom_llm import get_or_create_session, execute_tool_call

    async def run():
        session = get_or_create_session("test_offer_preserve_01")
        await execute_tool_call("apply_discount", {"requested_discount_pct": 15.0, "seat_count": 50}, session)
        assert session.deal_state.current_offer_pct_off == 15.0
        assert session.deal_state.effective_price_per_seat == 29.75
        # A later re-quote must preserve the negotiated offer, not reset to list
        await execute_tool_call("get_pricing", {"seat_count": 50}, session)
        assert session.deal_state.current_offer_pct_off == 15.0
        assert session.deal_state.effective_price_per_seat == 29.75
        return session

    session = asyncio.run(run())
    from backend.server import generate_deal_memo_dict

    memo = generate_deal_memo_dict(session)
    assert memo["negotiation_summary"]["final_negotiated_price"] == "$29.75/mo"
    assert memo["financials"]["annual_contract_value"] == 17850.0


def test_pipeline_config_serves_persona_and_sarvam_settings(client):
    """The Next.js /api/invite-agent route builds the Agora agent from this
    payload, so it must carry the stage-aware persona and the Sarvam vendor
    settings — never a duplicated prompt on the TypeScript side."""
    res = client.get(
        "/api/agent/pipeline-config",
        params={
            "conversation_id": "test_pipeline_01",
            "customer_name": "Rahul Sharma",
            "company": "Razorpay",
            "seat_count": 80,
        },
    )
    assert res.status_code == 200
    data = res.json()

    assert data["conversation_id"] == "test_pipeline_01"
    assert data["llm_mode"] in ("managed_openai", "custom")
    # Seeded buyer context must already be reflected in the prompt.
    assert "Seats: 80" in data["system_prompt"]
    assert "Razorpay" in data["system_prompt"]
    assert data["greeting_message"]
    assert data["failure_message"]

    sarvam = data["sarvam"]
    assert sarvam["stt_language"]
    assert sarvam["tts_speaker"]
    assert sarvam["tts_target_language_code"]
    assert isinstance(sarvam["tts_sample_rate"], int)


def test_pipeline_config_custom_mode_points_at_middleware(client, monkeypatch):
    """AGORA_LLM_MODE=custom must route Agora back to our FastAPI brain."""
    from backend.config import settings

    monkeypatch.setattr(settings, "AGORA_LLM_MODE", "custom")
    res = client.get(
        "/api/agent/pipeline-config",
        params={"conversation_id": "test_pipeline_02"},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["llm_mode"] == "custom"
    assert data["custom_llm_url"].endswith("/v1/chat/completions")
    assert data["custom_llm_api_key"]


def test_pipeline_config_defaults_to_agora_managed_models(client):
    """The hackathon-recommended pipeline is Agora-managed Deepgram + OpenAI +
    MiniMax, so no provider keys are needed to run a full call."""
    res = client.get(
        "/api/agent/pipeline-config",
        params={"conversation_id": "test_pipeline_03"},
    )
    assert res.status_code == 200
    data = res.json()

    assert data["stt_vendor"] == "deepgram"
    assert data["tts_vendor"] == "minimax"
    # Managed mode only accepts these preset models.
    assert data["deepgram"]["model"] in ("nova-2", "nova-3")
    assert data["minimax"]["model"] in ("speech-2.6-turbo", "speech-2.8-turbo")
    assert isinstance(data["mcp_server_urls"], list)


def test_pipeline_config_exposes_configured_mcp_servers(client, monkeypatch):
    """MCP server URLs are passed straight through to llm.mcp_servers so the
    Agora engine performs tool calls itself."""
    from backend.config import settings

    monkeypatch.setattr(
        settings,
        "AGORA_MCP_SERVER_URLS",
        "https://a.example/mcp, https://b.example/mcp",
    )
    res = client.get(
        "/api/agent/pipeline-config",
        params={"conversation_id": "test_pipeline_04"},
    )
    assert res.status_code == 200
    assert res.json()["mcp_server_urls"] == [
        "https://a.example/mcp",
        "https://b.example/mcp",
    ]


def test_pipeline_config_exposes_deal_engine_mcp_url(client):
    """The deal engine is offered to Agora as an MCP server scoped to this
    conversation, so the agent has real tools on the managed LLM path."""
    res = client.get(
        "/api/agent/pipeline-config",
        params={"conversation_id": "test_mcp_url_01"},
    )
    assert res.status_code == 200
    url = res.json()["deal_engine_mcp_url"]
    assert url is not None
    assert url.endswith("/mcp/?cid=test_mcp_url_01")


def test_mcp_tools_are_registered():
    """All six sales actions must be exposed over MCP — this is what makes the
    agent agentic when Agora's managed OpenAI drives the conversation."""
    import asyncio
    from backend.mcp_server import mcp

    tools = asyncio.run(mcp.list_tools())
    names = {t.name for t in tools}
    assert names == {
        "get_pricing",
        "apply_discount",
        "create_crm_lead",
        "book_meeting",
        "update_session_state",
        "escalate_to_human",
    }


def test_mcp_tool_delegates_to_deal_engine():
    """MCP tools must reuse execute_tool_call, not reimplement pricing."""
    import asyncio
    from backend.mcp_server import get_pricing
    from backend.middleware.custom_llm import get_or_create_session

    async def run():
        return await get_pricing(
            seat_count=120, ctx=None, conversation_id="test_mcp_tool_01"
        )

    result = asyncio.run(run())
    assert result["tier"] == "enterprise"
    assert result["seat_count"] == 120

    session = get_or_create_session("test_mcp_tool_01")
    assert session.requirements.seat_count == 120


def test_meeting_datetime_parses_natural_language():
    """The agent passes the buyer's own words, not ISO timestamps, so booking
    at the agreed time depends entirely on this parser."""
    import datetime
    from backend.services.calendar_client import parse_meeting_datetime, _local_timezone

    tz = _local_timezone()
    now = datetime.datetime.now(tz)

    tomorrow_3pm = parse_meeting_datetime("tomorrow at 3pm", tz)
    assert tomorrow_3pm.hour == 15 and tomorrow_3pm.minute == 0
    assert tomorrow_3pm.date() == (now + datetime.timedelta(days=1)).date()

    half_past = parse_meeting_datetime("tomorrow 10:30 am", tz)
    assert (half_past.hour, half_past.minute) == (10, 30)

    # Named parts of the day map to business-hours defaults.
    assert parse_meeting_datetime("friday afternoon", tz).hour == 15
    assert parse_meeting_datetime("monday morning", tz).hour == 10

    # A weekday name lands on that weekday.
    assert parse_meeting_datetime("next tuesday at 11am", tz).weekday() == 1

    # Explicit ISO input is honoured verbatim.
    iso = parse_meeting_datetime("2030-09-10T14:00:00+05:30", tz)
    assert (iso.year, iso.month, iso.day, iso.hour) == (2030, 9, 10, 14)


def test_meeting_datetime_never_books_in_the_past():
    """A stale time (e.g. '9am' said at 6pm) must roll forward, never book
    a slot that has already happened."""
    import datetime
    from backend.services.calendar_client import parse_meeting_datetime, _local_timezone

    tz = _local_timezone()
    now = datetime.datetime.now(tz)
    for phrase in ("today at 9am", "at 1am", "tomorrow at 3pm", ""):
        assert parse_meeting_datetime(phrase, tz) > now


def test_calendar_sandbox_result_is_clearly_labelled():
    """Without Google credentials the result must be unmistakably simulated,
    so the UI never claims an invite was emailed when none was."""
    import asyncio
    from backend.config import settings
    from backend.services.calendar_client import GoogleCalendarClient

    client = GoogleCalendarClient()
    if client.is_configured:
        import pytest

        pytest.skip("Google Calendar is configured; sandbox path not exercised")

    res = asyncio.run(
        client.book_meeting(
            attendee_email="buyer@example.com",
            start_time_iso="tomorrow at 3pm",
            meeting_type="Enterprise Demo",
        )
    )
    assert res["is_sandbox"] is True
    assert "SIMULATED" in res["message"]
    assert res["attendee_email"] == "buyer@example.com"


def test_escalation_queue_hydrates_the_team_console(client):
    """escalate_to_human must land in the queue with enough context for the
    Sales Team Console to render a card without a second round-trip."""
    import asyncio
    from backend.middleware.custom_llm import get_or_create_session, execute_tool_call

    async def run():
        session = get_or_create_session("test_escalation_01")
        session.customer.name = "Priya Nair"
        session.customer.company = "Zeta Corp"
        session.requirements.seat_count = 200
        await execute_tool_call(
            "escalate_to_human",
            {"reason": "Wants to speak to a person about a multi-year deal", "urgency": "high"},
            session,
        )

    asyncio.run(run())

    res = client.get("/api/escalations")
    assert res.status_code == 200
    items = res.json()["escalations"]
    match = next(e for e in items if e["conversation_id"] == "test_escalation_01")
    assert match["customer_name"] == "Priya Nair"
    assert match["company"] == "Zeta Corp"
    assert match["seat_count"] == 200
    assert match["urgency"] == "high"
    assert match["resolved"] is False
    assert match["handoff_url"].endswith("/human/test_escalation_01")


def test_resolving_an_escalation_removes_it_from_the_pending_queue(client):
    """Once a specialist picks up a call it must drop off other specialists'
    queues — otherwise two people join the same buyer at once."""
    import asyncio
    from backend.middleware.custom_llm import get_or_create_session, execute_tool_call

    async def run():
        session = get_or_create_session("test_escalation_02")
        await execute_tool_call(
            "escalate_to_human", {"reason": "Pricing deadlock", "urgency": "medium"}, session
        )

    asyncio.run(run())

    pending_before = client.get("/api/escalations").json()["escalations"]
    assert any(e["conversation_id"] == "test_escalation_02" for e in pending_before)

    res = client.post("/api/escalations/test_escalation_02/resolve")
    assert res.status_code == 200
    assert res.json()["resolved"] is True

    pending_after = client.get("/api/escalations").json()["escalations"]
    assert not any(e["conversation_id"] == "test_escalation_02" for e in pending_after)

    # Resolving something already resolved (or nonexistent) is reported, not an error.
    res2 = client.post("/api/escalations/test_escalation_02/resolve")
    assert res2.json()["resolved"] is False
