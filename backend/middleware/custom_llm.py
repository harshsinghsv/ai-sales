"""
Custom LLM Middleware: The Core Brain of the Adaptive AI Sales & Negotiation Agent.
Implements the OpenAI Chat Completions protocol expected by Agora Conversational AI Engine.
Orchestrates Deal Engine tools, CRM logging, Calendar booking, and real-time state broadcasting.
"""
import asyncio
import json
import time
import logging
import uuid
from typing import Dict, Any, List, Optional, Set
from fastapi import WebSocket
from pydantic import BaseModel, Field

from backend.deal_engine.engine import (
    calculate_quote,
    evaluate_concession_request,
    determine_tier,
    TIERS
)
from backend.middleware.sales_persona import build_system_prompt
from backend.services.sarvam_client import sarvam_client
from backend.services.hubspot_client import hubspot_client
from backend.services.calendar_client import calendar_client
from backend.services.escalation_client import escalation_client

logger = logging.getLogger("custom_llm_middleware")


# Active WebSockets for real-time Deal Cockpit streaming
class ConnectionManager:
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.discard(websocket)

    async def broadcast(self, message: Dict[str, Any]):
        dead_connections = set()
        for conn in self.active_connections:
            try:
                await conn.send_json(message)
            except Exception:
                dead_connections.add(conn)
        for dead in dead_connections:
            self.active_connections.discard(dead)


ws_manager = ConnectionManager()

# In-memory queue of human-escalation requests, so the Sales Team Console
# (app/team) can show pending calls even if it connects to the WebSocket after
# the escalation already fired — a live broadcast alone would be missed by a
# console that wasn't open yet. Capped so a long-running demo doesn't leak
# memory; oldest entries drop off first.
ESCALATION_QUEUE_MAX = 50
escalation_queue: List[Dict[str, Any]] = []


def record_escalation(entry: Dict[str, Any]) -> None:
    escalation_queue.append(entry)
    del escalation_queue[:-ESCALATION_QUEUE_MAX]


def resolve_escalation(conversation_id: str) -> bool:
    """Marks the most recent open escalation for a conversation as handled.
    Returns False if none was found (already resolved, or never existed)."""
    for entry in reversed(escalation_queue):
        if entry["conversation_id"] == conversation_id and not entry["resolved"]:
            entry["resolved"] = True
            return True
    return False


# In-Memory Session State Store keyed by conversation_id
class CustomerProfile(BaseModel):
    name: Optional[str] = None
    company: Optional[str] = None
    email: Optional[str] = None


class Requirements(BaseModel):
    seat_count: Optional[int] = None
    use_case: Optional[str] = None
    must_haves: List[str] = Field(default_factory=list)


class ObjectionItem(BaseModel):
    id: str = Field(default_factory=lambda: uuid.uuid4().hex[:6])
    type: str  # "pricing" | "competitor" | "trust" | "implementation"
    label: str
    resolved: bool = False
    context: str = ""


class DealState(BaseModel):
    tier: str = "starter"
    tier_name: str = "Starter"
    list_price_per_seat: float = 15.0
    effective_price_per_seat: float = 15.0
    current_offer_pct_off: float = 0.0
    margin_floor_pct: float = 5.0
    concessions_given: List[str] = Field(default_factory=list)
    trades_requested: List[str] = Field(default_factory=list)
    margin_remaining_pct: float = 100.0  # 100% when 0% discount, decreases as discount approaches floor


class SessionState(BaseModel):
    conversation_id: str
    customer: CustomerProfile = Field(default_factory=CustomerProfile)
    requirements: Requirements = Field(default_factory=Requirements)
    objections_raised: List[ObjectionItem] = Field(default_factory=list)
    deal_state: DealState = Field(default_factory=DealState)
    outcome: Optional[str] = None  # "lead_qualified" | "demo_booked" | "deal_won" | "escalated"
    escalated: bool = False
    last_action_toast: Optional[str] = None


# Session cache
sessions: Dict[str, SessionState] = {}

# Per-conversation message history (backend-only — not part of SessionState,
# so it isn't broadcast to the Deal Cockpit UI). Without this, the LLM only
# ever sees the customer's latest sentence and has no memory of what it
# already said, so it re-pitches the same thing turn after turn.
conversation_histories: Dict[str, List[Dict[str, str]]] = {}
MAX_HISTORY_MESSAGES = 20


