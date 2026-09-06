"""
Claude Enterprise Deal Engine — MCP Server.

Exposes the sales agent's actions as Model Context Protocol tools over
streamable HTTP, so Agora's Conversational AI Engine calls them itself
(`llm.mcp_servers`) rather than the tools living only inside our custom-LLM
middleware. This is what makes the agent agentic on the Agora-managed pipeline:
managed OpenAI has no access to our Python functions otherwise.

Every tool delegates to `execute_tool_call`, the same function the custom-LLM
path uses — one implementation of the deal logic, two transports. Because
`execute_tool_call` broadcasts over the cockpit WebSocket, an MCP tool call
invoked by Agora lights up the Deal Cockpit in real time.

Session scoping: the agent's conversation_id travels in the MCP URL as
`?cid=<conversation_id>` (set per session by the Next.js /api/invite-agent
route), so the model never has to remember or echo a session id. An explicit
`conversation_id` argument is accepted as a fallback.
"""
import logging
import time
from typing import Any, Dict, List, Optional

from mcp.server.mcpserver import MCPServer, Context

from backend.middleware.custom_llm import (
    broadcast_tool_call,
    execute_tool_call,
    get_or_create_session,
)

logger = logging.getLogger("deal_engine_mcp")

mcp = MCPServer(
    name="Claude Enterprise Deal Engine",
    instructions=(
        "Pricing, discounting, CRM, scheduling and escalation tools for the "
        "Claude Enterprise sales agent. Call get_pricing whenever seats or "
        "tier change, apply_discount for any discount request, "
        "update_session_state whenever the buyer reveals a new fact, and "
        "create_crm_lead + book_meeting together once a demo is agreed."
    ),
)

DEFAULT_CONVERSATION_ID = "default_session"


def _conversation_id_from_context(
    ctx: Optional[Context], explicit: Optional[str]
) -> str:
    """
    Resolves which sales session a tool call belongs to.

    Preference order: the `cid` query parameter on the MCP endpoint URL (set
    per session when the agent is started), then an explicit argument, then a
    shared default so a misconfigured URL degrades instead of failing.
    """
    if ctx is not None:
        try:
            request = ctx.request_context.request
            if request is not None:
                cid = request.query_params.get("cid")
                if cid:
                    return cid
        except Exception:  # pragma: no cover - transport detail
            logger.debug("No HTTP request available on MCP context", exc_info=True)

    return explicit or DEFAULT_CONVERSATION_ID


async def _run(
    tool: str,
    args: Dict[str, Any],
    ctx: Optional[Context],
    conversation_id: Optional[str],
) -> Dict[str, Any]:
    """Dispatches to the shared deal-engine implementation."""
    cid = _conversation_id_from_context(ctx, conversation_id)
    session = get_or_create_session(cid)
    # Drop unset optional arguments so tools keep their existing defaults.
    cleaned = {k: v for k, v in args.items() if v is not None}

    started = time.perf_counter()
    result = await execute_tool_call(tool, cleaned, session)
    duration_ms = int((time.perf_counter() - started) * 1000)

    logger.info(
        "MCP tool %s executed for conversation %s in %dms", tool, cid, duration_ms
    )
    # Surface the call in the Deal Cockpit, tagged as an Agora-driven MCP call.
    await broadcast_tool_call(
        conversation_id=cid,
        tool=tool,
        args=cleaned,
        result=result,
        source="mcp",
        duration_ms=duration_ms,
    )
    return result


@mcp.tool()
async def get_pricing(
    seat_count: int,
    ctx: Context,
    requested_tier: Optional[str] = None,
    conversation_id: Optional[str] = None,
) -> Dict[str, Any]:
    """Calculate tiered seat pricing and monthly/annual cost for Claude Enterprise.

    Args:
        seat_count: Number of employee seats required.
        requested_tier: Optional tier override — one of starter, pro, enterprise.
    """
    return await _run(
        "get_pricing",
        {"seat_count": seat_count, "requested_tier": requested_tier},
        ctx,
        conversation_id,
    )


