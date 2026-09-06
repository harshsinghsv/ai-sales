"""
Google Calendar API v3 Integration Service.

Books discovery meetings and live product demos with auto-generated Google Meet
links, on a real calendar, with a real invite emailed to the buyer.

Auth model: an OAuth *user* refresh token (see
backend/scripts/google_calendar_auth.py). Access tokens live ~1 hour, so one is
minted on demand and cached until shortly before expiry. A service account is
deliberately not used — it cannot invite attendees without Google Workspace
domain-wide delegation, which would make the invite silently not arrive.

Falls back to a clearly-labelled sandbox response when no credentials are
configured, so the demo still runs end to end without Google set up.
"""
import datetime
import logging
import re
import time
import uuid
from typing import Any, Dict, Optional, Tuple

import httpx

from backend.config import settings

logger = logging.getLogger("calendar_client")

TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token"
CALENDAR_API = "https://www.googleapis.com/calendar/v3"

try:  # Python 3.9+ stdlib; falls back to fixed IST offset if tzdata is absent.
    from zoneinfo import ZoneInfo

    _HAS_ZONEINFO = True
except ImportError:  # pragma: no cover
    _HAS_ZONEINFO = False


WEEKDAYS = {
    "monday": 0,
    "tuesday": 1,
    "wednesday": 2,
    "thursday": 3,
    "friday": 4,
    "saturday": 5,
    "sunday": 6,
}


def _local_timezone() -> datetime.tzinfo:
    """Timezone bare times like '3pm' are interpreted in."""
    if _HAS_ZONEINFO:
        try:
            return ZoneInfo(settings.GOOGLE_CALENDAR_TIMEZONE)
        except Exception:
            logger.warning(
                "Unknown timezone %s; falling back to UTC+05:30",
                settings.GOOGLE_CALENDAR_TIMEZONE,
            )
    return datetime.timezone(datetime.timedelta(hours=5, minutes=30))


def _parse_time_of_day(text: str) -> Optional[Tuple[int, int]]:
    """Extracts (hour, minute) from '3pm', '3:30 pm', '15:00'."""
    match = re.search(r"(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b", text)
    if match:
        hour = int(match.group(1)) % 12
        minute = int(match.group(2) or 0)
        if match.group(3) == "pm":
            hour += 12
        return hour, minute

    match = re.search(r"\b(\d{1,2}):(\d{2})\b", text)
    if match:
        hour, minute = int(match.group(1)), int(match.group(2))
        if 0 <= hour <= 23 and 0 <= minute <= 59:
            return hour, minute
    return None


def parse_meeting_datetime(
    raw: Optional[str], tz: Optional[datetime.tzinfo] = None
) -> datetime.datetime:
    """
    Turns what the buyer actually said into a concrete start time.

    The agent passes free text ("tomorrow at 3pm", "next Tuesday morning"), so
    ISO parsing alone is not enough. Anything unrecognised falls back to
    tomorrow at 15:00 local, which is a sane business-hours default rather than
    an arbitrary offset from now.
    """
    tz = tz or _local_timezone()
    now = datetime.datetime.now(tz)

    if not raw or not raw.strip():
        base = (now + datetime.timedelta(days=1)).replace(
            hour=15, minute=0, second=0, microsecond=0
        )
        return base

    text = raw.strip().lower()

    # Explicit ISO timestamps win outright.
    try:
        parsed = datetime.datetime.fromisoformat(raw.strip().replace("Z", "+00:00"))
        return parsed if parsed.tzinfo else parsed.replace(tzinfo=tz)
    except ValueError:
        pass

    time_of_day = _parse_time_of_day(text)
    if time_of_day is None:
        if "morning" in text:
            time_of_day = (10, 0)
        elif "afternoon" in text:
            time_of_day = (15, 0)
        elif "evening" in text:
            time_of_day = (18, 0)
        else:
            time_of_day = (15, 0)
    hour, minute = time_of_day

    day = now.date()
    if "day after tomorrow" in text:
        day = day + datetime.timedelta(days=2)
    elif "next week" in text and not any(w in text for w in WEEKDAYS):
        # "next week" with no weekday named — jump a week, not a day.
        day = day + datetime.timedelta(days=7)
    elif "tomorrow" in text:
        day = day + datetime.timedelta(days=1)
    elif "today" in text or "this afternoon" in text or "this evening" in text:
        pass
    else:
        weekday_match = next((w for w in WEEKDAYS if w in text), None)
        if weekday_match:
            target = WEEKDAYS[weekday_match]
            ahead = (target - day.weekday()) % 7
            # "monday" spoken on a Monday means next Monday, not today.
            if ahead == 0 or "next" in text:
                ahead = ahead or 7
            day = day + datetime.timedelta(days=ahead)
        else:
            day = day + datetime.timedelta(days=1)

    start = datetime.datetime.combine(
        day, datetime.time(hour=hour, minute=minute), tzinfo=tz
    )
    # Never book in the past — roll a stale time forward a day.
    if start <= now:
        start = start + datetime.timedelta(days=1)
    return start


