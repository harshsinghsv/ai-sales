'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  PhoneCall,
  Volume2,
  VolumeX,
  Users,
  Clock,
  ShieldCheck,
  X,
} from 'lucide-react';
import { EscalationRequest } from '@/lib/types';
import { BACKEND_HTTP_URL, BACKEND_WS_URL } from '@/lib/agora';
import { cn } from '@/lib/utils';

const URGENCY_STYLE: Record<
  EscalationRequest['urgency'],
  { label: string; classes: string; dot: string }
> = {
  high: {
    label: 'High urgency',
    classes: 'bg-[#fce9eb] text-[#a81f30] border-[#d1293d]/25',
    dot: 'bg-[#d1293d]',
  },
  medium: {
    label: 'Medium urgency',
    classes: 'bg-[#ffefda] text-[#b3661d] border-[#ffaf68]/40',
    dot: 'bg-[#ffaf68]',
  },
  low: {
    label: 'Low urgency',
    classes: 'bg-[rgba(27,29,30,0.05)] text-[rgba(27,29,30,0.6)] border-[rgba(27,29,30,0.1)]',
    dot: 'bg-[rgba(27,29,30,0.3)]',
  },
};

function timeAgo(timestamp: number): string {
  const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

/** Plays a short two-tone ring using the Web Audio API — no audio asset to ship. */
function playRingTone() {
  try {
    const AudioContextCtor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextCtor) return;
    const ctx = new AudioContextCtor();
    const now = ctx.currentTime;

    [0, 0.28].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.18, now + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.24);
    });

    setTimeout(() => ctx.close().catch(() => {}), 700);
  } catch {
    // Web Audio unavailable — silently skip the tone, the visual pulse still works.
  }
}

/**
 * Sales Team Console — the "phone" a human specialist watches.
 *
 * When the AI agent calls escalate_to_human (buyer asked for a person, or a
 * negotiation deadlocked), this page rings: a live card appears with the
 * buyer's context, and "Join Live Call" takes the specialist straight into
 * the buyer's existing Agora RTC channel at /human/[channel] — a real voice
 * takeover, not a callback queue.
 *
 * Two data sources, deliberately: GET /api/escalations hydrates whatever was
 * already pending when this page opened; the /ws HUMAN_HANDOFF_REQUESTED
 * broadcast delivers anything that happens while it's open. Either alone
 * would miss escalations that fire before the specialist has this tab open.
 */
