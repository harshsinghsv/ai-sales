/** RTC UID the Conversational AI agent joins the channel as. */
export const DEFAULT_AGENT_UID = 123456;

/**
 * Base URL of the FastAPI backend (deal engine, session state, cockpit
 * WebSocket, and the custom-LLM brain). Server-side routes and the browser
 * both talk to it, so keep it public.
 */
export const BACKEND_HTTP_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export const BACKEND_WS_URL =
  process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws';

/**
 * Server-side Agora credentials.
 *
 * The quickstart uses NEXT_PUBLIC_AGORA_APP_ID / NEXT_AGORA_APP_CERTIFICATE.
 * Existing deployments of this project set AGORA_APP_ID / AGORA_APP_CERTIFICATE
 * for the Python backend, so those are accepted as fallbacks — one .env keeps
 * serving both halves. Note the browser can only read the NEXT_PUBLIC_ name,
 * so NEXT_PUBLIC_AGORA_APP_ID must still be set for the client to join RTC.
 */
export function getServerAgoraCredentials(): {
  appId?: string;
  appCertificate?: string;
} {
  return {
    appId: process.env.NEXT_PUBLIC_AGORA_APP_ID || process.env.AGORA_APP_ID,
    appCertificate:
      process.env.NEXT_AGORA_APP_CERTIFICATE ||
      process.env.AGORA_APP_CERTIFICATE,
  };
}
