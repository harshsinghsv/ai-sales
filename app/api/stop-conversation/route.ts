import { NextResponse } from 'next/server';
import { AgoraClient, Area } from 'agora-agents';
import { BACKEND_HTTP_URL, getServerAgoraCredentials } from '@/lib/agora';
import { releaseAgentSession } from '@/lib/agent-registry';
import type { StopConversationRequest } from '@/types/conversation';

function isAgentAlreadyStoppingOrStopped(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;

  const maybeErr = error as {
    statusCode?: number;
    body?: { detail?: string; reason?: string };
    message?: string;
  };

  const statusCode = maybeErr.statusCode;
  const reason = maybeErr.body?.reason?.toLowerCase();
  const detail =
    maybeErr.body?.detail?.toLowerCase() ??
    maybeErr.message?.toLowerCase() ??
    '';

  if (statusCode === 404) return true;
  if (
    reason === 'invalidrequest' &&
    detail.includes('already in the process of shutting down')
  ) {
    return true;
  }
  return false;
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
