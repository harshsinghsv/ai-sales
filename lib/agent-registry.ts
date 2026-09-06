import type { AgentSession } from 'agora-agents';

/**
 * Process-local map of agent_id → live AgentSession.
 *
 * `AgentSession.think()` / `.say()` / `.interrupt()` operate on the object
 * returned by `agent.createSession()`, which cannot be rebuilt from an agent id
 * alone. The Next.js server runs as a long-lived process alongside FastAPI, so
 * holding the session here is sufficient for the cockpit's text channel.
 *
 * Caveat: a server restart (or a serverless deployment where each request gets
 * a fresh process) empties this map. Callers must treat a miss as expected and
 * degrade gracefully rather than failing the call — see /api/agent-think.
 */
const sessions = new Map<string, AgentSession>();

export function registerAgentSession(agentId: string, session: AgentSession) {
  sessions.set(agentId, session);
}

export function getAgentSession(agentId: string): AgentSession | undefined {
  return sessions.get(agentId);
}

export function releaseAgentSession(agentId: string) {
  sessions.delete(agentId);
}
