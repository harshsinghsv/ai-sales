'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { IAgoraRTCClient, IMicrophoneAudioTrack, IRemoteAudioTrack, IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';
import {
  VoiceState,
  SessionState,
  TranscriptTurn,
  IntegrationToast,
  PostCallDealMemo
} from '@/lib/types';

interface ISpeechRecognitionEvent {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      length: number;
      [index: number]: {
        transcript: string;
        confidence: number;
      };
    };
  };
}

interface ISpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: ISpeechRecognitionEvent) => void) | null;
  onerror: ((event: unknown) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionConstructor = new () => ISpeechRecognitionInstance;

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
    margin_remaining_pct: 100.0
  },
  outcome: null,
  escalated: false
};

const BACKEND_HTTP_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
const BACKEND_WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws';

export function useAgoraVoice() {
  const [inCall, setInCall] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [volumeLevel, setVolumeLevel] = useState<number>(0);
  const [interrupted, setInterrupted] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const [sessionState, setSessionState] = useState<SessionState>(INITIAL_SESSION_STATE);
  const [transcripts, setTranscripts] = useState<TranscriptTurn[]>([]);
  const [partialText, setPartialText] = useState<string>('');
  const [partialSpeaker, setPartialSpeaker] = useState<'customer' | 'agent'>('customer');
  const [toasts, setToasts] = useState<IntegrationToast[]>([]);
  const [dealMemo, setDealMemo] = useState<PostCallDealMemo | null>(null);
  // Single-slot turn queue: when the user barges in while a turn is still
  // being processed or spoken, keep the latest text instead of dropping it.
  const [hasQueuedTurn, setHasQueuedTurn] = useState<boolean>(false);
  const queuedTurnRef = useRef<string | null>(null);

  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const volumeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentChannelRef = useRef<string>('');
  const recognitionRef = useRef<ISpeechRecognitionInstance | null>(null);
  const inCallRef = useRef<boolean>(false);
  const isSpeakingRef = useRef<boolean>(false);
  // True from the moment a customer turn is sent for processing until the
  // agent's reply actually starts playing (or the turn errors out). VAD must
  // stay quiet through this whole window, not just while audio is playing —
  // otherwise a second utterance can get captured and sent before the first
  // one's reply comes back, producing overlapping/out-of-order turns.
  const isThinkingRef = useRef<boolean>(false);
  // The Mute button used to only disable the Agora RTC track — the VAD's own
  // independent mic stream (what's actually driving STT in this demo) kept
  // listening regardless, so muting did nothing. This ref lets the VAD loop
  // respect it too.
  const isMutedRef = useRef<boolean>(false);
  // Monotonic counter identifying the "current" speakAgentVoice call. If two
  // calls ever end up in flight at once (e.g. a race elsewhere we haven't
  // closed off), whichever one's async work resolves without still being the
  // latest token discards itself instead of playing — guarantees at most one
  // audio source is ever actually speaking.
  const speechRequestIdRef = useRef<number>(0);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const [isRecordingSTT, setIsRecordingSTT] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  // VAD (Voice Activity Detection) refs for hands-free mode
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const vadStreamRef = useRef<MediaStream | null>(null);
  const vadActiveRef = useRef<boolean>(false);
  const vadSilenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const vadRecordingRef = useRef<boolean>(false);
  const vadChunksRef = useRef<Blob[]>([]);
  const vadRecorderRef = useRef<MediaRecorder | null>(null);
  const vadRafRef = useRef<number | null>(null);

  useEffect(() => {
    inCallRef.current = inCall;
  }, [inCall]);

  // 1. Setup WebSocket for Deal Cockpit Synchronization
  useEffect(() => {
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(BACKEND_WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[WebSocket] Connected to Sales Agent Middleware');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'SESSION_STATE_UPDATE') {
            if (data.session) {
              setSessionState(data.session);
            }
            if (data.toast) {
              addToast(data.toast.service, data.toast.title, data.toast.detail);
            }
          }
        } catch (e) {
          console.error('[WebSocket] Failed to parse message', e);
        }
      };

      ws.onclose = () => {
        console.log('[WebSocket] Disconnected from Sales Agent Middleware');
      };
    } catch (err) {
      console.warn('[WebSocket] Error initiating connection', err);
    }

    return () => {
      if (ws) {
        try {
          ws.close();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const addToast = (service: 'hubspot' | 'calendar' | 'slack' | 'deal', title: string, detail: string) => {
    const newToast: IntegrationToast = {
      id: Math.random().toString(36).substring(2, 9),
      service,
      title,
      detail,
      timestamp: Date.now()
    };

    setToasts((prev) => [newToast, ...prev.slice(0, 4)]);

    setTimeout(() => {
      dismissToast(newToast.id);
    }, 6000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Playback speech synthesis for Aarav's responses with live Sarvam Bulbul audio
  // After any reply finishes (or is skipped), drain one queued barge-in turn.
  const drainQueuedTurn = useCallback(() => {
    const next = queuedTurnRef.current;
    queuedTurnRef.current = null;
    setHasQueuedTurn(false);
    if (next && next.trim() && inCallRef.current) {
      // Defer a tick so voice-state refs settle before the next turn starts.
      setTimeout(() => processCustomerTurnRef.current(next), 0);
    }
  }, []);
  const processCustomerTurnRef = useRef<(text: string) => Promise<void>>(
    async () => undefined
  );

  const speakAgentVoice = useCallback(async (text: string) => {
    // Whatever happens next (speaks, or has nothing to say), the "thinking"
    // window is over — VAD gating switches to isSpeakingRef from here.
    isThinkingRef.current = false;
    const requestId = ++speechRequestIdRef.current;

    if (!text || !text.trim()) {
      setVoiceState('listening');
      drainQueuedTurn();
      return;
    }

    // Stop any existing playing audio
    if (audioPlayerRef.current) {
      try {
        audioPlayerRef.current.pause();
      } catch {
        // ignore
      }
      audioPlayerRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setVoiceState('speaking');
    isSpeakingRef.current = true;

    // 1. Try to synthesize via our backend Sarvam Bulbul TTS shim
    try {
      const res = await fetch(`${BACKEND_HTTP_URL}/v1/audio/speech`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: text.slice(0, 500),
          voice: 'aditya',
          response_format: 'wav'
        })
      });

      if (res.ok) {
        const blob = await res.blob();
        if (blob.size > 2000) {
          if (requestId !== speechRequestIdRef.current) {
            // A newer reply superseded this one while we were fetching — drop it.
            return;
          }
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          audioPlayerRef.current = audio;

          const animInterval = setInterval(() => {
            if (!audio.paused && !audio.ended && isSpeakingRef.current) {
              setVolumeLevel(0.35 + Math.random() * 0.45);
            } else {
              clearInterval(animInterval);
            }
          }, 75);

          audio.onended = () => {
            clearInterval(animInterval);
            setVolumeLevel(0);
            isSpeakingRef.current = false;
            audioPlayerRef.current = null;
            URL.revokeObjectURL(audioUrl);
            if (inCallRef.current) {
              setVoiceState('listening');
            }
            drainQueuedTurn();
          };

          audio.onerror = () => {
            clearInterval(animInterval);
            setVolumeLevel(0);
            isSpeakingRef.current = false;
            audioPlayerRef.current = null;
            URL.revokeObjectURL(audioUrl);
            if (inCallRef.current) {
              setVoiceState('listening');
            }
            drainQueuedTurn();
          };

          await audio.play();
          return;
        }
      }
    } catch (e) {
      console.log('[Sarvam TTS play failed, falling back to browser voice]', e);
    }

    // 2. Fallback: Browser Web Speech Synthesis
    try {
      if (requestId !== speechRequestIdRef.current) return; // superseded — drop it

      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        setVoiceState('listening');
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.02;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice =
        voices.find(
          (v) =>
            v.lang.includes('en-IN') ||
            v.lang.includes('hi-IN') ||
            v.name.toLowerCase().includes('india')
        ) ||
        voices.find((v) => v.lang.startsWith('en')) ||
        null;

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      const animInterval = setInterval(() => {
        if (window.speechSynthesis.speaking) {
          setVolumeLevel(0.35 + Math.random() * 0.45);
        } else {
          clearInterval(animInterval);
        }
      }, 75);

      utterance.onend = () => {
        clearInterval(animInterval);
        setVolumeLevel(0);
        isSpeakingRef.current = false;
        if (inCallRef.current) {
          setVoiceState('listening');
        }
        drainQueuedTurn();
      };

      utterance.onerror = () => {
        clearInterval(animInterval);
        setVolumeLevel(0);
        isSpeakingRef.current = false;
        if (inCallRef.current) {
          setVoiceState('listening');
        }
        drainQueuedTurn();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('[Speech synthesis error]', e);
      setVoiceState('listening');
      drainQueuedTurn();
    }
  }, [drainQueuedTurn]);

  // Process a customer turn (from voice STT or manual button/input)
  const processCustomerTurn = useCallback(async (text: string) => {
    if (!text || !text.trim()) return;
    if (isThinkingRef.current || isSpeakingRef.current) {
      // A previous turn is still being processed/spoken — queue the latest
      // text (single slot) instead of dropping the barge-in. It runs as soon
      // as the current reply finishes.
      queuedTurnRef.current = text.trim();
      setHasQueuedTurn(true);
      return;
    }
    isThinkingRef.current = true;

    // Add user turn to transcript
    setTranscripts((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        speaker: 'customer',
        text: text.trim(),
        isFinal: true,
        timestamp: Date.now()
      }
    ]);
    setVoiceState('thinking');

    try {
      const channel = currentChannelRef.current || 'sales_demo';
      const res = await fetch(`${BACKEND_HTTP_URL}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: channel,
          messages: [{ role: 'user', content: text.trim() }]
        })
      });
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || 'Bilkul, I understand. Let me address those requirements.';

      setTranscripts((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          speaker: 'agent',
          text: reply,
          isFinal: true,
          timestamp: Date.now()
        }
      ]);

      // Speak response aloud through audio
      speakAgentVoice(reply);
    } catch (e) {
      console.error('Error processing turn', e);
      isThinkingRef.current = false;
      setVoiceState('listening');
      drainQueuedTurn();
    }
  }, [speakAgentVoice, drainQueuedTurn]);

  useEffect(() => {
    processCustomerTurnRef.current = processCustomerTurn;
  }, [processCustomerTurn]);

  // 2. Start Call Session
  const startCall = async (initialInfo?: { name?: string; company?: string; email?: string; seats?: number }) => {
    setConnecting(true);
    setInterrupted(false);
    setDealMemo(null);

    const channelName = `sales_${Math.random().toString(36).substring(2, 8)}`;
    currentChannelRef.current = channelName;

    try {
      // 1. Call Backend to start session & launch Agora Agent
      const res = await fetch(`${BACKEND_HTTP_URL}/api/session/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel_name: channelName,
          user_rtc_uid: '1001',
          customer_name: initialInfo?.name || 'Rahul Sharma',
          company: initialInfo?.company || 'Razorpay',
          email: initialInfo?.email || 'rahul.sharma@razorpay.com',
          seat_count: initialInfo?.seats || 50
        })
      });

      const data = await res.json();
      if (data.session) {
        setSessionState(data.session);
      }

      // 2. Dynamically import Agora Web SDK
      const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
      AgoraRTC.setLogLevel(1);

      const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      clientRef.current = client;

      // Handle Remote Audio Track (Agent Voice from Agora cloud)
      client.on('user-published', async (user: IAgoraRTCRemoteUser, mediaType: string) => {
        await client.subscribe(user, mediaType as 'audio');
        if (mediaType === 'audio' && user.audioTrack) {
          user.audioTrack.play();
          setVoiceState('speaking');
        }
      });

      client.on('user-unpublished', (_user, mediaType: string) => {
        if (mediaType === 'audio') {
          setVoiceState('listening');
        }
      });

      // Join Agora Channel
      const appId = data.app_id || 'sandbox_app_id';
      const token = data.user_token || null;
      const uid = 1001;

      if (appId && !appId.startsWith('sandbox')) {
        await client.join(appId, channelName, token, uid);
        const micTrack = await AgoraRTC.createMicrophoneAudioTrack();
        localTrackRef.current = micTrack;
        await client.publish(micTrack);
      } else {
        try {
          const micTrack = await AgoraRTC.createMicrophoneAudioTrack();
          localTrackRef.current = micTrack;
        } catch (e) {
          console.log('[Microphone track initialization]', e);
        }
      }

      setInCall(true);
      inCallRef.current = true;
      setConnecting(false);
      setVoiceState('listening');

      // 3. Audio Volume Sampling Loop for VoiceOrb reactivity (sensitive to normal mic levels)
      volumeIntervalRef.current = setInterval(() => {
        if (localTrackRef.current && !isSpeakingRef.current) {
          const localVol = localTrackRef.current.getVolumeLevel();
          if (localVol > 0.008) {
            setVolumeLevel(Math.min(1.0, localVol * 5.0));
            setVoiceState('listening');
          } else {
            setVolumeLevel((prev) => Math.max(0, prev * 0.75));
          }
        }
      }, 50);

      // 4. Start Browser Speech Recognition for Continuous Microphone Input
      if (typeof window !== 'undefined') {
        const windowWithSpeech = window as unknown as {
          SpeechRecognition?: SpeechRecognitionConstructor;
          webkitSpeechRecognition?: SpeechRecognitionConstructor;
        };
        const SpeechConstructor =
          windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

        if (SpeechConstructor) {
          try {
            const recognition = new SpeechConstructor();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-IN';

            let pendingInterim = '';
            let silenceTimer: NodeJS.Timeout | null = null;

            recognition.onresult = (event: ISpeechRecognitionEvent) => {
              let interimTranscript = '';
              for (let i = event.resultIndex; i < event.results.length; ++i) {
                const res = event.results[i];
                if (res.isFinal) {
                  const finalSpeech = res[0].transcript.trim();
                  if (silenceTimer) clearTimeout(silenceTimer);
                  if (finalSpeech) {
                    pendingInterim = '';
                    setPartialText('');
                    processCustomerTurn(finalSpeech);
                  }
                } else {
                  interimTranscript += res[0].transcript;
                  pendingInterim = interimTranscript;
                  setPartialSpeaker('customer');
                  setPartialText(interimTranscript);

                  // Barge-in: if user starts speaking while agent is speaking, cut off agent
                  if (audioPlayerRef.current) {
                    try {
                      audioPlayerRef.current.pause();
                    } catch {
                      // ignore
                    }
                    audioPlayerRef.current = null;
                  }
                  if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.speaking) {
                    window.speechSynthesis.cancel();
                  }
                  if (isSpeakingRef.current) {
                    isSpeakingRef.current = false;
                    setInterrupted(true);
                    setTimeout(() => setInterrupted(false), 2200);
                  }

                  // Silence debounce: If user stops speaking for 1.2s without isFinal, automatically finalize turn
                  if (silenceTimer) clearTimeout(silenceTimer);
                  silenceTimer = setTimeout(() => {
                    if (pendingInterim && pendingInterim.trim().length > 1) {
                      const spoken = pendingInterim.trim();
                      pendingInterim = '';
                      setPartialText('');
                      processCustomerTurn(spoken);
                    }
                  }, 1200);
                }
              }
            };

            recognition.onerror = (e: unknown) => {
              const err = e as { error?: string };
              console.log('[Speech recognition event]', err?.error || e);
              if (err?.error === 'not-allowed') {
                addToast('deal', 'Microphone Permission Needed', 'Please allow microphone access in your browser address bar.');
                // Stop the browser recognizer so it doesn't keep restarting and
                // fighting the VAD recorder for the microphone.
                recognitionRef.current = null;
                try { recognition.abort(); } catch { /* ignore */ }
                startVAD();
              } else if (err?.error === 'network' || err?.error === 'aborted') {
                // Network/aborted errors — fall back to VAD permanently for this call
                recognitionRef.current = null;
                try { recognition.abort(); } catch { /* ignore */ }
                if (inCallRef.current) startVAD();
              }
            };

            recognition.onend = () => {
              // Flush any unfinalized speech
              if (pendingInterim && pendingInterim.trim().length > 1) {
                if (silenceTimer) clearTimeout(silenceTimer);
                const spoken = pendingInterim.trim();
                pendingInterim = '';
                setPartialText('');
                processCustomerTurn(spoken);
              }

              // Safely restart after short timeout so Chrome doesn't crash
              if (inCallRef.current) {
                setTimeout(() => {
                  try {
                    if (inCallRef.current && recognitionRef.current) {
                      recognition.start();
                    }
                  } catch {
                    // Web Speech API unavailable — fall back to always-on VAD
                    if (inCallRef.current) startVAD();
                  }
                }, 250);
              }
            };

            recognition.start();
            recognitionRef.current = recognition;
          } catch (e) {
            console.warn('[Speech recognition init error — falling back to VAD]', e);
            startVAD();
          }
        } else {
          // Web Speech API not available at all — go straight to VAD
          console.log('[Speech API unavailable] Starting hands-free VAD mode');
          startVAD();
        }
      }

      // Add initial greeting transcript & speak it aloud
      const greeting =
        'Namaste! Welcome to TeamSync. Main Aarav hoon. I understand you are exploring our collaboration platform — how can I help you today?';
      setTranscripts([
        {
          id: 'initial_turn',
          speaker: 'agent',
          text: greeting,
          isFinal: true,
          timestamp: Date.now()
        }
      ]);

      addToast('deal', 'Voice Agent Connected', 'Aarav is listening with Sarvam Hinglish STT.');

      // Play Aarav greeting out loud!
      setTimeout(() => {
        speakAgentVoice(greeting);
      }, 500);

    } catch (err) {
      console.error('[Failed to start call]', err);
      setConnecting(false);
      setInCall(true);
      inCallRef.current = true;
      setVoiceState('listening');
    }
  };

  // VAD: Hands-free voice activity detection using Web Audio API.
  // Monitors mic levels continuously — when speech is detected, auto-records
  // and fires Sarvam STT when silence returns. No tapping required.
  const startVAD = useCallback(async () => {
    if (vadActiveRef.current) return; // already running
    if (typeof window === 'undefined' || !navigator.mediaDevices) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, sampleRate: 16000 }
      });
      vadStreamRef.current = stream;
      vadActiveRef.current = true;

      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      analyserRef.current = analyser;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      // Restrict level detection to the frequency band where human voice actually
      // lives (~150Hz-3800Hz). Keyboard clicks, mouse clicks, and desk thumps are
      // broadband/percussive transients that dump energy well outside this band
      // (very low thumps + high-frequency clicks) — ignoring those bins makes the
      // detector far less trigger-happy on typing without dulling it on speech.
      const nyquist = audioCtx.sampleRate / 2;
      const hzPerBin = nyquist / analyser.frequencyBinCount;
      const voiceBinLow = Math.max(1, Math.round(150 / hzPerBin));
      const voiceBinHigh = Math.min(analyser.frequencyBinCount - 1, Math.round(3800 / hzPerBin));

      // MIME type detection
      const preferredMimes = [
        'audio/webm;codecs=opus', 'audio/webm',
        'audio/ogg;codecs=opus', 'audio/ogg', 'audio/mp4'
      ];
      const mimeType = preferredMimes.find((m) => MediaRecorder.isTypeSupported(m)) || '';
      const fileExt = mimeType.includes('ogg') ? 'ogg' : mimeType.includes('mp4') ? 'mp4' : 'webm';

      // Tuned for laptop-speaker playback (no headphones): the agent's own voice
      // comes out of the speakers and bleeds back into the mic, so both bars sit
      // noticeably above typical ambient/echo level to avoid self-triggering.
      const SPEECH_THRESHOLD = 28;  // avg frequency magnitude 0-255 — tune if too sensitive
      // Raising SPEECH_THRESHOLD to fight echo/noise made brief natural pauses
      // between words look like "silence" sooner, cutting sentences off
      // mid-thought. Give a longer gap before actually finalizing the clip.
      const SILENCE_MS = 1400;        // ms of quiet before we send the clip
      // Barge-in needs a clearly higher bar than normal speech detection since it
      // runs while the agent's own voice is actively playing through the speakers,
      // plus a few consecutive frames above threshold before cutting the agent off.
      const BARGE_IN_THRESHOLD = 42;
      // ~400ms of sustained voice before we actually cut the agent off — a
      // quick backchannel ("haan", "acha", "okay") while he's mid-sentence is
      // usually just 1-2 short syllables and should NOT interrupt him; a real
      // interruption ("wait, hold on", an actual objection) sustains longer.
      const BARGE_IN_HOLD_FRAMES = 24;
      let bargeInFrames = 0;
      // Require a few consecutive frames above threshold before starting a
      // recording at all — a single keyboard click is typically a 1-frame
      // spike, real speech sustains for many frames.
      const SPEECH_ONSET_HOLD_FRAMES = 3;
      let speechOnsetFrames = 0;
      // Tracks actual voice-band energy across the WHOLE recording, not just
      // the instant it was triggered. A brief noise/AGC blip can cross
      // SPEECH_THRESHOLD for a moment and then sit near-silent for the rest
      // of the clip — that's exactly the weak/ambiguous audio Sarvam tends to
      // hallucinate plausible-sounding filler text for instead of returning
      // empty. Require the clip to have been *mostly* actually loud, not just
      // momentarily loud, before it's even sent to STT.
      let recordingEnergySum = 0;
      let recordingEnergyFrames = 0;
      let recordingLoudFrames = 0;

      const tick = () => {
        if (!vadActiveRef.current || !inCallRef.current) return;
        vadRafRef.current = requestAnimationFrame(tick);

        if (isMutedRef.current) {
          speechOnsetFrames = 0;
          bargeInFrames = 0;
          return;
        }

        analyser.getByteFrequencyData(dataArray);
        let bandSum = 0;
        for (let i = voiceBinLow; i <= voiceBinHigh; i++) bandSum += dataArray[i];
        const liveAvg = bandSum / (voiceBinHigh - voiceBinLow + 1);

        // While the agent is talking, only watch for a real barge-in — do not
        // start a normal VAD recording yet (that happens once we've cut the
        // agent off, on the very next tick).
        if (isSpeakingRef.current) {
          if (liveAvg > BARGE_IN_THRESHOLD) {
            bargeInFrames++;
            if (bargeInFrames >= BARGE_IN_HOLD_FRAMES) {
              bargeInFrames = 0;
              if (audioPlayerRef.current) {
                try { audioPlayerRef.current.pause(); } catch { /* ignore */ }
                audioPlayerRef.current = null;
              }
              if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
              }
              isSpeakingRef.current = false;
              setVolumeLevel(0);
              setInterrupted(true);
              setTimeout(() => setInterrupted(false), 2200);
              setVoiceState('listening');
            }
          } else {
            bargeInFrames = 0;
          }
          return;
        }

        // Agent has finished speaking but is still "thinking" about a previous
        // turn (LLM/tool calls in flight) — don't start capturing a new
        // utterance until that reply has actually come back and is playing.
        if (isThinkingRef.current) {
          speechOnsetFrames = 0;
          return;
        }

        const avg = liveAvg;

        if (vadRecordingRef.current) {
          recordingEnergySum += avg;
          recordingEnergyFrames++;
          if (avg > SPEECH_THRESHOLD) recordingLoudFrames++;
        }

        if (!vadRecordingRef.current) {
          if (avg > SPEECH_THRESHOLD) {
            speechOnsetFrames++;
          } else {
            speechOnsetFrames = 0;
          }
        }

        if (avg > SPEECH_THRESHOLD && !vadRecordingRef.current && speechOnsetFrames >= SPEECH_ONSET_HOLD_FRAMES) {
          speechOnsetFrames = 0;
          // Speech detected — start recording
          vadRecordingRef.current = true;
          recordingEnergySum = 0;
          recordingEnergyFrames = 0;
          recordingLoudFrames = 0;
          vadChunksRef.current = [];
          setIsRecordingSTT(true);
          setPartialSpeaker('customer');
          setPartialText('🎙 Listening...');
          const recordingStartedAt = Date.now();

          const recorder = mimeType
            ? new MediaRecorder(stream, { mimeType })
            : new MediaRecorder(stream);
          vadRecorderRef.current = recorder;

          recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) vadChunksRef.current.push(e.data);
          };

          // Hard safety cap: no matter what keeps the mic level up (echo of the
          // agent's own voice off laptop speakers, background noise, a bug),
          // never let a recording run forever — force it to finalize.
          const MAX_RECORDING_MS = 8000;
          const forceStopTimer = setTimeout(() => {
            if (vadRecorderRef.current === recorder && recorder.state === 'recording') {
              recorder.stop();
            }
          }, MAX_RECORDING_MS);

          recorder.onstop = async () => {
            clearTimeout(forceStopTimer);
            vadRecordingRef.current = false;
            setIsRecordingSTT(false);

            if (isMutedRef.current) {
              // Muted mid-capture — discard, do not transcribe.
              setPartialText('');
              return;
            }

            const actualMime = recorder.mimeType || mimeType || 'audio/webm';
            const blob = new Blob(vadChunksRef.current, { type: actualMime });
            const durationMs = Date.now() - recordingStartedAt;
            // Ignore short bursts (mic clicks, breaths, background noise, and
            // quick backchannels like "haan"/"acha"/"okay") — these get
            // mis-transcribed by Sarvam as garbage or random-script syllables
            // and wrongly get treated as real customer turns.
            const MIN_SPEECH_MS = 700;
            if (blob.size < 200 || durationMs < MIN_SPEECH_MS) { setPartialText(''); return; }

            // Sustained-energy gate: the clip must have actually been loud for
            // most of its length, not just at the moment it triggered. Catches
            // the "one noise blip then silence" clips that would otherwise get
            // sent to Sarvam, which hallucinates plausible filler text ("okay,
            // so...") for weak/ambiguous audio instead of returning empty.
            const avgClipEnergy = recordingEnergyFrames > 0 ? recordingEnergySum / recordingEnergyFrames : 0;
            const loudFraction = recordingEnergyFrames > 0 ? recordingLoudFrames / recordingEnergyFrames : 0;
            if (avgClipEnergy < SPEECH_THRESHOLD * 0.85 || loudFraction < 0.35) {
              setPartialText('');
              return;
            }

            setVoiceState('thinking');
            setPartialText('Transcribing...');

            try {
              const fd = new FormData();
              fd.append('file', blob, `recording.${fileExt}`);
              const res = await fetch(`${BACKEND_HTTP_URL}/api/stt`, { method: 'POST', body: fd });
              const json = await res.json();
              const transcript = (json.transcript ?? '').trim();
              const languageCode: string = json.language_code || '';
              const confidence: number = typeof json.confidence === 'number' ? json.confidence : 1.0;
              setPartialText('');
              // A handful of characters is almost never a real sentence — it's
              // Sarvam guessing at a stray sound (a single foreign-script
              // syllable, a breath). And when Sarvam's auto-detect lands on a
              // language nobody in this demo is actually speaking (Bengali,
              // Tamil, Kannada, ...) that's it guessing wildly at a weak/
              // ambiguous clip, not real speech — this demo is English/Hindi
              // only. A low confidence score is Sarvam itself saying it isn't
              // sure. Any of these signals means: treat it as "didn't catch
              // it" rather than sending it to the LLM as a real customer turn.
              const hasEnoughContent = transcript.replace(/[^\p{L}\p{N}]/gu, '').length >= 4;
              const isExpectedLanguage = !languageCode || /^(en|hi)-/i.test(languageCode);
              const isConfident = confidence >= 0.5;
              if (transcript && hasEnoughContent && isExpectedLanguage && isConfident) {
                processCustomerTurn(transcript);
              } else {
                setPartialText("Didn't catch that — speak clearly and try again.");
                setTimeout(() => setPartialText(''), 2500);
                setVoiceState('listening');
              }
            } catch {
              setPartialText('');
              setVoiceState('listening');
            }
          };

          recorder.start(100);
        }

        if (vadRecordingRef.current && avg <= SPEECH_THRESHOLD) {
          // Silence — start/reset the cut-off timer
          if (!vadSilenceTimerRef.current) {
            vadSilenceTimerRef.current = setTimeout(() => {
              vadSilenceTimerRef.current = null;
              if (vadRecordingRef.current && vadRecorderRef.current?.state === 'recording') {
                vadRecorderRef.current.stop();
              }
            }, SILENCE_MS);
          }
        } else if (vadRecordingRef.current && avg > SPEECH_THRESHOLD) {
          // Still speaking — cancel any pending silence timer
          if (vadSilenceTimerRef.current) {
            clearTimeout(vadSilenceTimerRef.current);
            vadSilenceTimerRef.current = null;
          }
        }
      };

      vadRafRef.current = requestAnimationFrame(tick);
      console.log('[VAD] Hands-free voice detection active');
    } catch (err) {
      console.warn('[VAD] Could not start:', err);
    }
  }, [processCustomerTurn]);

  const stopVAD = useCallback(() => {
    vadActiveRef.current = false;
    if (vadRafRef.current) { cancelAnimationFrame(vadRafRef.current); vadRafRef.current = null; }
    if (vadSilenceTimerRef.current) { clearTimeout(vadSilenceTimerRef.current); vadSilenceTimerRef.current = null; }
    if (vadRecorderRef.current?.state === 'recording') { try { vadRecorderRef.current.stop(); } catch { /* ignore */ } }
    vadRecordingRef.current = false;
    if (analyserRef.current) { try { analyserRef.current.disconnect(); } catch { /* ignore */ } analyserRef.current = null; }
    if (audioCtxRef.current) { try { audioCtxRef.current.close(); } catch { /* ignore */ } audioCtxRef.current = null; }
    if (vadStreamRef.current) { vadStreamRef.current.getTracks().forEach((t) => t.stop()); vadStreamRef.current = null; }
  }, []);

  // 3. End Call Session & Retrieve Post-Call Deal Memo
  const endCall = async () => {
    inCallRef.current = false;
    isSpeakingRef.current = false;
    isThinkingRef.current = false;
    queuedTurnRef.current = null;
    setHasQueuedTurn(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }

    if (audioPlayerRef.current) {
      try {
        audioPlayerRef.current.pause();
      } catch {
        // ignore
      }
      audioPlayerRef.current = null;
    }

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    try {
      const channel = currentChannelRef.current || 'sales_demo';
      const res = await fetch(`${BACKEND_HTTP_URL}/api/session/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation_id: channel })
      });
      const data = await res.json();
      if (data.deal_memo) {
        setDealMemo(data.deal_memo);
      }
    } catch (err) {
      console.error('[Failed to fetch deal memo]', err);
    }

    // Stop VAD
    stopVAD();

    if (volumeIntervalRef.current) {
      clearInterval(volumeIntervalRef.current);
    }
    if (localTrackRef.current) {
      localTrackRef.current.close();
      localTrackRef.current = null;
    }
    if (clientRef.current) {
      try {
        await clientRef.current.leave();
      } catch (e) {
        console.warn('Error leaving Agora client', e);
      }
      clientRef.current = null;
    }

    setInCall(false);
    setVoiceState('idle');
    setVolumeLevel(0);
  };

  const toggleMute = () => {
    const newMute = !isMuted;
    isMutedRef.current = newMute;
    if (localTrackRef.current) {
      localTrackRef.current.setEnabled(!newMute);
    }
    if (newMute) {
      // Immediately kill anything currently being captured/recorded.
      if (vadRecorderRef.current?.state === 'recording') {
        try { vadRecorderRef.current.stop(); } catch { /* ignore */ }
      }
      setIsRecordingSTT(false);
      setPartialText('');
    }
    setIsMuted(newMute);
  };

  const toggleRecordingSTT = async () => {
    // STOP: if already recording, stop and process
    if (isRecordingSTT) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        try { mediaRecorderRef.current.stop(); } catch { /* ignore */ }
      }
      setIsRecordingSTT(false);
      return;
    }

    try {
      if (typeof window === 'undefined' || !navigator.mediaDevices) return;

      // Request mic — prompt browser permission dialog if not yet granted
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 16000 }
        });
      } catch (permErr) {
        console.warn('[Mic permission denied or unavailable]', permErr);
        setPartialSpeaker('customer');
        setPartialText('Microphone access denied — check browser permissions.');
        setTimeout(() => setPartialText(''), 3000);
        return;
      }

      // Pick the best MIME type the browser actually supports
      const preferredMimes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/ogg',
        'audio/mp4',
      ];
      const mimeType = preferredMimes.find((m) => MediaRecorder.isTypeSupported(m)) || '';
      const fileExt = mimeType.includes('ogg') ? 'ogg' : mimeType.includes('mp4') ? 'mp4' : 'webm';

      audioChunksRef.current = [];
      const mediaRecorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        setIsRecordingSTT(false);
        stream.getTracks().forEach((t) => t.stop());

        const actualMime = mediaRecorder.mimeType || mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: actualMime });

        // Need at least ~200 bytes — even a very short utterance will be >500
        if (audioBlob.size < 200) {
          setVoiceState('listening');
          setPartialText('');
          return;
        }

        setVoiceState('thinking');
        setPartialSpeaker('customer');
        setPartialText('Transcribing...');

        try {
          const formData = new FormData();
          // Filename extension must match the actual audio format for Sarvam to parse it
          formData.append('file', audioBlob, `recording.${fileExt}`);

          const res = await fetch(`${BACKEND_HTTP_URL}/api/stt`, {
            method: 'POST',
            body: formData
          });

          const data = await res.json();
          const transcript = (data.transcript ?? '').trim();
          setPartialText('');

          if (transcript) {
            processCustomerTurn(transcript);
          } else {
            // STT returned empty — tell user to retry
            setPartialSpeaker('customer');
            setPartialText("Couldn't hear clearly — try again or use the text box below.");
            setTimeout(() => setPartialText(''), 3500);
            setVoiceState('listening');
          }
        } catch (err) {
          console.error('[Sarvam STT network error]', err);
          setPartialText('STT request failed — using text input instead.');
          setTimeout(() => setPartialText(''), 3000);
          setVoiceState('listening');
        }
      };

      // Collect chunks every 100ms for smoother data (250ms caused large gaps)
      mediaRecorder.start(100);
      setIsRecordingSTT(true);
      setVoiceState('listening');
      setPartialSpeaker('customer');
      setPartialText('🎙 Listening — release button to send...');
    } catch (e) {
      console.warn('[Failed to start MediaRecorder]', e);
      setPartialText('Could not start recording. Use the text box instead.');
      setTimeout(() => setPartialText(''), 3000);
    }
  };

  const sendManualMessage = (text: string) => {
    processCustomerTurn(text);
  };

  return {
    inCall,
    connecting,
    voiceState,
    volumeLevel,
    interrupted,
    isMuted,
    isRecordingSTT,
    toggleRecordingSTT,
    hasQueuedTurn,
    sessionState,
    transcripts,
    partialText,
    partialSpeaker,
    toasts,
    dealMemo,
    startCall,
    endCall,
    toggleMute,
    dismissToast,
    sendManualMessage,
    closeDealMemo: () => setDealMemo(null)
  };
}