export default function SalesTeamConsolePage() {
  const router = useRouter();
  const [escalations, setEscalations] = useState<EscalationRequest[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const soundEnabledRef = useRef(false);
  const knownIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const upsert = useCallback((incoming: EscalationRequest, isNew: boolean) => {
    setEscalations((prev) => {
      const withoutThis = prev.filter(
        (e) => e.conversation_id !== incoming.conversation_id,
      );
      if (incoming.resolved) return withoutThis;
      return [incoming, ...withoutThis];
    });
    if (isNew && soundEnabledRef.current) {
      playRingTone();
    }
  }, []);

  // Hydrate whatever was already pending before this console opened.
  useEffect(() => {
    let cancelled = false;
    fetch(`${BACKEND_HTTP_URL}/api/escalations`)
      .then((r) => (r.ok ? r.json() : { escalations: [] }))
      .then((data) => {
        if (cancelled) return;
        const items = (data.escalations ?? []) as EscalationRequest[];
        items.forEach((e) => knownIdsRef.current.add(e.conversation_id));
        setEscalations(items);
      })
      .catch(() => {
        // Backend offline — the console still works once /ws connects.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Live ring for anything that fires while this console is open.
  useEffect(() => {
    let ws: WebSocket | null = null;
    let cancelled = false;

    try {
      ws = new WebSocket(BACKEND_WS_URL);
      ws.onopen = () => !cancelled && setConnected(true);
      ws.onclose = () => !cancelled && setConnected(false);
      ws.onerror = () => !cancelled && setConnected(false);
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type !== 'HUMAN_HANDOFF_REQUESTED') return;
          const entry = data as EscalationRequest;
          const isNew = !knownIdsRef.current.has(entry.conversation_id);
          knownIdsRef.current.add(entry.conversation_id);
          upsert(entry, isNew);
        } catch {
          // ignore malformed frames
        }
      };
    } catch {
      // Backend offline at mount — the hydration fetch above already handles
      // the initial empty state.
    }

    return () => {
      cancelled = true;
      try {
        ws?.close();
      } catch {
        // ignore
      }
    };
  }, [upsert]);

  const joinCall = (escalation: EscalationRequest) => {
    // Fire-and-forget: drop this off other specialists' queues, but don't
    // block navigation on it — the specialist should never wait on a network
    // call to pick up a live buyer.
    fetch(
      `${BACKEND_HTTP_URL}/api/escalations/${encodeURIComponent(
        escalation.conversation_id,
      )}/resolve`,
      { method: 'POST' },
    ).catch(() => {});
    setEscalations((prev) =>
      prev.filter((e) => e.conversation_id !== escalation.conversation_id),
    );
    router.push(`/human/${escalation.conversation_id}`);
  };

  const dismiss = (escalation: EscalationRequest) => {
    fetch(
      `${BACKEND_HTTP_URL}/api/escalations/${encodeURIComponent(
        escalation.conversation_id,
      )}/resolve`,
      { method: 'POST' },
    ).catch(() => {});
    setEscalations((prev) =>
      prev.filter((e) => e.conversation_id !== escalation.conversation_id),
    );
  };

  return (
    <main className="min-h-screen bg-[#f6f6f7] text-[#1b1d1e]">
      <header className="bg-white border-b border-[rgba(27,29,30,0.1)] px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="size-8 rounded-full bg-[#4928fd] text-white flex items-center justify-center shrink-0">
            <Users className="size-4" aria-hidden />
          </span>
          <div className="min-w-0">
            <h1 className="text-sm font-semibold truncate">
              Sales Team Console
            </h1>
            <p className="text-[11px] text-[rgba(27,29,30,0.55)] truncate flex items-center gap-1.5">
              <span
                className={cn(
                  'size-1.5 rounded-full',
                  connected ? 'bg-[#2f7a1d] animate-softpulse' : 'bg-[rgba(27,29,30,0.3)]',
                )}
                aria-hidden
              />
              {connected ? 'Listening for escalations' : 'Reconnecting…'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setSoundEnabled((v) => !v)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-colors cursor-pointer',
            soundEnabled
              ? 'bg-[#eeeafe] text-[#4928fd] border-[#4928fd]/25'
              : 'bg-[rgba(27,29,30,0.05)] text-[rgba(27,29,30,0.6)] border-[rgba(27,29,30,0.1)]',
          )}
          title={
            soundEnabled
              ? 'Sound alerts on'
              : 'Enable sound alerts (browsers require a click before audio can play)'
          }
        >
          {soundEnabled ? (
            <Volume2 className="size-3.5" aria-hidden />
          ) : (
            <VolumeX className="size-3.5" aria-hidden />
          )}
          {soundEnabled ? 'Sound on' : 'Enable sound'}
        </button>
      </header>

      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        {loading ? (
          <div className="space-y-3">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="rounded-2xl bg-white border border-[rgba(27,29,30,0.1)] p-5"
              >
                <div className="skeleton h-4 w-1/3 rounded-full mb-3" />
                <div className="skeleton h-3 w-2/3 rounded-full" />
              </div>
            ))}
          </div>
        ) : escalations.length === 0 ? (
          <div className="rounded-2xl bg-white border border-[rgba(27,29,30,0.1)] p-10 flex flex-col items-center text-center gap-3">
            <span className="size-12 rounded-full bg-[rgba(27,29,30,0.05)] flex items-center justify-center">
              <ShieldCheck className="size-5 text-[rgba(27,29,30,0.4)]" aria-hidden />
            </span>
            <div>
              <h2 className="text-sm font-semibold">No calls waiting</h2>
              <p className="text-xs text-[rgba(27,29,30,0.55)] mt-1 max-w-sm">
                When a buyer on a live Emily call asks for a human, or a
                negotiation deadlocks, it rings here — with full deal context
                — and one click drops you into their live Agora RTC channel.
              </p>
            </div>
          </div>
        ) : (
          <ul className="space-y-3">
            {escalations.map((escalation) => {
              const urgency = URGENCY_STYLE[escalation.urgency] ?? URGENCY_STYLE.medium;
              return (
                <li
                  key={escalation.conversation_id}
                  className="rounded-2xl bg-white border-2 border-[#4928fd]/30 shadow-[0_4px_20px_rgba(73,40,253,0.12)] p-5 relative overflow-hidden"
                >
                  <span
                    className="absolute inset-x-0 top-0 h-0.5 bg-[#4928fd] animate-softpulse"
                    aria-hidden
                  />
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border',
                            urgency.classes,
                          )}
                        >
                          <span
                            className={cn('size-1.5 rounded-full animate-softpulse', urgency.dot)}
                            aria-hidden
                          />
                          {urgency.label}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] text-[rgba(27,29,30,0.45)]">
                          <Clock className="size-3" aria-hidden />
                          {timeAgo(escalation.timestamp)}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold mt-2">
                        {escalation.customer_name} · {escalation.company}
                      </h3>
                      <p className="text-xs text-[rgba(27,29,30,0.6)] mt-1">
                        {escalation.seat_count ?? '—'} seats · {escalation.tier_name}
                      </p>
                      <p className="text-xs text-[rgba(27,29,30,0.75)] mt-2 leading-relaxed">
                        &ldquo;{escalation.reason}&rdquo;
                      </p>
                    </div>

                    <div className="flex flex-col items-stretch gap-2 shrink-0 w-full sm:w-auto">
                      <button
                        onClick={() => joinCall(escalation)}
                        className="flex items-center justify-center gap-2 pl-3.5 pr-4 py-2 rounded-full text-xs font-semibold bg-[#4928fd] hover:bg-[#3b1ee6] text-white transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <PhoneCall className="size-3.5" aria-hidden />
                        Join Live Call
                      </button>
                      <button
                        onClick={() => dismiss(escalation)}
                        className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium text-[rgba(27,29,30,0.5)] hover:text-[rgba(27,29,30,0.8)] hover:bg-[rgba(27,29,30,0.05)] transition-colors cursor-pointer"
                      >
                        <X className="size-3" aria-hidden />
                        Dismiss
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
