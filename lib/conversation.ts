/**
 * Adapters between Agora's conversational-AI toolkit and the sales cockpit's
 * own view models.
 *
 * Adapted from agent-quickstart-nextjs' lib/conversation.ts. The template maps
 * toolkit items onto agora-agent-uikit's IMessageListItem; we map them onto the
 * existing TranscriptTurn/VoiceState types instead, so LiveTranscript,
 * VoiceOrb and SalesCockpit render unchanged.
 */
import {
  AgentState,
  TurnStatus,
  type AgentTranscription,
  type TranscriptHelperItem,
  type UserTranscription,
} from 'agora-agent-client-toolkit';
import type { TranscriptTurn, VoiceState } from '@/lib/types';

export type ToolkitTranscriptItem = TranscriptHelperItem<
  Partial<UserTranscription | AgentTranscription>
>;

// Fixes compacted punctuation emitted by some TTS/ASR providers where sentence-ending
// characters run directly into the next word (e.g. "Hello.World" → "Hello. World").
export function normalizeTranscriptSpacing(text: string): string {
  return text
    .replace(/([.!?])([A-Za-z])/g, '$1 $2')
    .replace(/,([A-Za-z])/g, ', $1')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// Agora timestamps vary by source: some RTM payloads use Unix-seconds while
// RTC events use milliseconds. Values already above 1e12 are milliseconds; others need scaling.
export function normalizeTimestampMs(timestamp: number): number {
  return timestamp > 1e12 ? timestamp : timestamp * 1000;
}

/**
 * uid="0" is the toolkit's sentinel for local-user speech. Without remapping it
 * to the actual RTC UID, the transcript renders the buyer's speech on Emily's
 * side. Also normalises punctuation spacing so all turns display consistently.
 */
export function normalizeTranscript(
  transcript: ToolkitTranscriptItem[],
  localUID: string,
): ToolkitTranscriptItem[] {
  return transcript.map((item) => ({
    ...item,
    uid: item.uid === '0' ? localUID : item.uid,
    text:
      typeof item.text === 'string'
        ? normalizeTranscriptSpacing(item.text)
        : item.text,
  }));
}

/**
 * Converts a toolkit transcript item into the cockpit's TranscriptTurn.
 * Anything published by the agent's RTC UID is Emily; everything else is the
 * buyer.
 */
export function toTranscriptTurn(
  item: ToolkitTranscriptItem,
  agentUID: string,
): TranscriptTurn {
  return {
    id: `${item.uid}-${item.turn_id}`,
    speaker: item.uid === agentUID ? 'agent' : 'customer',
    text: typeof item.text === 'string' ? item.text : '',
    isFinal: item.status !== TurnStatus.IN_PROGRESS,
    timestamp:
      typeof item._time === 'number' ? normalizeTimestampMs(item._time) : Date.now(),
    interrupted: item.status === TurnStatus.INTERRUPTED,
  };
}

/**
 * Completed history for LiveTranscript. INTERRUPTED turns must be included:
 * if Emily's first turn is cut off and omitted, the transcript stays empty and
 * that turn is never shown.
 */
export function getCompletedTurns(
  transcript: ToolkitTranscriptItem[],
  agentUID: string,
): TranscriptTurn[] {
  return transcript
    .filter((item) => item.status !== TurnStatus.IN_PROGRESS)
    .map((item) => toTranscriptTurn(item, agentUID));
}

/**
 * The single active in-progress turn, rendered as the live partial bubble.
 * At most one turn is in progress at a time.
 */
export function getInProgressTurn(
  transcript: ToolkitTranscriptItem[],
  agentUID: string,
): TranscriptTurn | null {
  const item = transcript.find(
    (entry) => entry.status === TurnStatus.IN_PROGRESS,
  );
  return item ? toTranscriptTurn(item, agentUID) : null;
}

/**
 * Maps the combined (agentState + RTC connection + agent presence) signal onto
 * the cockpit's VoiceState, which drives the orb and the status pill. RTC
 * transport problems take priority over agent-level state so the orb never
 * shows "listening" during a reconnect.
 */
export function mapVoiceState(
  agentState: AgentState | null,
  isAgentConnected: boolean,
  connectionState: string,
): VoiceState {
  if (
    connectionState === 'DISCONNECTED' ||
    connectionState === 'DISCONNECTING' ||
    connectionState === 'CONNECTING' ||
    connectionState === 'RECONNECTING'
  ) {
    return 'idle';
  }

  if (!isAgentConnected) return 'idle';

  switch (agentState) {
    case AgentState.LISTENING:
      return 'listening';
    case AgentState.THINKING:
      return 'thinking';
    case AgentState.SPEAKING:
      return 'speaking';
    case AgentState.SILENT:
    case AgentState.IDLE:
    default:
      return 'listening';
  }
}
