import { NextResponse } from 'next/server';
import { AgoraClient, Area } from 'agora-agents';
import { BACKEND_HTTP_URL, getServerAgoraCredentials } from '@/lib/agora';
import { releaseAgentSession } from '@/lib/agent-registry';
import type { StopConversationRequest } from '@/types/conversation';

/**
 * Stopping an agent that is already stopping is a success, not a failure.
 *
 * Agora is inconsistent about where it puts the explanation: the observed 400
 * is `{detail: "ErrConflict", reason: "Conflict: The task is already in the
 * process of shutting down."}`, i.e. the human-readable phrase lands in
 * `reason`, while an earlier variant put it in `detail` with
 * `reason: "InvalidRequest"`. So check every field for the phrase rather than
 * matching one exact shape, and treat conflict/not-found statuses as
 * already-stopped.
 */
function isAgentAlreadyStoppingOrStopped(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;

  const maybeErr = error as {
    statusCode?: number;
    body?: { detail?: string; reason?: string };
    message?: string;
  };

  const statusCode = maybeErr.statusCode;
  if (statusCode === 404 || statusCode === 409) return true;

  const haystack = [
    maybeErr.body?.detail,
    maybeErr.body?.reason,
    maybeErr.message,
  ]
    .filter((v): v is string => typeof v === 'string')
    .join(' | ')
    .toLowerCase();

  return (
    haystack.includes('already in the process of shutting down') ||
    haystack.includes('errconflict') ||
    haystack.includes('not found')
  );
}

/**
 * Finalizes the sales session in FastAPI so the post-call deal memo,
 * CRM status, and cockpit toast are generated. Non-fatal: a failure here
 * must not block the agent from being stopped.
 */
async function finalizeBackendSession(
  conversationId: string | undefined,
  agentId: string,
) {
  if (!conversationId) return null;
  try {
    const res = await fetch(`${BACKEND_HTTP_URL}/api/session/stop`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // agent_id is passed so the backend can no-op its own Agora stop call —
      // this route already owns the agent lifecycle.
      body: JSON.stringify({
        conversation_id: conversationId,
        agent_id: null,
      }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Failed to finalize backend session:', error, agentId);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body: StopConversationRequest = await request.json();
    const { agent_id, conversation_id } = body;

    if (!agent_id) {
      return NextResponse.json(
        { error: 'agent_id is required' },
        { status: 400 },
      );
    }

    const { appId, appCertificate } = getServerAgoraCredentials();
    if (!appId || !appCertificate) {
      throw new Error(
        'Missing Agora configuration. Set NEXT_PUBLIC_AGORA_APP_ID and NEXT_AGORA_APP_CERTIFICATE.',
      );
    }

    // area: change to Area.EU or Area.AP for European or Asia-Pacific deployments.
    const client = new AgoraClient({ area: Area.US, appId, appCertificate });

    let state = 'stopped';
    try {
      await client.stopAgent(agent_id);
    } catch (error) {
      if (isAgentAlreadyStoppingOrStopped(error)) {
        // Treat stop as idempotent: agent is already exiting (or gone).
        state = 'already-stopping';
      } else {
        throw error;
      }
    }

    releaseAgentSession(agent_id);

    const dealMemo = await finalizeBackendSession(conversation_id, agent_id);

    return NextResponse.json({ success: true, state, ...(dealMemo ?? {}) });
  } catch (error) {
    console.error('Error stopping conversation:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to stop conversation',
      },
      { status: 500 },
    );
  }
}
