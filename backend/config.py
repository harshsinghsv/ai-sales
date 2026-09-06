"""
Configuration management for the Adaptive AI Sales & Negotiation Agent.
Loads credentials and endpoints from environment variables or .env file.
"""
import os
from pathlib import Path
from pydantic import field_validator
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load .env from project root or backend dir
load_dotenv()
load_dotenv(Path(__file__).parent.parent / ".env")


class Settings(BaseSettings):
    # Server configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True

    # Agora Conversational AI & RTC configuration
    AGORA_APP_ID: str = os.getenv("AGORA_APP_ID", "")
    AGORA_APP_CERTIFICATE: str = os.getenv("AGORA_APP_CERTIFICATE", "")
    AGORA_CUSTOMER_ID: str = os.getenv("AGORA_CUSTOMER_ID", "")
    AGORA_CUSTOMER_SECRET: str = os.getenv("AGORA_CUSTOMER_SECRET", "")
    AGORA_CONVO_BASE_URL: str = os.getenv(
        "AGORA_CONVO_BASE_URL", 
        "https://api.agora.io/api/conversational-ai-agent/v2"
    )

    # Agora Conversational AI brain: "managed_openai" uses Agora-hosted OpenAI
    # credentials (no API key needed); "custom" points Agora at our FastAPI
    # /v1/chat/completions middleware instead.
    AGORA_LLM_MODE: str = os.getenv("AGORA_LLM_MODE", "managed_openai")
    AGORA_LLM_MODEL: str = os.getenv("AGORA_LLM_MODEL", "gpt-4.1-mini")
    AGORA_LLM_TEMPERATURE: float = float(os.getenv("AGORA_LLM_TEMPERATURE", "0.7"))

    # Sarvam AI configuration
    SARVAM_API_KEY: str = os.getenv("SARVAM_API_KEY", "")
    SARVAM_CHAT_URL: str = os.getenv("SARVAM_CHAT_URL", "https://api.sarvam.ai/v1/chat/completions")
    SARVAM_CHAT_MODEL: str = os.getenv("SARVAM_CHAT_MODEL", "sarvam-105b-conversations")
    SARVAM_TTS_URL: str = os.getenv("SARVAM_TTS_URL", "https://api.sarvam.ai/text-to-speech")
    SARVAM_TTS_VOICE: str = os.getenv("SARVAM_TTS_VOICE", "meera")
    SARVAM_TTS_MODEL: str = os.getenv("SARVAM_TTS_MODEL", "bulbul:v3")

    # Sarvam vendor settings for Agora's native ASR/TTS slots. The Agora
    # `sarvam` TTS vendor takes a bulbul:v3 speaker id + BCP-47 target language,
    # which is a different namespace from SARVAM_TTS_VOICE above (used by our
    # own /v1/audio/speech shim). "abhilash" is the male v3 voice for Aarav.
    # Only used when AGORA_STT_VENDOR / AGORA_TTS_VENDOR are set to "sarvam"
    # (BYOK); the default pipeline uses Agora-managed models instead.
    SARVAM_STT_LANGUAGE: str = os.getenv("SARVAM_STT_LANGUAGE", "hi-IN")
    SARVAM_TTS_SPEAKER: str = os.getenv("SARVAM_TTS_SPEAKER", "abhilash")
    SARVAM_TTS_TARGET_LANGUAGE: str = os.getenv("SARVAM_TTS_TARGET_LANGUAGE", "hi-IN")
    SARVAM_TTS_SAMPLE_RATE: int = int(os.getenv("SARVAM_TTS_SAMPLE_RATE", "24000"))

    # --- Agora-managed pipeline (no provider API keys required) --------------
    # Vendor selection for Agora's ASR/TTS slots. "deepgram"/"minimax" run on
    # Agora-managed credentials; "sarvam" switches to BYOK using the keys above.
    AGORA_STT_VENDOR: str = os.getenv("AGORA_STT_VENDOR", "deepgram")
    AGORA_TTS_VENDOR: str = os.getenv("AGORA_TTS_VENDOR", "minimax")

    # Deepgram ASR. Managed mode accepts the preset models nova-2 / nova-3.
    # Set DEEPGRAM_LANGUAGE to "hi" for Hindi, or "multi" (nova-3) for
    # Hindi/English code-switching, which is how Aarav's buyers actually speak.
    DEEPGRAM_MODEL: str = os.getenv("DEEPGRAM_MODEL", "nova-3")
    DEEPGRAM_LANGUAGE: str = os.getenv("DEEPGRAM_LANGUAGE", "multi")

    # MiniMax TTS. Managed mode accepts speech-2.6-turbo / speech-2.8-turbo.
    # MINIMAX_VOICE_ID selects the voice; leave blank to use Agora's default.
    # Set it to a Hindi voice id from the MiniMax voice list for a Hindi Aarav.
    MINIMAX_MODEL: str = os.getenv("MINIMAX_MODEL", "speech-2.8-turbo")
    MINIMAX_VOICE_ID: str = os.getenv("MINIMAX_VOICE_ID", "")

    # --- Human handoff ------------------------------------------------------
    # Public origin of the Next.js app, used to build the live-handoff link a
    # human specialist opens to join the buyer's Agora RTC channel.
    HUMAN_HANDOFF_BASE_URL: str = os.getenv(
        "HUMAN_HANDOFF_BASE_URL", "http://localhost:3000"
    )
    # RTC uid the human specialist joins as.
    HUMAN_AGENT_RTC_UID: int = int(os.getenv("HUMAN_AGENT_RTC_UID", "7777"))

    # --- Agora MCP ----------------------------------------------------------
    # Comma-separated MCP server URLs the Conversational AI agent may call
    # tools from (transport: streamable_http). Wired into llm.mcp_servers.
    AGORA_MCP_SERVER_URLS: str = os.getenv("AGORA_MCP_SERVER_URLS", "")

    # Expose our own Deal Engine MCP server (mounted at /mcp) to the agent.
    # Requires PUBLIC_BASE_URL to be reachable from Agora's cloud.
    AGORA_MCP_ENABLE_DEAL_ENGINE: bool = (
        os.getenv("AGORA_MCP_ENABLE_DEAL_ENGINE", "true").lower() == "true"
    )

    # LLM Providers (OpenAI, Groq, Gemini) for raw real-time dynamic intelligence
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    # HubSpot CRM configuration
    HUBSPOT_ACCESS_TOKEN: str = os.getenv("HUBSPOT_ACCESS_TOKEN", "")

    # Google Calendar configuration.
    # Legacy: a raw OAuth access token (expires in ~1 hour) — kept for
    # backwards compatibility only. Prefer the refresh-token flow below.
    GOOGLE_CALENDAR_CREDENTIALS: str = os.getenv("GOOGLE_CALENDAR_CREDENTIALS", "")

    # Google Calendar OAuth (user credentials). A refresh token acts as the
    # signed-in user, so events land on a real calendar AND attendees can be
    # invited — a service account cannot invite attendees without Google
    # Workspace domain-wide delegation. Obtain the refresh token once with:
    #   python -m backend.scripts.google_calendar_auth
    GOOGLE_OAUTH_CLIENT_ID: str = os.getenv("GOOGLE_OAUTH_CLIENT_ID", "")
    GOOGLE_OAUTH_CLIENT_SECRET: str = os.getenv("GOOGLE_OAUTH_CLIENT_SECRET", "")
    GOOGLE_OAUTH_REFRESH_TOKEN: str = os.getenv("GOOGLE_OAUTH_REFRESH_TOKEN", "")

    # Which calendar to write to ("primary" = the authorising user's own).
    GOOGLE_CALENDAR_ID: str = os.getenv("GOOGLE_CALENDAR_ID", "primary")
    # IANA timezone used when the buyer says a bare time like "3pm".
    GOOGLE_CALENDAR_TIMEZONE: str = os.getenv("GOOGLE_CALENDAR_TIMEZONE", "Asia/Kolkata")
    # Default meeting length in minutes.
    GOOGLE_CALENDAR_MEETING_MINUTES: int = int(
        os.getenv("GOOGLE_CALENDAR_MEETING_MINUTES", "45")
    )

    # Human Escalation (Slack Webhook)
    SLACK_WEBHOOK_URL: str = os.getenv("SLACK_WEBHOOK_URL", "")

    # Public Middleware Base URL (the URL Agora will call for Custom LLM & TTS shim)
    PUBLIC_BASE_URL: str = os.getenv("PUBLIC_BASE_URL", "http://localhost:8000")

    @field_validator(
        "PUBLIC_BASE_URL", "HUMAN_HANDOFF_BASE_URL", mode="after"
    )
    @classmethod
    def _strip_trailing_slash(cls, value: str) -> str:
        """
        Base URLs are always concatenated as f"{base}/path", so a trailing
        slash in the environment produces a double slash ("https://host//mcp/")
        which Agora's cloud resolves to 404. Tunnel tools (cloudflared, ngrok)
        print URLs with a trailing slash, so this is easy to hit.
        """
        return value.rstrip("/") if isinstance(value, str) else value


settings = Settings()
