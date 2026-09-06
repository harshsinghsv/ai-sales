"""
FastAPI Server for Adaptive AI Sales & Negotiation Agent.
Mounts:
- OpenAI-compatible Chat Completions (/v1/chat/completions) for Agora Conversational AI Engine
- OpenAI-compatible TTS Shim (/v1/audio/speech) for Sarvam Bulbul
- Session Management & Agora Web RTC Token Endpoints
- WebSocket for Live Deal Cockpit State Synchronization
- Deal Engine & CRM/Calendar/Escalation API routes
"""
import json
import logging
import uuid
from typing import Dict, Any, Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request, Response, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx

from backend.config import settings
from backend.deal_engine.engine import calculate_quote, evaluate_concession_request
from backend.services.agora_convo_client import agora_convo_client, generate_agora_rtc_token
from backend.services.tts_shim import tts_shim, OpenAITTSRequest
from backend.middleware.custom_llm import (
    handle_chat_completion,
    ws_manager,
    sessions,
    get_or_create_session,
    broadcast_session_update,
    escalation_queue,
    resolve_escalation,
)

# Configure structured logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("server")

# The MCP streamable-HTTP transport needs its session manager running for the
# lifetime of the process, so its lifespan is adopted by the FastAPI app.
from backend.mcp_server import build_mcp_app

mcp_app = build_mcp_app()

app = FastAPI(
    title="Adaptive AI Sales & Negotiation Agent",
    description=(
        "Agora Conversational AI (Deepgram ASR + managed OpenAI + MiniMax TTS) "
        "+ Deal Engine MCP server + HubSpot + Google Calendar"
    ),
    version="1.1.0",
    lifespan=mcp_app.router.lifespan_context,
)

# Deal Engine MCP server. Agora's Conversational AI Engine calls this directly
# via llm.mcp_servers; the per-session conversation id rides in ?cid=.
app.mount("/mcp", mcp_app)

# Enable CORS for Next.js web application
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# -------------------------------------------------------------
# 1. Healthcheck & System Status
# -------------------------------------------------------------
@app.get("/health")
async def health_check():
    return {
        "status": "online",
        "agora_configured": agora_convo_client.is_configured,
        "sarvam_configured": bool(settings.SARVAM_API_KEY),
        "hubspot_configured": bool(settings.HUBSPOT_ACCESS_TOKEN),
        "google_calendar_configured": bool(settings.GOOGLE_CALENDAR_CREDENTIALS),
        "slack_configured": bool(settings.SLACK_WEBHOOK_URL),
        "version": "1.0.0"
    }


