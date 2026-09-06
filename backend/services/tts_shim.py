"""
TTS Shim Service: Bridges Agora Conversational AI Engine to Sarvam Bulbul TTS.
Receives OpenAI-protocol audio speech requests, calls Sarvam Bulbul (bulbul:v3),
decodes the base64 audio response, and streams/returns raw PCM / WAV audio.
"""
import base64
import io
import logging
from typing import Optional
import httpx
from pydantic import BaseModel
from backend.config import settings

logger = logging.getLogger("tts_shim")


class OpenAITTSRequest(BaseModel):
    input: str
    model: Optional[str] = "bulbul:v3"
    voice: Optional[str] = "meera"
    response_format: Optional[str] = "pcm"  # or "wav"
    speed: Optional[float] = 1.0


class SarvamTTSShim:
    def __init__(self):
        self.api_key = settings.SARVAM_API_KEY
        self.tts_url = settings.SARVAM_TTS_URL
        self.speaker = settings.SARVAM_TTS_VOICE
        self.model = settings.SARVAM_TTS_MODEL

    @property
    def is_configured(self) -> bool:
        return bool(self.api_key and len(self.api_key.strip()) > 5)

    async def synthesize(self, text: str, voice: Optional[str] = None, format_type: str = "pcm") -> bytes:
        """
        Calls Sarvam Bulbul API, decodes base64 response, and returns audio bytes.
        """
        if not text or not text.strip():
            return b""

        if not self.is_configured:
            logger.info("Sarvam API key unconfigured for TTS. Generating synthetic PCM audio frame.")
            return self._generate_synthetic_pcm()

        speaker_to_use = voice or self.speaker
        payload = {
            "inputs": [text],
            "target_language_code": "hi-IN",
            "speaker": speaker_to_use,
            "pitch": 0,
            "pace": 1.0,
            "loudness": 1.0,
            "speech_sample_rate": 24000,
            "enable_preprocessing": True,
            "model": self.model
        }

        headers = {
            "api-subscription-key": self.api_key,
            "Content-Type": "application/json"
        }

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post(self.tts_url, json=payload, headers=headers)
                res.raise_for_status()
                data = res.json()
                audios = data.get("audios", [])
                if not audios:
                    logger.warning("No audios returned by Sarvam Bulbul TTS")
                    return self._generate_synthetic_pcm()

                # Decode base64 audio
                raw_audio = base64.b64decode(audios[0])

                # If format requested is raw PCM and incoming data has a RIFF WAV header, strip the 44-byte header
                if format_type.lower() == "pcm" and raw_audio.startswith(b"RIFF"):
                    return raw_audio[44:]
                return raw_audio

        except Exception as e:
            logger.error(f"Error calling Sarvam Bulbul TTS API: {e}")
            return self._generate_synthetic_pcm()

    def _generate_synthetic_pcm(self, duration_ms: int = 500, sample_rate: int = 24000) -> bytes:
        """Generates silent/gentle PCM frame for testing and sandbox mode."""
        num_samples = int(sample_rate * (duration_ms / 1000.0))
        # 16-bit PCM silent buffer
        return b"\x00\x00" * num_samples


tts_shim = SarvamTTSShim()
