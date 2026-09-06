"""
Google Calendar API v3 Integration Service.
Books discovery meetings and live product demos with auto-generated Google Meet links.
"""
import datetime
import logging
import uuid
from typing import Dict, Any, Optional
import httpx
from backend.config import settings

logger = logging.getLogger("calendar_client")


class GoogleCalendarClient:
    def __init__(self):
        self.credentials_json = settings.GOOGLE_CALENDAR_CREDENTIALS

    @property
    def is_configured(self) -> bool:
        return bool(self.credentials_json and len(self.credentials_json.strip()) > 20)

    async def book_meeting(
        self,
        attendee_email: str,
        start_time_iso: Optional[str] = None,
        meeting_type: str = "Enterprise Solution Architecture Demo",
        notes: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Books a Google Calendar event with Google Meet link.
        """
        # Calculate meeting window (default tomorrow at 3:00 PM IST if not passed)
        now = datetime.datetime.now(datetime.timezone.utc)
        if start_time_iso:
            try:
                start_dt = datetime.datetime.fromisoformat(start_time_iso.replace("Z", "+00:00"))
            except Exception:
                start_dt = now + datetime.timedelta(days=1, hours=3)
        else:
            start_dt = now + datetime.timedelta(days=1, hours=3)

        end_dt = start_dt + datetime.timedelta(minutes=45)
        meet_code = f"{uuid.uuid4().hex[:3]}-{uuid.uuid4().hex[3:7]}-{uuid.uuid4().hex[7:10]}"
        meet_link = f"https://meet.google.com/{meet_code}"

        if not self.is_configured:
            logger.info("Google Calendar credentials not set. Running in [Sandbox Mode - Key Required].")
            return {
                "status": "sandbox_booked",
                "is_sandbox": True,
                "event_id": f"cal_evt_{uuid.uuid4().hex[:8]}",
                "meeting_type": meeting_type,
                "attendee_email": attendee_email,
                "start_time": start_dt.strftime("%A, %b %d at %I:%M %p UTC"),
                "end_time": end_dt.strftime("%I:%M %p UTC"),
                "google_meet_url": meet_link,
                "calendar_url": f"https://calendar.google.com/calendar/r/eventedit?text={meeting_type.replace(' ', '+')}",
                "message": f"Demo booked with {attendee_email} for {start_dt.strftime('%b %d, %I:%M %p')} with Google Meet link."
            }

        # If real OAuth or Service Account token is provided, execute via Google Calendar API v3
        try:
            # We can use Google API directly via REST endpoint:
            # POST https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1
            headers = {
                "Authorization": f"Bearer {self.credentials_json}",
                "Content-Type": "application/json"
            }
            body = {
                "summary": f"TeamSync: {meeting_type}",
                "description": f"Automated booking via TeamSync Sales Agent.\nNotes: {notes or 'Inbound customer negotiation'}",
                "start": {"dateTime": start_dt.isoformat()},
                "end": {"dateTime": end_dt.isoformat()},
                "attendees": [{"email": attendee_email}],
                "conferenceData": {
                    "createRequest": {
                        "requestId": uuid.uuid4().hex,
                        "conferenceSolutionKey": {"type": "hangoutsMeet"}
                    }
                }
            }
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(
                    "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1",
                    headers=headers,
                    json=body
                )
                if res.status_code == 200:
                    data = res.json()
                    return {
                        "status": "booked",
                        "is_sandbox": False,
                        "event_id": data.get("id"),
                        "meeting_type": meeting_type,
                        "attendee_email": attendee_email,
                        "start_time": start_dt.strftime("%A, %b %d at %I:%M %p"),
                        "google_meet_url": data.get("hangoutLink", meet_link),
                        "calendar_url": data.get("htmlLink")
                    }
        except Exception as e:
            logger.error(f"Error booking Google Calendar API event: {e}")

        return {
            "status": "fallback_booked",
            "is_sandbox": True,
            "event_id": f"cal_evt_{uuid.uuid4().hex[:8]}",
            "meeting_type": meeting_type,
            "attendee_email": attendee_email,
            "start_time": start_dt.strftime("%A, %b %d at %I:%M %p UTC"),
            "google_meet_url": meet_link
        }


calendar_client = GoogleCalendarClient()
