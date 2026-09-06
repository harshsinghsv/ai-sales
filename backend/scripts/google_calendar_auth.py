"""
One-time Google Calendar authorization.

Run this once to obtain a refresh token, then paste it into .env as
GOOGLE_OAUTH_REFRESH_TOKEN. The backend uses that token to mint short-lived
access tokens on demand, so booking keeps working indefinitely without any
further sign-in.

Why a user refresh token rather than a service account: a service account
cannot invite attendees to a calendar event unless the project has Google
Workspace domain-wide delegation. Authorising as yourself means the booking
lands on your real calendar AND the buyer actually receives the invite.

Usage:
    python -m backend.scripts.google_calendar_auth

Prerequisites (Google Cloud Console, https://console.cloud.google.com):
  1. Create/select a project.
  2. APIs & Services > Library > enable "Google Calendar API".
  3. APIs & Services > OAuth consent screen:
       - User type: External
       - Add your own Google account under "Test users"
  4. APIs & Services > Credentials > Create credentials > OAuth client ID:
       - Application type: "Desktop app"
       - Copy the Client ID and Client Secret into .env as
         GOOGLE_OAUTH_CLIENT_ID / GOOGLE_OAUTH_CLIENT_SECRET
"""
import http.server
import socket
import sys
import threading
import urllib.parse
import webbrowser
from typing import Optional

import httpx

from backend.config import settings

AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth"
TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token"
# calendar.events is the narrowest scope that can create events and invite
# attendees — deliberately not requesting full calendar access.
SCOPE = "https://www.googleapis.com/auth/calendar.events"


class _CallbackHandler(http.server.BaseHTTPRequestHandler):
    """Captures the ?code=... Google redirects back to."""

    code: Optional[str] = None
    error: Optional[str] = None

    def do_GET(self):  # noqa: N802 - stdlib naming
        params = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
        _CallbackHandler.code = (params.get("code") or [None])[0]
        _CallbackHandler.error = (params.get("error") or [None])[0]

        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        if _CallbackHandler.code:
            body = (
                "<h2>Authorization complete</h2>"
                "<p>You can close this tab and return to your terminal.</p>"
            )
        else:
            body = (
                "<h2>Authorization failed</h2>"
                f"<p>{_CallbackHandler.error or 'No authorization code returned.'}</p>"
            )
        self.wfile.write(body.encode("utf-8"))

    def log_message(self, *args):  # silence per-request stderr logging
        return


def _free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind(("127.0.0.1", 0))
        return sock.getsockname()[1]


def main() -> int:
    client_id = settings.GOOGLE_OAUTH_CLIENT_ID
    client_secret = settings.GOOGLE_OAUTH_CLIENT_SECRET

    if not client_id or not client_secret:
        print(
            "ERROR: GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET must be "
            "set in .env before running this.\n"
            "Create them at https://console.cloud.google.com > APIs & Services > "
            "Credentials > OAuth client ID > Desktop app.",
            file=sys.stderr,
        )
        return 1

    port = _free_port()
    redirect_uri = f"http://localhost:{port}"

    params = {
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "response_type": "code",
        "scope": SCOPE,
        # offline + consent together are what actually return a refresh token;
        # without prompt=consent Google omits it on repeat authorisations.
        "access_type": "offline",
        "prompt": "consent",
    }
    auth_url = f"{AUTH_ENDPOINT}?{urllib.parse.urlencode(params)}"

    server = http.server.HTTPServer(("127.0.0.1", port), _CallbackHandler)
    thread = threading.Thread(target=server.handle_request, daemon=True)
    thread.start()

    print("\nOpening your browser to authorize Google Calendar access...")
    print("If it does not open automatically, paste this URL:\n")
    print(auth_url + "\n")
    try:
        webbrowser.open(auth_url)
    except Exception:
        pass

    thread.join(timeout=300)
    server.server_close()

    if _CallbackHandler.error:
        print(f"ERROR: authorization denied: {_CallbackHandler.error}", file=sys.stderr)
        return 1
    if not _CallbackHandler.code:
        print("ERROR: timed out waiting for authorization.", file=sys.stderr)
        return 1

    res = httpx.post(
        TOKEN_ENDPOINT,
        data={
            "code": _CallbackHandler.code,
            "client_id": client_id,
            "client_secret": client_secret,
            "redirect_uri": redirect_uri,
            "grant_type": "authorization_code",
        },
        timeout=20.0,
    )

    if res.status_code != 200:
        print(f"ERROR: token exchange failed ({res.status_code}): {res.text}", file=sys.stderr)
        return 1

    refresh_token = res.json().get("refresh_token")
    if not refresh_token:
        print(
            "ERROR: Google did not return a refresh token. Revoke this app at "
            "https://myaccount.google.com/permissions and run this again.",
            file=sys.stderr,
        )
        return 1

    print("\n" + "=" * 68)
    print("SUCCESS - add this line to your .env file:\n")
    print(f"GOOGLE_OAUTH_REFRESH_TOKEN={refresh_token}")
    print("=" * 68 + "\n")
    print("Then restart the backend. Bookings will create real calendar events.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