class GoogleCalendarClient:
    def __init__(self):
        self._access_token: Optional[str] = None
        self._access_token_expiry: float = 0.0

    @property
    def is_configured(self) -> bool:
        """True when a real booking can actually be made."""
        if (
            settings.GOOGLE_OAUTH_CLIENT_ID
            and settings.GOOGLE_OAUTH_CLIENT_SECRET
            and settings.GOOGLE_OAUTH_REFRESH_TOKEN
        ):
            return True
        # Legacy path: a manually supplied access token.
        legacy = settings.GOOGLE_CALENDAR_CREDENTIALS
        return bool(legacy and len(legacy.strip()) > 20)

    async def _get_access_token(self) -> Optional[str]:
        """Mints (and caches) a short-lived access token from the refresh token."""
        if not settings.GOOGLE_OAUTH_REFRESH_TOKEN:
            legacy = settings.GOOGLE_CALENDAR_CREDENTIALS.strip()
            return legacy or None

        # Re-use the cached token until a minute before it expires.
        if self._access_token and time.time() < self._access_token_expiry - 60:
            return self._access_token

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post(
                    TOKEN_ENDPOINT,
                    data={
                        "client_id": settings.GOOGLE_OAUTH_CLIENT_ID,
                        "client_secret": settings.GOOGLE_OAUTH_CLIENT_SECRET,
                        "refresh_token": settings.GOOGLE_OAUTH_REFRESH_TOKEN,
                        "grant_type": "refresh_token",
                    },
                )
            if res.status_code != 200:
                logger.error(
                    "Google token refresh failed (%s): %s", res.status_code, res.text
                )
                return None

            payload = res.json()
            self._access_token = payload.get("access_token")
            self._access_token_expiry = time.time() + int(payload.get("expires_in", 3600))
            return self._access_token
        except Exception as exc:
            logger.error("Error refreshing Google access token: %s", exc)
            return None

    def _sandbox_result(
        self,
        attendee_email: str,
        meeting_type: str,
        start_dt: datetime.datetime,
        end_dt: datetime.datetime,
        reason: str,
        status: str = "sandbox_booked",
    ) -> Dict[str, Any]:
        meet_code = f"{uuid.uuid4().hex[:3]}-{uuid.uuid4().hex[3:7]}-{uuid.uuid4().hex[7:10]}"
        return {
            "status": status,
            "is_sandbox": True,
            "reason": reason,
            "event_id": f"cal_evt_{uuid.uuid4().hex[:8]}",
            "meeting_type": meeting_type,
            "attendee_email": attendee_email,
            "start_time": start_dt.strftime("%A, %b %d at %I:%M %p"),
            "end_time": end_dt.strftime("%I:%M %p"),
            "google_meet_url": f"https://meet.google.com/{meet_code}",
            "calendar_url": (
                "https://calendar.google.com/calendar/r/eventedit?text="
                + meeting_type.replace(" ", "+")
            ),
            "message": (
                f"[SIMULATED] Demo slot held for {attendee_email} on "
                f"{start_dt.strftime('%b %d at %I:%M %p')} — no real calendar event created."
            ),
        }

    async def book_meeting(
        self,
        attendee_email: str,
        start_time_iso: Optional[str] = None,
        meeting_type: str = "Enterprise Solution Architecture Demo",
        notes: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Creates a real Google Calendar event with a Meet link and emails the
        buyer an invite. `start_time_iso` accepts natural language too, since
        that is what the voice agent captures.
        """
        tz = _local_timezone()
        start_dt = parse_meeting_datetime(start_time_iso, tz)
        end_dt = start_dt + datetime.timedelta(
            minutes=settings.GOOGLE_CALENDAR_MEETING_MINUTES
        )

        if not self.is_configured:
            logger.info("Google Calendar not configured — returning sandbox booking.")
            return self._sandbox_result(
                attendee_email,
                meeting_type,
                start_dt,
                end_dt,
                reason="GOOGLE_OAUTH_REFRESH_TOKEN not configured",
            )

        token = await self._get_access_token()
        if not token:
            return self._sandbox_result(
                attendee_email,
                meeting_type,
                start_dt,
                end_dt,
                reason="Could not obtain a Google access token",
                status="fallback_booked",
            )

        body = {
            "summary": f"TeamSync: {meeting_type}",
            "description": (
                "Booked automatically by the TeamSync AI sales agent.\n"
                f"Notes: {notes or 'Inbound customer negotiation'}"
            ),
            "start": {
                "dateTime": start_dt.isoformat(),
                "timeZone": settings.GOOGLE_CALENDAR_TIMEZONE,
            },
            "end": {
                "dateTime": end_dt.isoformat(),
                "timeZone": settings.GOOGLE_CALENDAR_TIMEZONE,
            },
            "attendees": [{"email": attendee_email}],
            "conferenceData": {
                "createRequest": {
                    "requestId": uuid.uuid4().hex,
                    "conferenceSolutionKey": {"type": "hangoutsMeet"},
                }
            },
            "reminders": {"useDefault": True},
        }

        calendar_id = settings.GOOGLE_CALENDAR_ID or "primary"
        url = (
            f"{CALENDAR_API}/calendars/{calendar_id}/events"
            # conferenceDataVersion=1 is required for the Meet link to be
            # generated; sendUpdates=all is what actually emails the buyer.
            "?conferenceDataVersion=1&sendUpdates=all"
        )

        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                res = await client.post(
                    url,
                    headers={
                        "Authorization": f"Bearer {token}",
                        "Content-Type": "application/json",
                    },
                    json=body,
                )

            if res.status_code in (200, 201):
                data = res.json()
                meet_link = data.get("hangoutLink") or ""
                if not meet_link:
                    entry = (data.get("conferenceData") or {}).get("entryPoints") or []
                    meet_link = next(
                        (e.get("uri") for e in entry if e.get("entryPointType") == "video"),
                        "",
                    )
                logger.info("Google Calendar event created: %s", data.get("id"))
                return {
                    "status": "booked",
                    "is_sandbox": False,
                    "event_id": data.get("id"),
                    "meeting_type": meeting_type,
                    "attendee_email": attendee_email,
                    "start_time": start_dt.strftime("%A, %b %d at %I:%M %p"),
                    "end_time": end_dt.strftime("%I:%M %p"),
                    "timezone": settings.GOOGLE_CALENDAR_TIMEZONE,
                    "google_meet_url": meet_link,
                    "calendar_url": data.get("htmlLink"),
                    "message": (
                        f"Meeting confirmed for {start_dt.strftime('%A, %b %d at %I:%M %p')} "
                        f"({settings.GOOGLE_CALENDAR_TIMEZONE}). Calendar invite sent to {attendee_email}."
                    ),
                }

            logger.error(
                "Google Calendar API error (%s): %s", res.status_code, res.text
            )
            return self._sandbox_result(
                attendee_email,
                meeting_type,
                start_dt,
                end_dt,
                reason=f"Google Calendar API returned {res.status_code}: {res.text[:200]}",
                status="fallback_booked",
            )
        except Exception as exc:
            logger.error("Error booking Google Calendar event: %s", exc)
            return self._sandbox_result(
                attendee_email,
                meeting_type,
                start_dt,
                end_dt,
                reason=str(exc),
                status="fallback_booked",
            )


calendar_client = GoogleCalendarClient()
