'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type {
  IAgoraRTCClient,
  IMicrophoneAudioTrack,
  IRemoteAudioTrack,
  IAgoraRTCRemoteUser,
} from 'agora-rtc-sdk-ng';
import type { RTMClient } from 'agora-rtm';
import type {
  AgentState,
  AgoraVoiceAI as AgoraVoiceAIType,
} from 'agora-agent-client-toolkit';
import {
  VoiceState,
  SessionState,
  TranscriptTurn,
  IntegrationToast,
  PostCallDealMemo,
  PipelineMetric,
  ToolCallEvent,
  InterruptionEvent,
} from '@/lib/types';
import {
  BACKEND_HTTP_URL,
  BACKEND_WS_URL,
  DEFAULT_AGENT_UID,
} from '@/lib/agora';
import {
  getCompletedTurns,
  getInProgressTurn,
  mapVoiceState,
  normalizeTranscript,
  type ToolkitTranscriptItem,
} from '@/lib/conversation';
import type {
  AgentResponse,
  AgoraTokenData,
  SalesSessionSeed,
} from '@/types/conversation';

const AGENT_UID = String(DEFAULT_AGENT_UID);

const INITIAL_SESSION_STATE: SessionState = {
  conversation_id: 'sales_demo',
  customer: { name: null, company: null, email: null },
  requirements: { seat_count: 50, use_case: null, must_haves: [] },
  objections_raised: [],
  deal_state: {
    tier: 'pro',
    tier_name: 'Pro',
    list_price_per_seat: 35.0,
    effective_price_per_seat: 35.0,
    current_offer_pct_off: 0.0,
    margin_floor_pct: 15.0,
    concessions_given: [],
    trades_requested: [],
    margin_remaining_pct: 100.0,
  },
  outcome: null,
  escalated: false,
};

/**
 * Voice runtime for the sales cockpit, built on the Agora Conversational AI
 * quickstart architecture (AgoraIO-Conversational-AI/agent-quickstart-nextjs).
 *
 * The cloud pipeline owns the entire conversation: ASR → LLM → TTS runs inside
 * Agora (Deepgram + managed OpenAI + MiniMax by default), the agent's voice
 * arrives as a remote RTC audio track, and transcripts / agent state / latency
 * metrics / barge-in events arrive over RTM via the AgoraVoiceAI toolkit. The
 * browser only captures the microphone and renders.
 *
 * Tool calls are performed by Agora's engine against our Deal Engine MCP
 * server; they reach the cockpit as AGENT_TOOL_CALL frames on the backend
 * WebSocket.
 *
 * Deliberately imperative rather than using agora-rtc-react's declarative
 * hooks: the cockpit calls startCall()/endCall() from its own controls, so a
 * provider-and-conditional-mount structure would have meant restructuring the
 * app shell. Same primitives, same lifecycle, no UI changes.
 *
 * Deal-cockpit state (customer profile, deal terms, objections, integration
 * toasts, post-call memo) still streams from the FastAPI backend over its
 * WebSocket — that is unchanged.
 */