# -------------------------------------------------------------
# 2. Agora Conversational AI: Custom LLM Protocol (/v1/chat/completions)
# -------------------------------------------------------------
@app.post("/v1/chat/completions")
async def chat_completions(request: Request):
    """
    OpenAI-compatible Chat Completion endpoint consumed by Agora Conversational AI Engine.
    """
    try:
        body = await request.json()
        result = await handle_chat_completion(body)
        return result
    except Exception as e:
        logger.error(f"Error handling /v1/chat/completions: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


# -------------------------------------------------------------
# 3. Agora Conversational AI: TTS Shim Protocol (/v1/audio/speech)
# -------------------------------------------------------------
@app.post("/v1/audio/speech")
@app.post("/api/tts")
async def speech_tts(payload: OpenAITTSRequest):
    """
    OpenAI-compatible TTS endpoint forwarding to Sarvam Bulbul (bulbul:v3)
    and returning raw PCM/WAV for Agora's generic_http vendor.
    """
    try:
        fmt = payload.response_format or "wav"
        audio_bytes = await tts_shim.synthesize(
            text=payload.input,
            voice=payload.voice or "aditya",
            format_type=fmt
        )
        content_type = "audio/wav" if fmt == "wav" else "audio/pcm"
        return Response(content=audio_bytes, media_type=content_type)
    except Exception as e:
        logger.error(f"Error in TTS synthesis: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


# -------------------------------------------------------------
# 3b. Sarvam AI: Speech-to-Text Endpoint (/api/stt)
# -------------------------------------------------------------
@app.post("/api/stt")
async def speech_to_text(file: UploadFile = File(...)):
    """
    Transcribes incoming microphone audio via Sarvam saaras:v3 speech-to-text API.

    DEPRECATED as of the Agora quickstart migration. The browser no longer runs
    its own STT — Agora's cloud pipeline transcribes with the native Sarvam ASR
    vendor and delivers transcripts over RTM. Kept for offline/manual testing;
    no frontend code path calls it.
    """
    try:
        content = await file.read()
        if not content:
            return {"transcript": ""}

        headers = {
            "api-subscription-key": settings.SARVAM_API_KEY
        }

        async with httpx.AsyncClient(timeout=20.0) as client:
            filename = file.filename or "audio.webm"
            # Sarvam only accepts bare mime types (e.g. "audio/webm") and rejects
            # codec parameters like "audio/webm;codecs=opus" sent by MediaRecorder.
            content_type = (file.content_type or "audio/webm").split(";")[0].strip()
            files = {"file": (filename, content, content_type)}
            data = {"model": "saaras:v3"}
            res = await client.post("https://api.sarvam.ai/speech-to-text", headers=headers, data=data, files=files)
            
            if res.status_code == 200:
                result = res.json()
                transcript = result.get("transcript", "").strip()
                logger.info(f"Sarvam STT transcribed: '{transcript}'")
                return {
                    "transcript": transcript,
                    "language_code": result.get("language_code", "en-IN"),
                    "confidence": result.get("language_probability", 1.0)
                }
            else:
                logger.error(f"Sarvam STT returned status {res.status_code}: {res.text}")
                return {"transcript": "", "error": res.text}
    except Exception as e:
        logger.error(f"Error in STT endpoint: {e}", exc_info=True)
        return {"transcript": "", "error": str(e)}


# -------------------------------------------------------------
# 3c. Agent Pipeline Config (consumed by /api/invite-agent in Next.js)
# -------------------------------------------------------------
@app.get("/api/agent/pipeline-config")
async def agent_pipeline_config(
    conversation_id: str,
    customer_name: Optional[str] = None,
    company: Optional[str] = None,
    email: Optional[str] = None,
    seat_count: Optional[int] = None,
):
    """
    Serves the ASR/LLM/TTS pipeline configuration for a session so the Next.js
    /api/invite-agent route can build the Agora agent without duplicating any
    business logic. Python remains the single source of truth for the adaptive
    Aarav persona and stage detection; this endpoint only transports it.

    Seeds the session with buyer context first so the returned system prompt
    already reflects the correct negotiation stage on the agent's first turn.
    """
    from backend.middleware.sales_persona import build_system_prompt
    from backend.services.agora_convo_client import (
        MANAGED_GREETING,
        MANAGED_FAILURE_MESSAGE,
    )

    session = get_or_create_session(conversation_id)
    if customer_name:
        session.customer.name = customer_name
    if company:
        session.customer.company = company
    if email:
        session.customer.email = email
    if seat_count:
        session.requirements.seat_count = seat_count

    mode = (settings.AGORA_LLM_MODE or "managed_openai").lower()
    if mode not in ("managed_openai", "custom"):
        mode = "managed_openai"

    config: Dict[str, Any] = {
        "conversation_id": conversation_id,
        "llm_mode": mode,
        "system_prompt": build_system_prompt(session),
        "greeting_message": MANAGED_GREETING,
        "failure_message": MANAGED_FAILURE_MESSAGE,
        "llm_model": settings.AGORA_LLM_MODEL,
        "llm_temperature": settings.AGORA_LLM_TEMPERATURE,
        "stt_vendor": (settings.AGORA_STT_VENDOR or "deepgram").lower(),
        "tts_vendor": (settings.AGORA_TTS_VENDOR or "minimax").lower(),
        "deepgram": {
            "model": settings.DEEPGRAM_MODEL,
            "language": settings.DEEPGRAM_LANGUAGE,
        },
        "minimax": {
            "model": settings.MINIMAX_MODEL,
            "voice_id": settings.MINIMAX_VOICE_ID,
        },
        "sarvam": {
            "api_key": settings.SARVAM_API_KEY,
            "stt_language": settings.SARVAM_STT_LANGUAGE,
            "tts_speaker": settings.SARVAM_TTS_SPEAKER,
            "tts_target_language_code": settings.SARVAM_TTS_TARGET_LANGUAGE,
            "tts_sample_rate": settings.SARVAM_TTS_SAMPLE_RATE,
        },
        # Our Deal Engine MCP server, scoped to this conversation via ?cid= so
        # the model never has to remember or echo a session id.
        "deal_engine_mcp_url": (
            f"{settings.PUBLIC_BASE_URL}/mcp/?cid={conversation_id}"
            if settings.AGORA_MCP_ENABLE_DEAL_ENGINE
            else None
        ),
        # Additional MCP servers the Agora agent may call tools from. Agora's
        # engine performs the tool calls itself (transport: streamable_http).
        "mcp_server_urls": [
            u.strip()
            for u in (settings.AGORA_MCP_SERVER_URLS or "").split(",")
            if u.strip()
        ],
    }

    if mode == "custom":
        config["custom_llm_url"] = f"{settings.PUBLIC_BASE_URL}/v1/chat/completions"
        config["custom_llm_api_key"] = "claude_negotiation_token"
        config["llm_model"] = settings.SARVAM_CHAT_MODEL

    return config


# -------------------------------------------------------------
# 4. Voice Call & Session Management
# -------------------------------------------------------------
class StartCallRequest(BaseModel):
    channel_name: Optional[str] = None
    user_rtc_uid: Optional[str] = "1001"
    customer_name: Optional[str] = None
    company: Optional[str] = None
    email: Optional[str] = None
    seat_count: Optional[int] = 20


@app.post("/api/session/start")
async def start_call_session(req: StartCallRequest):
    """
    Initializes a new sales negotiation session and triggers Agora Conversational AI Agent join.

    DEPRECATED as of the Agora quickstart migration. The Next.js route
    /api/invite-agent now owns the agent lifecycle (token, join, stop), so the
    browser no longer calls this. Calling it while a Next-started agent is live
    would put a SECOND agent in the same channel. Retained for backend-only
    testing and the deal playground; prefer /api/agent/pipeline-config.
    """
    channel = req.channel_name or f"sales_{uuid.uuid4().hex[:6]}"
    conversation_id = channel

    session = get_or_create_session(conversation_id)
    if req.customer_name:
        session.customer.name = req.customer_name
    if req.company:
        session.customer.company = req.company
    if req.email:
        session.customer.email = req.email
    if req.seat_count:
        session.requirements.seat_count = req.seat_count

    # Launch Agora Conversational AI Agent into RTC channel
    agent_res = await agora_convo_client.start_convo_agent(
        channel_name=channel,
        user_rtc_uid=req.user_rtc_uid or "1001",
        session_id=conversation_id
    )

    # Generate user RTC token for client browser to join
    user_token = generate_agora_rtc_token(
        settings.AGORA_APP_ID,
        settings.AGORA_APP_CERTIFICATE,
        channel,
        req.user_rtc_uid or "1001"
    )

    await broadcast_session_update(
        session,
        toast_service="deal",
        toast_title="Sales Session Started",
        toast_detail=f"Channel: {channel} | Agent: Aarav"
    )

    return {
        "status": "connected",
        "conversation_id": conversation_id,
        "channel_name": channel,
        "app_id": settings.AGORA_APP_ID or "sandbox_app_id",
        "user_rtc_uid": req.user_rtc_uid or "1001",
        "user_token": user_token,
        "agent_res": agent_res,
        "session": session.model_dump()
    }


class StopCallRequest(BaseModel):
    conversation_id: str
    agent_id: Optional[str] = None


@app.post("/api/session/stop")
async def stop_call_session(req: StopCallRequest):
    """
    Terminates Agora agent session and finalizes call outcome.
    """
    session = get_or_create_session(req.conversation_id)
    if not session.outcome:
        session.outcome = "lead_qualified"

    if req.agent_id:
        await agora_convo_client.stop_convo_agent(req.agent_id)

    await broadcast_session_update(
        session,
        toast_service="deal",
        toast_title="Call Completed",
        toast_detail="Post-call deal memo generated."
    )

    return {
        "status": "call_ended",
        "conversation_id": req.conversation_id,
        "deal_memo": generate_deal_memo_dict(session)
    }


@app.get("/api/session/{conversation_id}")
async def get_session(conversation_id: str):
    session = get_or_create_session(conversation_id)
    return session.model_dump()


def generate_deal_memo_dict(session) -> Dict[str, Any]:
    seats = session.requirements.seat_count or 20
    tier = session.deal_state.tier_name
    list_price = session.deal_state.list_price_per_seat
    discount_pct = session.deal_state.current_offer_pct_off
    floor_pct = session.deal_state.margin_floor_pct
    # Derive the negotiated price from the stored offer so the memo can never
    # show a granted discount alongside an unchanged list price.
    eff_price = (
        round(list_price * (1.0 - discount_pct / 100.0), 2)
        if discount_pct > 0
        else session.deal_state.effective_price_per_seat
    )

    monthly_subtotal = round(seats * eff_price, 2)
    annual_contract_value = round(monthly_subtotal * 12, 2)

    return {
        "conversation_id": session.conversation_id,
        "customer": {
            "name": session.customer.name or "Prospective Buyer",
            "company": session.customer.company or "Inbound Account",
            "email": session.customer.email or "Unspecified"
        },
        "requirements_captured": {
            "seat_count": seats,
            "tier_matched": tier,
            "use_case": session.requirements.use_case or "Engineering sprint & workstream collaboration",
            "must_haves": session.requirements.must_haves or ["Automated GitHub Sync", "Enterprise Security"]
        },
        "negotiation_summary": {
            "list_price_per_seat": f"${list_price:.2f}/mo",
            "final_negotiated_price": f"${eff_price:.2f}/mo",
            "discount_granted_pct": f"{discount_pct:.1f}%",
            "margin_floor_pct": f"{floor_pct:.1f}%",
            "margin_preserved": discount_pct <= floor_pct,
            "concessions_given": session.deal_state.concessions_given or ["Standard list pricing"],
            "trades_obtained": session.deal_state.trades_requested or ["Standard monthly billing terms"]
        },
        "objections_audit": [
            {
                "type": o.type,
                "label": o.label,
                "resolved": o.resolved,
                "context": o.context
            } for o in session.objections_raised
        ],
        "financials": {
            "monthly_value": monthly_subtotal,
            "annual_contract_value": annual_contract_value,
            "currency": "USD"
        },
        "outcome": session.outcome or "Lead Qualified",
        "escalated_to_human": session.escalated,
        "crm_record": {
            "crm_system": "HubSpot CRM",
            "status": "Sandbox — connect HUBSPOT_ACCESS_TOKEN to sync"
            if not settings.HUBSPOT_ACCESS_TOKEN
            else "Deal & Contact Synced",
            "is_sandbox": not bool(settings.HUBSPOT_ACCESS_TOKEN),
        }
    }


@app.get("/api/session/{conversation_id}/deal-memo")
async def get_deal_memo(conversation_id: str):
    session = get_or_create_session(conversation_id)
    return generate_deal_memo_dict(session)


# -------------------------------------------------------------
# 5. Direct Deal Engine Endpoints (Playground / Testing)
# -------------------------------------------------------------
class QuoteRequest(BaseModel):
    seat_count: int
    requested_discount_pct: Optional[float] = 0.0
    requested_tier: Optional[str] = None


@app.post("/api/deal/quote")
async def get_deal_quote(req: QuoteRequest):
    quote = calculate_quote(req.seat_count, req.requested_discount_pct or 0.0, req.requested_tier)
    return quote.model_dump()


class ConcessionRequest(BaseModel):
    seat_count: int
    requested_discount_pct: float
    current_tier: Optional[str] = None


@app.post("/api/deal/concession")
async def post_concession(req: ConcessionRequest):
    decision = evaluate_concession_request(req.seat_count, req.requested_discount_pct, req.current_tier)
    return decision


# -------------------------------------------------------------
# 5b. Human Escalation Queue (Sales Team Console)
# -------------------------------------------------------------
@app.get("/api/escalations")
async def list_escalations(include_resolved: bool = False):
    """
    Returns pending (and optionally resolved) human-handoff requests, newest
    first. The Sales Team Console calls this on load to hydrate its queue,
    then relies on the /ws HUMAN_HANDOFF_REQUESTED broadcast for live updates —
    this covers a console that opens after the escalation already fired.
    """
    items = escalation_queue if include_resolved else [
        e for e in escalation_queue if not e["resolved"]
    ]
    return {"escalations": list(reversed(items))}


@app.post("/api/escalations/{conversation_id}/resolve")
async def resolve_escalation_endpoint(conversation_id: str):
    """Marks an escalation as picked up once a specialist opens the handoff
    console for it, so it drops off other specialists' pending queues."""
    found = resolve_escalation(conversation_id)
    return {"resolved": found}


# -------------------------------------------------------------
# 6. WebSocket for Live Deal Cockpit Synchronization
# -------------------------------------------------------------
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            # Keep connection alive and receive any client-side triggers
            data = await websocket.receive_text()
            try:
                parsed = json.loads(data)
                if parsed.get("type") == "PING":
                    await websocket.send_json({"type": "PONG"})
                elif parsed.get("type") == "GET_SESSION":
                    cid = parsed.get("conversation_id", "default_session")
                    sess = get_or_create_session(cid)
                    await websocket.send_json({
                        "type": "SESSION_STATE_UPDATE",
                        "session": sess.model_dump()
                    })
            except Exception:
                pass
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        ws_manager.disconnect(websocket)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.server:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