def get_or_create_session(conversation_id: str) -> SessionState:
    if conversation_id not in sessions:
        sessions[conversation_id] = SessionState(conversation_id=conversation_id)
    return sessions[conversation_id]


# Available Function Tools for the Sales Agent
SALES_TOOLS: List[Dict[str, Any]] = [
    {
        "type": "function",
        "function": {
            "name": "get_pricing",
            "description": "Calculates tiered seat pricing and monthly/annual commitment costs for Claude Enterprise.",
            "parameters": {
                "type": "object",
                "properties": {
                    "seat_count": {"type": "integer", "description": "Number of employee seats required."},
                    "requested_tier": {"type": "string", "enum": ["starter", "pro", "enterprise"]}
                },
                "required": ["seat_count"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "apply_discount",
            "description": "Evaluates a requested discount percentage against the hard margin floor and pairs it with a mandatory trade concession.",
            "parameters": {
                "type": "object",
                "properties": {
                    "requested_discount_pct": {"type": "number", "description": "Discount percentage requested by customer (e.g. 10 or 20)."},
                    "seat_count": {"type": "integer", "description": "Number of seats."}
                },
                "required": ["requested_discount_pct"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "create_crm_lead",
            "description": "Creates or updates an enterprise Lead, Contact, and Deal in HubSpot CRM.",
            "parameters": {
                "type": "object",
                "properties": {
                    "name": {"type": "string", "description": "Customer name."},
                    "company": {"type": "string", "description": "Customer organization / company."},
                    "email": {"type": "string", "description": "Work email address."},
                    "seat_count": {"type": "integer", "description": "Seat volume."}
                },
                "required": ["email"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "book_meeting",
            "description": "Books a Google Meet discovery session or enterprise demo on Google Calendar.",
            "parameters": {
                "type": "object",
                "properties": {
                    "attendee_email": {"type": "string", "description": "Customer email."},
                    "datetime_str": {"type": "string", "description": "Requested meeting date or time."},
                    "meeting_type": {"type": "string", "description": "Type of meeting (e.g. 'Enterprise Solution Architecture Demo')."}
                },
                "required": ["attendee_email"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "update_session_state",
            "description": "Records newly learned buyer facts (seats, use case, must-haves, contact details, objections, deal stage) into session memory. Call whenever the customer shares or changes any of these.",
            "parameters": {
                "type": "object",
                "properties": {
                    "seat_count": {"type": "integer", "description": "Number of employee seats required."},
                    "use_case": {"type": "string", "description": "What the buyer wants to use Claude Enterprise for."},
                    "must_haves": {"type": "array", "items": {"type": "string"}, "description": "Required features or integrations."},
                    "buyer_name": {"type": "string", "description": "Buyer's first name."},
                    "company": {"type": "string", "description": "Buyer organization."},
                    "email": {"type": "string", "description": "Buyer work email."},
                    "objection": {
                        "type": "object",
                        "description": "An objection raised or resolved on this turn.",
                        "properties": {
                            "type": {"type": "string", "enum": ["pricing", "competitor", "trust", "implementation"]},
                            "label": {"type": "string"},
                            "resolved": {"type": "boolean"},
                            "context": {"type": "string"}
                        },
                        "required": ["type", "label"]
                    }
                }
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "escalate_to_human",
            "description": "Escalates conversation to a Human Executive via Slack webhook when requested or when terms deadlock.",
            "parameters": {
                "type": "object",
                "properties": {
                    "reason": {"type": "string", "description": "Reason for human escalation."},
                    "urgency": {"type": "string", "enum": ["low", "medium", "high"]}
                },
                "required": ["reason"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "end_call",
            "description": "Actually hangs up the call. Speaking a farewell alone does not end the call — this tool must be called in the same turn as the closing line, or the buyer stays connected with no one responding.",
            "parameters": {
                "type": "object",
                "properties": {
                    "reason": {"type": "string", "description": "Why the call is ending, e.g. 'meeting booked, buyer done'."}
                }
            }
        }
    }
]


async def broadcast_session_update(
    session: SessionState,
    toast_service: Optional[str] = None,
    toast_title: Optional[str] = None,
    toast_detail: Optional[str] = None,
    toast_url: Optional[str] = None,
):
    """Pushes real-time updates to connected Deal Cockpit frontends.

    toast_url is currently only set for a real (non-sandbox) calendar booking
    — the frontend uses it to open the actual Google Calendar event in a new
    tab the moment the toast arrives.
    """
    payload = {
        "type": "SESSION_STATE_UPDATE",
        "session": session.model_dump(),
    }
    if toast_title:
        payload["toast"] = {
            "id": uuid.uuid4().hex[:6],
            "service": toast_service or "deal",
            "title": toast_title,
            "detail": toast_detail or "",
            "url": toast_url,
        }
    await ws_manager.broadcast(payload)


async def broadcast_tool_call(
    conversation_id: str,
    tool: str,
    args: Dict[str, Any],
    result: Dict[str, Any],
    source: str = "mcp",
    duration_ms: Optional[int] = None,
):
    """
    Announces a tool invocation to the Deal Cockpit so the UI can show the
    agent's actions as they happen.

    `source` records which surface performed the call — "mcp" when Agora's
    Conversational AI Engine called our MCP server itself, "middleware" when it
    ran inside the custom-LLM path. Surfacing the difference is the point: it
    shows the Agora engine doing the tool orchestration.
    """
    await ws_manager.broadcast(
        {
            "type": "AGENT_TOOL_CALL",
            "conversation_id": conversation_id,
            "tool": tool,
            "source": source,
            "args": args,
            "result_summary": _summarize_tool_result(result),
            "duration_ms": duration_ms,
            "timestamp": int(time.time() * 1000),
        }
    )


def _summarize_tool_result(result: Dict[str, Any]) -> str:
    """One short line describing what a tool actually did, for the UI feed."""
    if not isinstance(result, dict):
        return str(result)[:160]
    for key in ("message", "status", "summary", "tier_name"):
        value = result.get(key)
        if isinstance(value, str) and value:
            return value[:160]
    return ", ".join(f"{k}={v}" for k, v in list(result.items())[:3])[:160]


# Session memory is updated by the LLM itself via the update_session_state
# tool — no regex extraction. Seat changes still recompute the tier so the
# margin floor always tracks the right plan.
def _apply_state_update(args: Dict[str, Any], session: SessionState):
    if args.get("seat_count"):
        seats = int(args["seat_count"])
        session.requirements.seat_count = seats
        tier_key = determine_tier(seats)
        session.deal_state.tier = tier_key
        session.deal_state.tier_name = TIERS[tier_key]["name"]
        session.deal_state.list_price_per_seat = TIERS[tier_key]["price_per_seat_monthly"]
        session.deal_state.margin_floor_pct = TIERS[tier_key]["margin_floor_pct"]
    if args.get("use_case"):
        session.requirements.use_case = args["use_case"]
    if args.get("must_haves"):
        session.requirements.must_haves = list(args["must_haves"])
    if args.get("buyer_name"):
        session.customer.name = str(args["buyer_name"]).title()
    if args.get("company"):
        session.customer.company = str(args["company"])
    if args.get("email"):
        session.customer.email = str(args["email"])
    obj = args.get("objection") or {}
    if obj.get("type") and obj.get("label"):
        existing = next((o for o in session.objections_raised if o.type == obj["type"]), None)
        if existing:
            existing.label = obj["label"]
            existing.resolved = bool(obj.get("resolved", existing.resolved))
            existing.context = obj.get("context", existing.context)
        else:
            session.objections_raised.append(
                ObjectionItem(
                    type=obj["type"],
                    label=obj["label"],
                    resolved=bool(obj.get("resolved", False)),
                    context=obj.get("context", ""),
                )
            )


async def execute_tool_call(name: str, args: Dict[str, Any], session: SessionState) -> Dict[str, Any]:
    """Executes local deal engine / CRM / calendar tool and updates session state."""
    logger.info(f"Executing tool: {name} with args: {args}")

    if name == "get_pricing":
        seats = args.get("seat_count") or session.requirements.seat_count or 20
        session.requirements.seat_count = seats
        # Preserve any active negotiated offer: re-quoting must not silently
        # reset the effective price back to list.
        active_offer = session.deal_state.current_offer_pct_off
        quote = calculate_quote(
            seats,
            requested_discount_pct=active_offer,
            requested_tier=args.get("requested_tier"),
        )
        session.deal_state.tier = quote.tier
        session.deal_state.tier_name = quote.tier_name
        session.deal_state.list_price_per_seat = quote.list_price_per_seat
        session.deal_state.margin_floor_pct = quote.margin_floor_pct
        if active_offer > 0:
            session.deal_state.current_offer_pct_off = quote.discount_pct
            session.deal_state.effective_price_per_seat = quote.effective_price_per_seat
            floor = quote.margin_floor_pct
            consumed = quote.discount_pct / floor if floor > 0 else 0
            session.deal_state.margin_remaining_pct = max(0.0, round((1.0 - consumed) * 100.0, 1))
        else:
            session.deal_state.effective_price_per_seat = quote.effective_price_per_seat
            session.deal_state.margin_remaining_pct = 100.0

        await broadcast_session_update(
            session,
            toast_service="deal",
            toast_title="Pricing Quote Calculated",
            toast_detail=f"{quote.tier_name} Tier: ${quote.list_price_per_seat}/seat/mo for {seats} seats."
        )
        return quote.model_dump()

    elif name == "apply_discount":
        discount_pct = float(args.get("requested_discount_pct", 0.0))
        seats = args.get("seat_count") or session.requirements.seat_count or 20
        session.requirements.seat_count = seats
        # Re-derive the tier from the seat count before evaluating, so the
        # discount is always judged against the correct plan's margin floor.
        # An explicit tier arg wins; otherwise the seats-implied tier wins over
        # any stale stored tier (e.g. default Starter with 50 seats).
        arg_tier = (args.get("current_tier") or "").lower()
        tier_key = arg_tier if arg_tier in TIERS else determine_tier(seats)
        session.deal_state.tier = tier_key
        session.deal_state.tier_name = TIERS[tier_key]["name"]
        session.deal_state.list_price_per_seat = TIERS[tier_key]["price_per_seat_monthly"]
        session.deal_state.margin_floor_pct = TIERS[tier_key]["margin_floor_pct"]
        result = evaluate_concession_request(seats, discount_pct, current_tier=tier_key)

        approved_pct = result["approved_discount_pct"]
        quote_data = result["quote"]
        # Sync the full tier snapshot from the authoritative quote result so
        # list price, floor, and effective price can never disagree.
        session.deal_state.tier = quote_data["tier"]
        session.deal_state.tier_name = quote_data["tier_name"]
        session.deal_state.list_price_per_seat = quote_data["list_price_per_seat"]
        session.deal_state.margin_floor_pct = quote_data["margin_floor_pct"]
        session.deal_state.current_offer_pct_off = approved_pct
        session.deal_state.effective_price_per_seat = quote_data["effective_price_per_seat"]

        # Calculate visual margin gauge (100% when 0% discount, down to 0% if discount reaches 2x floor)
        floor = session.deal_state.margin_floor_pct
        consumed_ratio = approved_pct / floor if floor > 0 else 0
        session.deal_state.margin_remaining_pct = max(0.0, round((1.0 - consumed_ratio) * 100.0, 1))

        if approved_pct > 0:
            trade = result["required_trade"]
            session.deal_state.concessions_given = [f"{approved_pct:.0f}% discount"]
            session.deal_state.trades_requested = [trade]
            # Resolve pricing objection
            for o in session.objections_raised:
                if o.type == "pricing":
                    o.resolved = True

        toast_title = "Concession Trade Approved" if result["status"] == "conditional_approval" else "Margin Floor Enforced"
        await broadcast_session_update(
            session,
            toast_service="deal",
            toast_title=toast_title,
            toast_detail=f"Approved: {approved_pct:.0f}% | Trade: {result.get('required_trade') or 'Alternative Lever'}"
        )
        return result

    elif name == "create_crm_lead":
        name_val = args.get("name") or session.customer.name
        company_val = args.get("company") or session.customer.company
        email_val = args.get("email") or session.customer.email
        seats = args.get("seat_count") or session.requirements.seat_count or 20

        res = await hubspot_client.create_or_update_lead(
            name=name_val,
            company=company_val,
            email=email_val,
            seat_count=seats,
            tier=session.deal_state.tier,
            deal_value=session.deal_state.effective_price_per_seat * seats * 12
        )
        session.outcome = "lead_qualified"
        await broadcast_session_update(
            session,
            toast_service="hubspot",
            toast_title="HubSpot CRM Deal Logged",
            toast_detail=f"Contact: {email_val} | Deal: {res.get('deal_name', 'Claude Enterprise Deal')}"
        )
        return res

    elif name == "book_meeting":
        email_val = args.get("attendee_email") or session.customer.email or "prospect@example.com"
        meeting_type = args.get("meeting_type") or "Enterprise Solution Architecture Demo"
        res = await calendar_client.book_meeting(
            attendee_email=email_val,
            # The buyer's requested time, in their own words ("tomorrow at 3pm").
            # Previously dropped, which silently booked every demo at the same
            # default slot no matter what was agreed on the call.
            start_time_iso=args.get("datetime_str"),
            meeting_type=meeting_type,
            notes=f"Seats: {session.requirements.seat_count}. Tier: {session.deal_state.tier_name}"
        )
        session.outcome = "demo_booked"

        # Never claim an invite was sent when it was only simulated.
        is_real = not res.get("is_sandbox", True)
        toast_url = None
        if is_real:
            toast_title = "Meeting Booked - Invite Sent"
            toast_detail = (
                f"{res.get('start_time')} - Google Calendar invite emailed to {email_val}"
            )
            # Opened automatically in a new tab by the frontend the instant
            # this toast arrives, so the booking is visibly real, not just claimed.
            toast_url = res.get("calendar_url") or res.get("google_meet_url")
        else:
            toast_title = "Meeting Booked (Simulated)"
            toast_detail = (
                f"{res.get('start_time')} - no real invite sent; "
                "connect Google Calendar to make this live"
            )

        await broadcast_session_update(
            session,
            toast_service="calendar",
            toast_title=toast_title,
            toast_detail=toast_detail,
            toast_url=toast_url,
        )
        return res

    elif name == "update_session_state":
        _apply_state_update(args, session)
        await broadcast_session_update(session)
        return {"status": "state_updated"}

    elif name == "escalate_to_human":
        reason = args.get("reason", "Customer requested enterprise human specialist.")
        urgency = args.get("urgency", "high")
        session.escalated = True
        session.outcome = "escalated"

        # Live handoff: the specialist opens this link and joins the buyer's
        # own Agora RTC channel, so the escalation is a real voice takeover
        # rather than a notification the buyer never sees.
        from backend.config import settings as _settings

        handoff_url = (
            f"{_settings.HUMAN_HANDOFF_BASE_URL}/human/{session.conversation_id}"
        )

        res = await escalation_client.dispatch_escalation(
            reason=reason,
            urgency=urgency,
            customer_name=session.customer.name,
            company=session.customer.company,
            seat_count=session.requirements.seat_count,
            deal_tier=session.deal_state.tier_name,
            objections=[o.model_dump() for o in session.objections_raised],
            transcript_summary=f"Escalation trigger: {reason}. Customer requirements: {session.requirements.seat_count} seats.",
            suggested_next_step=f"Join the live call now: {handoff_url}",
        )
        if isinstance(res, dict):
            res["handoff_url"] = handoff_url

        escalation_record = {
            "conversation_id": session.conversation_id,
            "customer_name": session.customer.name or "Prospective Buyer",
            "company": session.customer.company or "Unspecified",
            "seat_count": session.requirements.seat_count,
            "tier_name": session.deal_state.tier_name,
            "reason": reason,
            "urgency": urgency,
            "handoff_url": handoff_url,
            "timestamp": int(time.time() * 1000),
            "resolved": False,
        }
        record_escalation(escalation_record)

        # HUMAN_HANDOFF_REQUESTED is the live "ring" — a Sales Team Console
        # already connected sees it instantly. A console that connects later
        # hydrates the same data from GET /api/escalations instead.
        await ws_manager.broadcast(
            {"type": "HUMAN_HANDOFF_REQUESTED", **escalation_record}
        )
        await broadcast_session_update(
            session,
            toast_service="slack",
            toast_title="🚨 Human Specialist Escalated",
            toast_detail=f"Live handoff link dispatched: {reason}"
        )

    elif name == "end_call":
        # Saying a farewell out loud does not end an RTC call by itself — the
        # agent has no direct way to leave the channel or stop itself, so
        # without this the buyer stays connected with no one responding after
        # Emily "hangs up" verbally. This broadcasts a request that the
        # frontend (which does control the RTC session) acts on immediately.
        reason = args.get("reason", "Conversation complete.")
        if not session.outcome:
            session.outcome = "lead_qualified"

        await ws_manager.broadcast(
            {
                "type": "CALL_END_REQUESTED",
                "conversation_id": session.conversation_id,
                "reason": reason,
                "timestamp": int(time.time() * 1000),
            }
        )
        res = {"status": "call_ending", "reason": reason}

    return res


# OpenAI Protocol Chat Completion Endpoint Handler
async def handle_chat_completion(request_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Handles Agora Conversational AI chat completion requests in a single LLM
    pass: the model may call tools (pricing, discount, CRM, calendar,
    escalation, session memory), tool outputs are fed back into the SAME
    model turn as `role: tool` messages, and the model then speaks the final
    speech-ready reply directly. No second naturalization call.
    """
    messages: List[Dict[str, str]] = request_data.get("messages", [])
    conversation_id = (
        request_data.get("session_id")
        or request_data.get("user")
        or _session_key_from_agora(request_data)
        or "default_session"
    )
    if conversation_id == "default_session":
        logger.warning("No session_id/user/turn context in chat request; using shared default_session")
    session = get_or_create_session(conversation_id)

    # Append this turn's incoming message(s) to the running conversation history
    # and keep only a bounded recent window so the prompt doesn't grow unbounded.
    history = conversation_histories.setdefault(conversation_id, [])
    if messages:
        history.extend(messages)
    recent_history = history[-MAX_HISTORY_MESSAGES:]

    # Stage-aware adaptive persona rebuilt every turn from live session state
    system_prompt = build_system_prompt(session)
    llm_messages: List[Dict[str, Any]] = [
        {"role": "system", "content": system_prompt},
        *recent_history
    ]

    # Single-pass tool loop (max 2 model iterations): execute tools, feed
    # results back as tool messages, let the model finish speaking.
    for _ in range(2):
        llm_res = await sarvam_client.generate_chat_completion(
            llm_messages,
            tools=SALES_TOOLS
        )
        choice = llm_res.get("choices", [{}])[0]
        message_obj = choice.get("message", {})
        tool_calls = message_obj.get("tool_calls") or []

        if not tool_calls:
            content = (message_obj.get("content") or "").strip()
            if not content:
                content = (
                    "Bilkul! Claude Enterprise empowers engineering and product teams "
                    "with a 1,000,000-token (1M) context window powered by Claude Opus 5 and native GitHub sync. Kya aap pricing dekhna "
                    "chahenge, ya pehle ek quick architecture demo?"
                )
            history.append({"role": "assistant", "content": content})
            return _format_completion_response(content)

        # Preserve the assistant tool-call message, then run each tool
        llm_messages.append({
            "role": "assistant",
            "content": message_obj.get("content"),
            "tool_calls": tool_calls,
        })
        for tool_call in tool_calls:
            fn = tool_call.get("function", {})
            fn_name = fn.get("name", "")
            try:
                fn_args = json.loads(fn.get("arguments", "{}"))
            except (json.JSONDecodeError, TypeError):
                fn_args = {}

            tool_output = await execute_tool_call(fn_name, fn_args, session)
            llm_messages.append({
                "role": "tool",
                "tool_call_id": tool_call.get("id", fn_name),
                "name": fn_name,
                "content": json.dumps(tool_output, default=str),
            })

    # Model kept calling tools without speaking — close with real numbers
    content = _numbers_reply(session)
    history.append({"role": "assistant", "content": content})
    return _format_completion_response(content)


def _session_key_from_agora(request_data: Dict[str, Any]) -> Optional[str]:
    """Derives a stable session key from Agora custom-LLM fields when no
    explicit session_id/user is present (Agora injects turn_id + timestamp)."""
    turn_id = request_data.get("turn_id")
    channel = request_data.get("channel") or request_data.get("channel_name")
    if channel is not None:
        return str(channel)
    if turn_id is not None:
        return f"agora_turn_{turn_id}"
    return None


def _numbers_reply(session: "SessionState") -> str:
    """
    Safety reply built from real session-state numbers when the model
    finishes on tools without speaking.
    """
    seats = session.requirements.seat_count or 20
    tier = session.deal_state.tier_name
    price = session.deal_state.effective_price_per_seat
    monthly = seats * price
    return (
        f"Theek hai! {seats} seats ke liye {tier} tier pe final price "
        f"${price:.2f}/seat/month hai — yani ${monthly:,.0f}/month. "
        f"Kya yeh terms aapke finance team ke liye workable hain?"
    )


def _format_completion_response(content: str) -> Dict[str, Any]:
    return {
        "id": f"chatcmpl-{uuid.uuid4().hex[:12]}",
        "object": "chat.completion",
        "created": int(asyncio.get_event_loop().time()),
        "model": "sarvam-105b-conversations",
        "choices": [
            {
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": content
                },
                "finish_reason": "stop"
            }
        ]
    }

