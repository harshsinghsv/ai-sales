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
        m.get("role") == "system" and "Aarav" in m.get("content", "")
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
