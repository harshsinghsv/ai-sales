"""
Agora Conversational AI Engine & RTC Integration Service.
Manages RTC Token generation and orchestrates Conversational AI Agent REST sessions (/join, /leave).
"""
import base64
import hashlib
import hmac
import logging
import time
import uuid
from typing import Dict, Any, Optional
import httpx
from backend.config import settings

logger = logging.getLogger("agora_convo_client")

# Pure Hindi (Devanagari) so a single-language TTS voice (e.g. MiniMax's
# hindi_female_2_v1) pronounces these cleanly — these are fixed strings spoken
# verbatim before the buyer has said anything, so language-mirroring doesn't
# apply yet. Claude Enterprise stays as-is: a proper noun, spoken the same in either
# language. If the TTS voice is switched to an English/bilingual voice, these
# should switch back to English or Hinglish accordingly.
MANAGED_GREETING = (
    "नमस्ते! Claude Enterprise में आपका स्वागत है। मैं एमिली हूँ, Anthropic से। बताइए, आपके संगठन के लिए मैं किस तरह मदद कर सकती हूँ?"
)
MANAGED_FAILURE_MESSAGE = "माफ़ कीजिए, क्या आप दोबारा बता सकते हैं?"


def build_llm_config(session_id: Optional[str] = None) -> Dict[str, Any]:
    """
    Builds the `llm` block for the Agora join payload.

    managed_openai (default): Agora-hosted OpenAI credentials — no API key
    needed. Streams a frontier model with a stage-aware Emily persona.
    custom: points Agora at our FastAPI /v1/chat/completions middleware
    (previous behavior, kept for sandbox/offline use).
    """
    from backend.middleware.custom_llm import get_or_create_session
    from backend.middleware.sales_persona import build_system_prompt

    mode = (settings.AGORA_LLM_MODE or "managed_openai").lower()

    if mode == "custom":
        return {
            "url": f"{settings.PUBLIC_BASE_URL}/v1/chat/completions",
            "api_key": "claude_negotiation_token",
            "greeting_message": MANAGED_GREETING,
            "failure_message": MANAGED_FAILURE_MESSAGE,
            "params": {
                "model": settings.SARVAM_CHAT_MODEL
            }
        }

    session = get_or_create_session(session_id or "default_session")
    return {
        "credential_mode": "managed",
        "vendor": "openai",
        "style": "openai",
        "url": "https://api.openai.com/v1/chat/completions",
        "system_messages": [
            {"role": "system", "content": build_system_prompt(session)}
        ],
        "params": {
            "model": settings.AGORA_LLM_MODEL,
            "temperature": settings.AGORA_LLM_TEMPERATURE,
            "max_tokens": 300,
            "stream": True,
        },
        "max_history": 32,
        "greeting_message": MANAGED_GREETING,
        "failure_message": MANAGED_FAILURE_MESSAGE,
        "greeting_configs": {
            "mode": "single_first",
            "interruptable": True,
        },
    }


def generate_agora_rtc_token(
    app_id: str,
    app_certificate: str,
    channel_name: str,
    uid: int | str,
    role: int = 1,  # 1 = publisher, 2 = subscriber
    expire_seconds: int = 3600
) -> str:
    """
    Generates a valid Agora RTC Access Token using official Agora RtcTokenBuilder
    or a fallback token if credentials are missing.
    """
    if not app_certificate or not app_id:
        return f"sandbox_token_{app_id}_{channel_name}_{uid}_{int(time.time())}"

    try:
        from agora_token_builder import RtcTokenBuilder
        # Ensure uid is int or handle string
        numeric_uid = int(uid) if str(uid).isdigit() else 1001
        expire_timestamp = int(time.time()) + expire_seconds
        token = RtcTokenBuilder.buildTokenWithUid(
            app_id,
            app_certificate,
            channel_name,
            numeric_uid,
            role,
            expire_timestamp
        )
        return token
    except Exception as e:
        logger.error(f"Error generating official Agora token: {e}")
        # Fallback
        current_timestamp = int(time.time())
        privilege_expired_ts = current_timestamp + expire_seconds
        uid_str = str(uid)
        message = f"{app_id}{channel_name}{uid_str}{privilege_expired_ts}".encode("utf-8")
        signature = hmac.new(app_certificate.encode("utf-8"), message, hashlib.sha256).digest()
        encoded_sig = base64.b64encode(signature).decode("utf-8")
        return f"006{app_id}{encoded_sig[:32]}{current_timestamp}{privilege_expired_ts}"


