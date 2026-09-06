'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type {
  IAgoraRTCClient,
  IMicrophoneAudioTrack,
  IAgoraRTCRemoteUser,
} from 'agora-rtc-sdk-ng';
import type { RTMClient } from 'agora-rtm';
import type { AgoraVoiceAI as AgoraVoiceAIType } from 'agora-agent-client-toolkit';
import { SessionState, TranscriptTurn } from '@/lib/types';
import { BACKEND_HTTP_URL, BACKEND_WS_URL, DEFAULT_AGENT_UID } from '@/lib/agora';
import {
  getCompletedTurns,
  getInProgressTurn,
  normalizeTranscript,
  type ToolkitTranscriptItem,
} from '@/lib/conversation';
import type { AgoraTokenData } from '@/types/conversation';

const AGENT_UID = String(DEFAULT_AGENT_UID);
/** Must match HUMAN_AGENT_RTC_UID in backend/config.py. */
const HUMAN_UID = 7777;

/**
 * Specialist-side runtime for a live human takeover.
 *
 * The human joins the buyer's *existing* Agora RTC channel, so escalation is a
 * real voice handoff rather than a notification: the buyer stays on the same
 * call and simply starts hearing a person. RTM gives the specialist the full
 * transcript of everything Aarav and the buyer already said, and the backend
 * WebSocket supplies live deal state — so they arrive with context, which is
 * exactly what "human escalation with conversation context" requires.
 *
 * Note this deliberately does NOT invite an agent: the AI is already in the
 * channel (and can be dismissed with `stopAgent`).
 */
export function useHumanHandoff(channel: string) {
  const [joined, setJoined] = useState(false);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [agentPresent, setAgentPresent] = useState(false);
  const [transcripts, setTranscripts] = useState<TranscriptTurn[]>([]);
  const [partialText, setPartialText] = useState('');
  const [partialSpeaker, setPartialSpeaker] = useState<'customer' | 'agent'>(
    'customer',
  );
  const [session, setSession] = useState<SessionState | null>(null);
  const [agentStopped, setAgentStopped] = useState(false);

  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const micRef = useRef<IMicrophoneAudioTrack | null>(null);
  const rtmRef = useRef<RTMClient | null>(null);
  const aiRef = useRef<AgoraVoiceAIType | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const localUidRef = useRef<string>(String(HUMAN_UID));

  // Deal state for the context panel.
  useEffect(() => {
    let cancelled = false;

    fetch(`${BACKEND_HTTP_URL}/api/session/${channel}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data) setSession(data);
      })
      .catch(() => {});

    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(BACKEND_WS_URL);
      wsRef.current = ws;
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'SESSION_STATE_UPDATE' && data.session) {
            setSession(data.session);
          }
        } catch {
          // ignore
        }
      };
    } catch {
      // backend offline — the page still works for voice
    }

    return () => {
      cancelled = true;
      try {
        ws?.close();
      } catch {
        // ignore
      }
    };
  }, [channel]);

  const applyTranscript = useCallback((raw: ToolkitTranscriptItem[]) => {
    const normalized = normalizeTranscript(raw, localUidRef.current);
    setTranscripts(getCompletedTurns(normalized, AGENT_UID));
    const live = getInProgressTurn(normalized, AGENT_UID);
    if (live?.text) {
      setPartialSpeaker(live.speaker);
      setPartialText(live.text);
    } else {
      setPartialText('');
    }
  }, []);

  const join = useCallback(async () => {
    setJoining(true);
    setError(null);
    try {
      // Token for the buyer's existing channel, as the human specialist uid.
      const res = await fetch(
        `/api/generate-agora-token?channel=${encodeURIComponent(
          channel,
        )}&uid=${HUMAN_UID}`,
      );
      const token: AgoraTokenData = await res.json();
      if (!res.ok) {
        throw new Error(
          (token as unknown as { error?: string }).error ||
            'Failed to generate token',
        );
      }
      localUidRef.current = token.uid;

      const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
      AgoraRTC.setLogLevel(1);
      const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      clientRef.current = client;

      client.on('user-published', async (user: IAgoraRTCRemoteUser, type) => {
        await client.subscribe(user, type);
        if (type === 'audio') user.audioTrack?.play();
      });
      client.on('user-joined', (user) => {
        if (user.uid.toString() === AGENT_UID) setAgentPresent(true);
      });
      client.on('user-left', (user) => {
        if (user.uid.toString() === AGENT_UID) setAgentPresent(false);
      });

      await client.join(
        process.env.NEXT_PUBLIC_AGORA_APP_ID!,
        channel,
        token.token,
        Number(token.uid),
      );

      const mic = await AgoraRTC.createMicrophoneAudioTrack();
      micRef.current = mic;
      await client.publish(mic);

      // RTM + toolkit: read the conversation that already happened.
      const { default: AgoraRTM } = await import('agora-rtm');
      const rtm: RTMClient = new AgoraRTM.RTM(
        process.env.NEXT_PUBLIC_AGORA_APP_ID!,
        token.uid,
      );
      await rtm.login({ token: token.token });
      await rtm.subscribe(channel);
      rtmRef.current = rtm;

      const { AgoraVoiceAI, AgoraVoiceAIEvents, TranscriptHelperMode } =
        await import('agora-agent-client-toolkit');
      const ai = await AgoraVoiceAI.init({
        rtcEngine: client,
        rtmConfig: { rtmEngine: rtm },
        renderMode: TranscriptHelperMode.TEXT,
        enableLog: false,
      });
      aiRef.current = ai;
      ai.on(AgoraVoiceAIEvents.TRANSCRIPT_UPDATED, (t) => {
        applyTranscript([...t] as ToolkitTranscriptItem[]);
      });
      ai.subscribeMessage(channel);

      setJoined(true);
    } catch (e) {
      console.error('[human handoff join]', e);
      setError(e instanceof Error ? e.message : 'Failed to join the call');
    } finally {
      setJoining(false);
    }
  }, [channel, applyTranscript]);

  /** Dismiss the AI so the specialist owns the conversation alone. */
  const dismissAgent = useCallback(async (agentId: string) => {
    try {
      const res = await fetch('/api/stop-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: agentId, conversation_id: channel }),
      });
      if (res.ok) setAgentStopped(true);
    } catch (e) {
      console.error('[dismiss agent]', e);
    }
  }, [channel]);

  const toggleMute = useCallback(() => {
    const mic = micRef.current;
    if (!mic) return;
    setIsMuted((prev) => {
      const next = !prev;
      void mic.setEnabled(!next);
      return next;
    });
  }, []);

  const leave = useCallback(async () => {
    try {
      aiRef.current?.unsubscribe();
      aiRef.current?.destroy();
    } catch {
      // ignore
    }
    aiRef.current = null;
    try {
      const mic = micRef.current;
      if (mic) {
        await clientRef.current?.unpublish(mic);
        mic.stop();
        mic.close();
      }
    } catch {
      // ignore
    }
    micRef.current = null;
    try {
      await clientRef.current?.leave();
    } catch {
      // ignore
    }
    clientRef.current = null;
    try {
      if (rtmRef.current) {
        await rtmRef.current.unsubscribe(channel);
        await rtmRef.current.logout();
      }
    } catch {
      // ignore
    }
    rtmRef.current = null;
    setJoined(false);
  }, [channel]);

  return {
    joined,
    joining,
    error,
    isMuted,
    agentPresent,
    agentStopped,
    transcripts,
    partialText,
    partialSpeaker,
    session,
    join,
    leave,
    toggleMute,
    dismissAgent,
  };
}
