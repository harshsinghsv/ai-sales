"""
Human Escalation Service.
Dispatches structured alerts to Slack incoming webhook (or email) with full lead context.
"""
import logging
from typing import Dict, Any, Optional, List
import httpx
from backend.config import settings

logger = logging.getLogger("escalation_client")


class EscalationClient:
    def __init__(self):
        self.webhook_url = settings.SLACK_WEBHOOK_URL

    @property
    def is_configured(self) -> bool:
        return bool(self.webhook_url and self.webhook_url.startswith("http"))

    async def dispatch_escalation(
        self,
        reason: str,
        urgency: str,
        customer_name: Optional[str],
        company: Optional[str],
        seat_count: Optional[int],
        deal_tier: Optional[str],
        objections: List[Dict[str, Any]],
        transcript_summary: str,
        suggested_next_step: str = "Senior Account Executive to call back within 15 minutes."
    ) -> Dict[str, Any]:
        """
        Sends formatted Slack Block Kit alert or logs structured fallback.
        """
        severity_emoji = "🚨" if urgency.lower() == "high" else "⚠️"
        blocks = [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": f"{severity_emoji} Human Escalation Required: {company or 'Enterprise Lead'}"
                }
            },
            {
                "type": "section",
                "fields": [
                    {"type": "mrkdwn", "text": f"*Customer:* {customer_name or 'Prospective Buyer'}"},
                    {"type": "mrkdwn", "text": f"*Company:* {company or 'Unspecified'}"},
                    {"type": "mrkdwn", "text": f"*Seats / Tier:* {seat_count or 20} seats ({deal_tier or 'Enterprise'})"},
                    {"type": "mrkdwn", "text": f"*Urgency:* {urgency.upper()}"}
                ]
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"*Reason:* {reason}\n*Objections Logged:* {', '.join([o.get('type', 'general') for o in objections]) if objections else 'None'}"
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"*Conversation Summary:*\n>{transcript_summary}"
                }
            },
            {
                "type": "context",
                "elements": [
                    {"type": "mrkdwn", "text": f"💡 *Suggested Action:* {suggested_next_step}"}
                ]
            }
        ]

        if not self.is_configured:
            logger.info(f"Slack webhook not configured. Escalation logged locally: {reason}")
            return {
                "status": "sandbox_dispatched",
                "is_sandbox": True,
                "urgency": urgency,
                "reason": reason,
                "summary": transcript_summary,
                "blocks": blocks,
                "message": f"Escalation notification prepared for {company or 'Customer'}."
            }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(self.webhook_url, json={"blocks": blocks})
                return {
                    "status": "dispatched" if res.status_code == 200 else "error",
                    "is_sandbox": False,
                    "http_status": res.status_code
                }
        except Exception as e:
            logger.error(f"Error sending Slack escalation webhook: {e}")
            return {"status": "error", "error": str(e), "is_sandbox": True}


escalation_client = EscalationClient()
