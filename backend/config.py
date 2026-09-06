"""
Configuration management for the Adaptive AI Sales & Negotiation Agent.
Loads credentials and endpoints from environment variables or .env file.
"""
import os
from pathlib import Path
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

    # LLM Providers (OpenAI, Groq, Gemini) for raw real-time dynamic intelligence
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    # HubSpot CRM configuration
    HUBSPOT_ACCESS_TOKEN: str = os.getenv("HUBSPOT_ACCESS_TOKEN", "")

    # Google Calendar configuration
    GOOGLE_CALENDAR_CREDENTIALS: str = os.getenv("GOOGLE_CALENDAR_CREDENTIALS", "")

    # Human Escalation (Slack Webhook)
    SLACK_WEBHOOK_URL: str = os.getenv("SLACK_WEBHOOK_URL", "")

    # Public Middleware Base URL (the URL Agora will call for Custom LLM & TTS shim)
    PUBLIC_BASE_URL: str = os.getenv("PUBLIC_BASE_URL", "http://localhost:8000")


settings = Settings()