@mcp.tool()
async def apply_discount(
    requested_discount_pct: float,
    ctx: Context,
    seat_count: Optional[int] = None,
    conversation_id: Optional[str] = None,
) -> Dict[str, Any]:
    """Evaluate a requested discount against the hard margin floor and pair it
    with the mandatory trade concession.

    Args:
        requested_discount_pct: Discount percentage the buyer asked for.
        seat_count: Seat volume the discount applies to.
    """
    return await _run(
        "apply_discount",
        {
            "requested_discount_pct": requested_discount_pct,
            "seat_count": seat_count,
        },
        ctx,
        conversation_id,
    )


@mcp.tool()
async def create_crm_lead(
    email: str,
    ctx: Context,
    name: Optional[str] = None,
    company: Optional[str] = None,
    seat_count: Optional[int] = None,
    conversation_id: Optional[str] = None,
) -> Dict[str, Any]:
    """Create or update the Lead, Contact and Deal records in HubSpot CRM.

    Args:
        email: Buyer work email address.
        name: Buyer name.
        company: Buyer organization.
        seat_count: Seat volume for the deal record.
    """
    return await _run(
        "create_crm_lead",
        {
            "email": email,
            "name": name,
            "company": company,
            "seat_count": seat_count,
        },
        ctx,
        conversation_id,
    )


@mcp.tool()
async def book_meeting(
    attendee_email: str,
    ctx: Context,
    datetime_str: Optional[str] = None,
    meeting_type: Optional[str] = None,
    conversation_id: Optional[str] = None,
) -> Dict[str, Any]:
    """Book a discovery session or enterprise demo on Google Calendar.

    Args:
        attendee_email: Buyer email to invite.
        datetime_str: Requested date or time, in the buyer's own words.
        meeting_type: For example 'Enterprise Solution Architecture Demo'.
    """
    return await _run(
        "book_meeting",
        {
            "attendee_email": attendee_email,
            "datetime_str": datetime_str,
            "meeting_type": meeting_type,
        },
        ctx,
        conversation_id,
    )


@mcp.tool()
async def update_session_state(
    ctx: Context,
    seat_count: Optional[int] = None,
    use_case: Optional[str] = None,
    must_haves: Optional[List[str]] = None,
    buyer_name: Optional[str] = None,
    company: Optional[str] = None,
    email: Optional[str] = None,
    objection: Optional[Dict[str, Any]] = None,
    conversation_id: Optional[str] = None,
) -> Dict[str, Any]:
    """Record newly learned buyer facts into session memory. Call this whenever
    the buyer shares or changes seats, use case, must-haves, contact details, or
    raises/resolves an objection.

    Args:
        seat_count: Number of employee seats required.
        use_case: What the buyer wants to use Claude Enterprise for.
        must_haves: Required features or integrations.
        buyer_name: Buyer's name.
        company: Buyer organization.
        email: Buyer work email.
        objection: An objection raised or resolved, as
            {type: pricing|competitor|trust|implementation, label, resolved, context}.
    """
    return await _run(
        "update_session_state",
        {
            "seat_count": seat_count,
            "use_case": use_case,
            "must_haves": must_haves,
            "buyer_name": buyer_name,
            "company": company,
            "email": email,
            "objection": objection,
        },
        ctx,
        conversation_id,
    )


@mcp.tool()
async def escalate_to_human(
    reason: str,
    ctx: Context,
    urgency: Optional[str] = None,
    conversation_id: Optional[str] = None,
) -> Dict[str, Any]:
    """Hand the conversation to a human sales executive, with full context.
    Call this when the buyer asks for a human or when terms deadlock.

    Args:
        reason: Why the escalation is needed.
        urgency: One of low, medium, high.
    """
    return await _run(
        "escalate_to_human",
        {"reason": reason, "urgency": urgency},
        ctx,
        conversation_id,
    )


def build_mcp_app():
    """
    Starlette app serving the MCP streamable-HTTP transport.

    stateless_http keeps each tool call independent, which is what Agora's
    engine expects when calling a remote MCP server; json_response avoids
    requiring an SSE-capable client.
    """
    return mcp.streamable_http_app(
        streamable_http_path="/",
        stateless_http=True,
        json_response=True,
    )
