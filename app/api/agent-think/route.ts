import { NextResponse } from 'next/server';
import { getAgentSession } from '@/lib/agent-registry';

/**
 * Injects a typed message from the cockpit's text box into the live agent
 * pipeline, so Aarav responds out loud exactly as if the buyer had spoken it.
 *
 * This preserves the manual-input feature after the migration to the Agora
 * cloud pipeline: previously the hook called the LLM directly and played the
 * reply itself, which is precisely the duplicate-audio path being removed.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      agent_id?: string;
      text?: string;
    };
    const { agent_id, text } = body;

    if (!agent_id || !text?.trim()) {
      return NextResponse.json(
        { error: 'agent_id and text are required' },
        { status: 400 },
      );
    }

    const session = getAgentSession(agent_id);
    if (!session) {
      // Expected after a Next.js server restart mid-call — the caller falls
      // back to a transcript-only send rather than surfacing a hard error.
      return NextResponse.json(
        {
          error: 'agent session not held by this server process',
          recoverable: true,
        },
        { status: 409 },
      );
    }

    await session.think(text.trim(), {
      // A typed message is a deliberate act — let it cut through whatever the
      // agent is currently doing, matching the old text box's behaviour.
      on_speaking_action: 'interrupt',
      on_thinking_action: 'interrupt',
      interruptable: true,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error injecting message into agent:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to send message',
      },
      { status: 500 },
    );
  }
}