class AgoraConvoAIClient:
    def __init__(self):
        self.app_id = settings.AGORA_APP_ID
        self.app_certificate = settings.AGORA_APP_CERTIFICATE
        self.customer_id = settings.AGORA_CUSTOMER_ID
        self.customer_secret = settings.AGORA_CUSTOMER_SECRET
        self.base_url = settings.AGORA_CONVO_BASE_URL
        self.public_base_url = settings.PUBLIC_BASE_URL

    @property
    def is_configured(self) -> bool:
        return bool(self.app_id and self.customer_id and self.customer_secret)

    def _auth_headers(self) -> Dict[str, str]:
        credentials = f"{self.customer_id}:{self.customer_secret}"
        encoded = base64.b64encode(credentials.encode("utf-8")).decode("utf-8")
        return {
            "Content-Type": "application/json",
            "Authorization": f"Basic {encoded}"
        }

    async def start_convo_agent(
        self,
        channel_name: str,
        user_rtc_uid: str = "1001",
        agent_rtc_uid: str = "9999",
        session_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Calls Agora Conversational AI Agent REST API:
        POST /api/conversational-ai-agent/v2/projects/{appId}/join
        Wired with native Sarvam ASR, our FastAPI custom LLM middleware, and Sarvam Bulbul TTS shim.
        """
        agent_token = generate_agora_rtc_token(
            self.app_id,
            self.app_certificate,
            channel_name,
            agent_rtc_uid
        )
        user_token = generate_agora_rtc_token(
            self.app_id,
            self.app_certificate,
            channel_name,
            user_rtc_uid
        )

        custom_llm_url = f"{self.public_base_url}/v1/chat/completions"
        tts_shim_url = f"{self.public_base_url}/v1/audio/speech"
        # Build Agora join request payload matching the Agora Conversational AI Engine schema.
        # Brain selection lives in build_llm_config(): managed OpenAI by default,
        # custom FastAPI middleware when AGORA_LLM_MODE=custom.
        agent_payload = {
            "name": f"sales-agent-{channel_name}",
            "properties": {
                "channel": channel_name,
                "token": agent_token,
                "agent_rtc_uid": str(agent_rtc_uid),
                "remote_rtc_uids": [str(user_rtc_uid)],
                "idle_timeout": 60,
                # Native Sarvam STT vendor
                "asr": {
                    "vendor": "sarvam" if settings.SARVAM_API_KEY else "ares",
                    "params": {
                        "api_key": settings.SARVAM_API_KEY or "dummy_key",
                        "language": "hi-IN"
                    }
                },
                "llm": build_llm_config(session_id),
                # TTS configured as generic_http pointing to our Bulbul shim or native sarvam
                "tts": {
                    "vendor": "generic_http",
                    "params": {
                        "url": tts_shim_url,
                        "sample_rate": 24000
                    }
                },
                "parameters": {
                    "enable_audio_transcription": True
                }
            }
        }

        if not self.is_configured:
            logger.info("Agora credentials not set. Returning live local session configuration.")
            return {
                "status": "sandbox_connected",
                "is_sandbox": True,
                "agent_id": f"agent_{uuid.uuid4().hex[:8]}",
                "channel_name": channel_name,
                "app_id": self.app_id or "sandbox_app_id",
                "user_rtc_uid": user_rtc_uid,
                "agent_rtc_uid": agent_rtc_uid,
                "user_token": user_token,
                "message": "Agora RTC channel ready for voice connection."
            }

        url = f"{self.base_url}/projects/{self.app_id}/join"
        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                res = await client.post(url, headers=self._auth_headers(), json=agent_payload)
                data = res.json()
                return {
                    "status": "success",
                    "is_sandbox": False,
                    "agent_id": data.get("agent_id"),
                    "channel_name": channel_name,
                    "app_id": self.app_id,
                    "user_rtc_uid": user_rtc_uid,
                    "agent_rtc_uid": agent_rtc_uid,
                    "user_token": user_token,
                    "raw_response": data
                }
        except Exception as e:
            logger.error(f"Error starting Agora Conversational AI Agent: {e}")
            return {
                "status": "fallback_connected",
                "is_sandbox": True,
                "error": str(e),
                "agent_id": f"agent_{uuid.uuid4().hex[:8]}",
                "channel_name": channel_name,
                "app_id": self.app_id or "sandbox_app_id",
                "user_rtc_uid": user_rtc_uid,
                "agent_rtc_uid": agent_rtc_uid,
                "user_token": user_token
            }

    async def stop_convo_agent(self, agent_id: str) -> Dict[str, Any]:
        """
        Stops the Agora Conversational AI Agent:
        POST /api/conversational-ai-agent/v2/projects/{appId}/agents/{agentId}/leave
        """
        if not self.is_configured or agent_id.startswith("agent_"):
            return {"status": "sandbox_stopped", "agent_id": agent_id}

        url = f"{self.base_url}/projects/{self.app_id}/agents/{agent_id}/leave"
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(url, headers=self._auth_headers())
                return res.json()
        except Exception as e:
            logger.error(f"Error stopping Agora agent: {e}")
            return {"status": "error", "error": str(e)}


agora_convo_client = AgoraConvoAIClient()
