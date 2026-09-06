"""
HubSpot CRM v3 Integration Service.
Creates and updates Contacts, Deals, and Timeline Notes for full audit trail.
"""
import logging
from typing import Dict, Any, Optional
import httpx
from backend.config import settings

logger = logging.getLogger("hubspot_client")


class HubSpotClient:
    def __init__(self):
        self.access_token = settings.HUBSPOT_ACCESS_TOKEN
        self.base_url = "https://api.hubapi.com/crm/v3"

    @property
    def is_configured(self) -> bool:
        return bool(self.access_token and len(self.access_token.strip()) > 10)

    def _headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }

    async def create_or_update_lead(
        self,
        name: Optional[str],
        company: Optional[str],
        email: Optional[str],
        seat_count: Optional[int],
        tier: Optional[str],
        deal_value: Optional[float],
        requirements: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Creates or updates Contact and associated Deal in HubSpot CRM.
        """
        first_name = name.split()[0] if name else "Prospective"
        last_name = " ".join(name.split()[1:]) if name and len(name.split()) > 1 else "Buyer"
        contact_email = email or f"{first_name.lower()}.{company.lower().replace(' ', '') if company else 'lead'}@example.com"
        company_name = company or "Target Enterprise"

        if not self.is_configured:
            # Explicitly mark sandbox status
            logger.info("HubSpot API token not configured. Running in [Sandbox Mode - Key Required].")
            return {
                "status": "sandbox_success",
                "is_sandbox": True,
                "contact_id": "sandbox_ct_8921",
                "deal_id": "sandbox_deal_4091",
                "deal_name": f"{company_name} — {tier.title() if tier else 'Claude Enterprise'} ({seat_count or 20} seats)",
                "amount": deal_value or 8400.0,
                "message": f"Lead created in sandbox for {contact_email} ({company_name})"
            }

        async with httpx.AsyncClient(timeout=15.0) as client:
            try:
                # 1. Create or Search Contact
                contact_res = await client.post(
                    f"{self.base_url}/objects/contacts",
                    headers=self._headers(),
                    json={
                        "properties": {
                            "email": contact_email,
                            "firstname": first_name,
                            "lastname": last_name,
                            "company": company_name,
                            "hs_lead_status": "OPEN_DEAL"
                        }
                    }
                )
                contact_data = contact_res.json()
                contact_id = contact_data.get("id")

                # 2. Create Deal
                deal_name = f"{company_name} — {tier.title() if tier else 'Pro'} ({seat_count or 20} seats)"
                deal_res = await client.post(
                    f"{self.base_url}/objects/deals",
                    headers=self._headers(),
                    json={
                        "properties": {
                            "dealname": deal_name,
                            "dealstage": "appointmentscheduled",
                            "pipeline": "default",
                            "amount": str(deal_value or 0.0),
                            "description": f"Seats: {seat_count}. Requirements: {requirements or 'N/A'}"
                        }
                    }
                )
                deal_data = deal_res.json()
                deal_id = deal_data.get("id")

                # 3. Associate Deal with Contact
                if contact_id and deal_id:
                    await client.put(
                        f"{self.base_url}/objects/deals/{deal_id}/associations/contacts/{contact_id}/deal_to_contact",
                        headers=self._headers()
                    )

                return {
                    "status": "success",
                    "is_sandbox": False,
                    "contact_id": contact_id,
                    "deal_id": deal_id,
                    "deal_name": deal_name,
                    "amount": deal_value,
                    "hubspot_url": f"https://app.hubspot.com/contacts/objects/deals/{deal_id}" if deal_id else None
                }

            except Exception as e:
                logger.error(f"Error creating lead in HubSpot: {e}")
                return {
                    "status": "error",
                    "is_sandbox": True,
                    "error": str(e),
                    "contact_id": "fallback_ct_001",
                    "deal_id": "fallback_deal_001"
                }

    async def log_deal_timeline_note(
        self,
        deal_id: str,
        note_content: str
    ) -> Dict[str, Any]:
        """
        Logs negotiation concessions, objections, and call summary to HubSpot deal timeline.
        """
        if not self.is_configured or deal_id.startswith("sandbox_") or deal_id.startswith("fallback_"):
            return {
                "status": "sandbox_logged",
                "is_sandbox": True,
                "deal_id": deal_id,
                "note_preview": note_content[:80] + "..."
            }

        async with httpx.AsyncClient(timeout=10.0) as client:
            try:
                res = await client.post(
                    f"{self.base_url}/objects/notes",
                    headers=self._headers(),
                    json={
                        "properties": {
                            "hs_note_body": note_content
                        }
                    }
                )
                note_data = res.json()
                note_id = note_data.get("id")

                if note_id and deal_id:
                    await client.put(
                        f"{self.base_url}/objects/notes/{note_id}/associations/deals/{deal_id}/note_to_deal",
                        headers=self._headers()
                    )

                return {
                    "status": "success",
                    "is_sandbox": False,
                    "note_id": note_id
                }
            except Exception as e:
                logger.error(f"Error logging HubSpot timeline note: {e}")
                return {"status": "error", "error": str(e)}


hubspot_client = HubSpotClient()