export function useAgoraVoice() {
  const [inCall, setInCall] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [volumeLevel, setVolumeLevel] = useState<number>(0);
  const [interrupted, setInterrupted] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const [sessionState, setSessionState] =
    useState<SessionState>(INITIAL_SESSION_STATE);
  const [transcripts, setTranscripts] = useState<TranscriptTurn[]>([]);
  const [partialText, setPartialText] = useState<string>('');
  const [partialSpeaker, setPartialSpeaker] = useState<'customer' | 'agent'>(
    'customer',
  );
  const [toasts, setToasts] = useState<IntegrationToast[]>([]);
  const [dealMemo, setDealMemo] = useState<PostCallDealMemo | null>(null);

  // Live Agora telemetry, surfaced in the cockpit's pipeline panel.
  const [metrics, setMetrics] = useState<PipelineMetric[]>([]);
  const [toolCalls, setToolCalls] = useState<ToolCallEvent[]>([]);
  const [interruptions, setInterruptions] = useState<InterruptionEvent[]>([]);

  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
  const remoteAudioRef = useRef<IRemoteAudioTrack | null>(null);
  const rtmRef = useRef<RTMClient | null>(null);
  const voiceAIRef = useRef<AgoraVoiceAIType | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const volumeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const interruptTimerRef = useRef<NodeJS.Timeout | null>(null);
  // Holds the latest endCall so RTC event handlers registered inside startCall
  // can invoke it without capturing a stale closure.
  const endCallRef = useRef<() => Promise<void>>(async () => {});
  // Guards against ending the same call twice (e.g. the agent leaving at the
  // same moment the user clicks End Call).
  const endingRef = useRef<boolean>(false);

  const currentChannelRef = useRef<string>('');
  const agentIdRef = useRef<string | null>(null);
  const localUidRef = useRef<string>('');

  // Inputs to the voice-state mapping. Held as refs so the RTC event handlers
  // and the toolkit's RTM events can each update their own slice without
  // stale-closure races, then recompute the combined state.
  const agentStateRef = useRef<AgentState | null>(null);
  const agentConnectedRef = useRef<boolean>(false);
  const connectionStateRef = useRef<string>('DISCONNECTED');

  const recomputeVoiceState = useCallback(() => {
    setVoiceState(
      mapVoiceState(
        agentStateRef.current,
        agentConnectedRef.current,
        connectionStateRef.current,
      ),
    );
  }, []);

  // -----------------------------------------------------------------
  // 1. Deal Cockpit WebSocket (FastAPI) — unchanged from before
  // -----------------------------------------------------------------
  useEffect(() => {
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(BACKEND_WS_URL);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'AGENT_TOOL_CALL') {
            setToolCalls((prev) =>
              [
                {
                  id: `${data.timestamp}-${data.tool}-${Math.random()
                    .toString(36)
                    .slice(2, 6)}`,
                  tool: String(data.tool),
                  source: data.source === 'mcp' ? 'mcp' : 'middleware',
                  args: (data.args ?? {}) as Record<string, unknown>,
                  resultSummary: String(data.result_summary ?? ''),
                  durationMs:
                    typeof data.duration_ms === 'number'
                      ? data.duration_ms
                      : null,
                  timestamp: Number(data.timestamp) || Date.now(),
                } as ToolCallEvent,
                ...prev,
              ].slice(0, 40),
            );
            return;
          }

          if (data.type === 'SESSION_STATE_UPDATE' && data.session) {
            setSessionState(data.session);
            if (data.toast) {
              addToast(
                data.toast.service,
                data.toast.title,
                data.toast.detail,
                data.toast.url || undefined,
              );
            }
          }
        } catch {
          // ignore malformed frames
        }
      };
    } catch {
      // Backend not running — the cockpit renders its initial state.
    }

    return () => {
      try {
        ws?.close();
      } catch {
        // ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addToast = (
    service: 'hubspot' | 'calendar' | 'slack' | 'deal',
    title: string,
    detail: string,
    url?: string,
  ) => {
    const newToast: IntegrationToast = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      service,
      title,
      detail,
      timestamp: Date.now(),
      url,
    };
    setToasts((prev) => [...prev, newToast]);

    if (url) {
      // A real booking just happened — open it immediately. Browsers block
      // window.open() unless it's a direct result of a user click, and this
      // fires from an async WebSocket message, so this attempt can be
      // silently blocked. That's why the toast itself always shows the link
      // too (see IntegrationToasts) — the one reliable path if the popup
      // blocker wins.
      try {
        window.open(url, '_blank', 'noopener,noreferrer');
      } catch {
        // ignore — the toast's own link is the fallback
      }
    }

    // A booking confirmation is worth more than a glance — give it longer
    // on screen than a routine toast so there's time to notice and click the
    // link if the auto-open above got blocked.
    setTimeout(
      () => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      },
      url ? 15000 : 6000,
    );
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // -----------------------------------------------------------------
  // 2. Transcript handling — driven entirely by the toolkit over RTM
  // -----------------------------------------------------------------
  const applyTranscript = useCallback((raw: ToolkitTranscriptItem[]) => {
    const normalized = normalizeTranscript(raw, localUidRef.current);

    setTranscripts(getCompletedTurns(normalized, AGENT_UID));

    const live = getInProgressTurn(normalized, AGENT_UID);
    if (live && live.text) {
      setPartialSpeaker(live.speaker);
      setPartialText(live.text);
    } else {
      setPartialText('');
    }
  }, []);

  // -----------------------------------------------------------------
  // 3. Start Call
  // -----------------------------------------------------------------
  const startCall = async (initialInfo?: {
    name?: string;
    company?: string;
    email?: string;
    seats?: number;
  }) => {
    setConnecting(true);
    setInterrupted(false);
    setDealMemo(null);
    setTranscripts([]);
    setPartialText('');
    setMetrics([]);
    setToolCalls([]);
    setInterruptions([]);
    endingRef.current = false;

    try {
      // 3a. RTC + RTM token and channel from our own API route.
      const tokenRes = await fetch('/api/generate-agora-token');
      const tokenData: AgoraTokenData = await tokenRes.json();
      if (!tokenRes.ok) {
        throw new Error(
          (tokenData as unknown as { error?: string }).error ||
            'Failed to generate Agora token',
        );
      }

      currentChannelRef.current = tokenData.channel;
      localUidRef.current = tokenData.uid;

      const seed: SalesSessionSeed = {
        customer_name: initialInfo?.name || 'Tina',
        company: initialInfo?.company || 'Razorpay',
        email: initialInfo?.email || 'gargiesingh321@gmail.com',
        seat_count: initialInfo?.seats || 50,
      };

      // 3b. Invite the agent and bring RTM up in parallel — both only need the
      // token response. RTM must be ready before the toolkit subscribes.
      const [agentData, rtm] = await Promise.all([
        fetch('/api/invite-agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requester_id: tokenData.uid,
            channel_name: tokenData.channel,
            seed,
          }),
        })
          .then(async (res) => {
            if (!res.ok) {
              const err = await res.json().catch(() => ({}));
              console.error('[invite-agent]', err);
              return null;
            }
            return (await res.json()) as AgentResponse;
          })
          .catch((err) => {
            console.error('Failed to start conversation with agent:', err);
            return null;
          }),

        (async () => {
          const { default: AgoraRTM } = await import('agora-rtm');
          const rtmClient: RTMClient = new AgoraRTM.RTM(
            process.env.NEXT_PUBLIC_AGORA_APP_ID!,
            tokenData.uid,
          );
          await rtmClient.login({ token: tokenData.token });
          await rtmClient.subscribe(tokenData.channel);
          return rtmClient;
        })(),
      ]);

      rtmRef.current = rtm;
      agentIdRef.current = agentData?.agent_id ?? null;

      if (!agentData) {
        addToast(
          'deal',
          'Agent did not join',
          'The Agora agent could not be started — check credentials and the backend.',
        );
      }

      // 3c. Join the RTC channel and publish the microphone.
      const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
      AgoraRTC.setLogLevel(1);
      // Module-level parameter; must be set before publishing audio for
      // transcript timing to be accurate.
      (
        AgoraRTC as unknown as {
          setParameter?: (key: string, value: unknown) => void;
        }
      ).setParameter?.('ENABLE_AUDIO_PTS', true);

      const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      clientRef.current = client;

      client.on('connection-state-change', (curState) => {
        connectionStateRef.current = curState;
        recomputeVoiceState();
      });

      client.on(
        'user-published',
        async (user: IAgoraRTCRemoteUser, mediaType) => {
          await client.subscribe(user, mediaType);
          if (mediaType === 'audio' && user.audioTrack) {
            // The agent's voice — the only audio source in the app now.
            remoteAudioRef.current = user.audioTrack;
            user.audioTrack.play();
          }
        },
      );

      client.on('user-unpublished', (_user, mediaType) => {
        if (mediaType === 'audio') {
          remoteAudioRef.current = null;
        }
      });

      client.on('user-joined', (user) => {
        if (user.uid.toString() === AGENT_UID) {
          agentConnectedRef.current = true;
          recomputeVoiceState();
        }
      });

      client.on('user-left', (user) => {
        if (user.uid.toString() === AGENT_UID) {
          agentConnectedRef.current = false;
          recomputeVoiceState();

          // The agent left the channel — it hit its idle timeout (60s of
          // silence), was stopped server-side, or errored out. Nothing further
          // can happen on this call, so wrap it up and produce the deal memo
          // instead of leaving the cockpit sitting in a dead "listening" state.
          if (!endingRef.current) {
            endingRef.current = true;
            void endCallRef.current();
          }
        }
      });

      await client.join(
        process.env.NEXT_PUBLIC_AGORA_APP_ID!,
        tokenData.channel,
        tokenData.token,
        Number(tokenData.uid),
      );

      const micTrack = await AgoraRTC.createMicrophoneAudioTrack();
      localTrackRef.current = micTrack;
      await client.publish(micTrack);

      // 3d. Toolkit: transcripts, agent state, metrics, errors over RTM.
      const { AgoraVoiceAI, AgoraVoiceAIEvents, TranscriptHelperMode } =
        await import('agora-agent-client-toolkit');

      const ai = await AgoraVoiceAI.init({
        rtcEngine: client,
        rtmConfig: { rtmEngine: rtm },
        renderMode: TranscriptHelperMode.TEXT,
        enableLog: false,
      });
      voiceAIRef.current = ai;

      ai.on(AgoraVoiceAIEvents.TRANSCRIPT_UPDATED, (t) => {
        applyTranscript([...t] as ToolkitTranscriptItem[]);
      });

      ai.on(AgoraVoiceAIEvents.AGENT_STATE_CHANGED, (_id, event) => {
        agentStateRef.current = event.state;
        recomputeVoiceState();
      });

      ai.on(AgoraVoiceAIEvents.AGENT_METRICS, (_id, metric) => {
        setMetrics((prev) =>
          [
            {
              id: `${metric.timestamp}-${metric.type}-${metric.name}`,
              module: String(metric.type),
              name: String(metric.name),
              valueMs: Number(metric.value),
              timestamp: Number(metric.timestamp) || Date.now(),
            } as PipelineMetric,
            ...prev,
          ].slice(0, 60),
        );
      });

      ai.on(AgoraVoiceAIEvents.AGENT_INTERRUPTED, (_id, event) => {
        setInterruptions((prev) =>
          [
            {
              id: `${event.timestamp}-${event.turnID}`,
              turnId: Number(event.turnID),
              timestamp: Number(event.timestamp) || Date.now(),
            } as InterruptionEvent,
            ...prev,
          ].slice(0, 20),
        );
        setInterrupted(true);
        if (interruptTimerRef.current) clearTimeout(interruptTimerRef.current);
        interruptTimerRef.current = setTimeout(
          () => setInterrupted(false),
          2500,
        );
      });

      ai.on(AgoraVoiceAIEvents.AGENT_ERROR, (_id, error) => {
        console.error('[agent-error]', error);
        addToast(
          'deal',
          'Agent error',
          `${error.type}: ${error.message}`,
        );
      });

      ai.subscribeMessage(tokenData.channel);

      setInCall(true);
      setConnecting(false);
      connectionStateRef.current = 'CONNECTED';
      recomputeVoiceState();

      // 3e. Volume sampling for the orb: the agent's track while it speaks,
      // the microphone otherwise.
      volumeIntervalRef.current = setInterval(() => {
        const remote = remoteAudioRef.current;
        const local = localTrackRef.current;
        const source =
          agentStateRef.current === 'speaking' && remote ? remote : local;
        if (!source) return;
        const level = source.getVolumeLevel();
        if (level > 0.008) {
          setVolumeLevel(Math.min(1.0, level * 5.0));
        } else {
          setVolumeLevel((prev) => Math.max(0, prev * 0.75));
        }
      }, 50);

      // Point the cockpit WebSocket at this conversation.
      try {
        wsRef.current?.send(
          JSON.stringify({
            type: 'GET_SESSION',
            conversation_id: tokenData.channel,
          }),
        );
      } catch {
        // ignore
      }
    } catch (error) {
      console.error('[startCall]', error);
      setConnecting(false);
      setVoiceState('idle');
      addToast(
        'deal',
        'Could not start the call',
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  };

  // -----------------------------------------------------------------
  // 4. End Call
  // -----------------------------------------------------------------
  const endCall = useCallback(async () => {
    const conversationId = currentChannelRef.current;
    const agentId = agentIdRef.current;

    if (volumeIntervalRef.current) {
      clearInterval(volumeIntervalRef.current);
      volumeIntervalRef.current = null;
    }

    try {
      voiceAIRef.current?.unsubscribe();
      voiceAIRef.current?.destroy();
    } catch {
      // ignore
    }
    voiceAIRef.current = null;

    try {
      const track = localTrackRef.current;
      if (track) {
        await clientRef.current?.unpublish(track);
        track.stop();
        track.close();
      }
    } catch {
      // ignore
    }
    localTrackRef.current = null;
    remoteAudioRef.current = null;

    try {
      await clientRef.current?.leave();
    } catch {
      // ignore
    }
    clientRef.current = null;

    try {
      if (rtmRef.current && conversationId) {
        await rtmRef.current.unsubscribe(conversationId);
        await rtmRef.current.logout();
      }
    } catch {
      // ignore
    }
    rtmRef.current = null;

    // Stop the cloud agent and finalize the session so the deal memo is built.
    if (agentId) {
      try {
        await fetch('/api/stop-conversation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            agent_id: agentId,
            conversation_id: conversationId,
          }),
        });
      } catch (error) {
        console.error('[stop-conversation]', error);
      }
    }

    // Fetch the post-call memo regardless of whether the agent stop succeeded.
    if (conversationId) {
      try {
        const res = await fetch(
          `${BACKEND_HTTP_URL}/api/session/${conversationId}/deal-memo`,
        );
        if (res.ok) setDealMemo(await res.json());
      } catch (error) {
        console.error('[deal-memo]', error);
      }
    }

    agentIdRef.current = null;
    agentStateRef.current = null;
    agentConnectedRef.current = false;
    connectionStateRef.current = 'DISCONNECTED';

    setInCall(false);
    setConnecting(false);
    setVoiceState('idle');
    setVolumeLevel(0);
    setPartialText('');
    setIsMuted(false);
    endingRef.current = false;
  }, []);

  // Keep the ref pointing at the current endCall for use inside RTC handlers.
  useEffect(() => {
    endCallRef.current = endCall;
  }, [endCall]);

  // -----------------------------------------------------------------
  // 5. Controls
  // -----------------------------------------------------------------
  const toggleMute = useCallback(() => {
    const track = localTrackRef.current;
    if (!track) return;
    setIsMuted((prev) => {
      const next = !prev;
      void track.setEnabled(!next);
      return next;
    });
  }, []);

  /**
   * The microphone is continuously live now — Agora's cloud VAD decides when a
   * turn starts and ends, so there is no client-side capture to toggle. The
   * cockpit's mic button therefore maps onto mute, and isRecordingSTT reports
   * whether the mic is actually open.
   */
  const isRecordingSTT = inCall && !isMuted;
  const toggleRecordingSTT = toggleMute;

  /**
   * Text typed into the cockpit is injected into the live agent pipeline, so
   * Emily answers out loud exactly as if it had been spoken. Falls back to the
   * transcript-only path if the Next.js process no longer holds the session.
   */
  const sendManualMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const agentId = agentIdRef.current;
    if (!agentId) return;

    try {
      const res = await fetch('/api/agent-think', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: agentId, text: trimmed }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error('[agent-think]', err);
        // Show the buyer's message locally so the turn is not silently lost.
        setTranscripts((prev) => [
          ...prev,
          {
            id: `local-${Date.now()}`,
            speaker: 'customer',
            text: trimmed,
            isFinal: true,
            timestamp: Date.now(),
          },
        ]);
        addToast(
          'deal',
          'Message not delivered',
          'The agent session is no longer held by this server — restart the call.',
        );
      }
    } catch (error) {
      console.error('[agent-think]', error);
    }
  }, []);

  // Clean up on unmount.
  useEffect(() => {
    return () => {
      if (volumeIntervalRef.current) clearInterval(volumeIntervalRef.current);
      if (interruptTimerRef.current) clearTimeout(interruptTimerRef.current);
    };
  }, []);

  return {
    inCall,
    connecting,
    voiceState,
    volumeLevel,
    interrupted,
    isMuted,
    isRecordingSTT,
    toggleRecordingSTT,
    // Barge-in queueing was a workaround for the browser-side turn loop, which
    // Agora's cloud pipeline now handles. Retained so the cockpit's props stay
    // stable; always false.
    hasQueuedTurn: false,
    sessionState,
    transcripts,
    partialText,
    partialSpeaker,
    toasts,
    dealMemo,
    metrics,
    toolCalls,
    interruptions,
    startCall,
    endCall,
    toggleMute,
    dismissToast,
    sendManualMessage,
    closeDealMemo: () => setDealMemo(null),
  };
}
