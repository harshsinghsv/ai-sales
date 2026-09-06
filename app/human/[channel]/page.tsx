'use client';

import React, { use } from 'react';
import { PhoneCall, PhoneOff, Mic, MicOff, Bot, ShieldCheck } from 'lucide-react';
import { useHumanHandoff } from '@/hooks/useHumanHandoff';
import { LiveTranscript } from '@/components/LiveTranscript';
import { DealCockpitPanel } from '@/components/DealCockpitPanel';
import { cn } from '@/lib/utils';

/**
 * Human specialist takeover console.
 *
 * Opened from the escalation alert. The specialist joins the buyer's live
 * Agora RTC channel — the same channel Emily is in — so the buyer experiences
 * a seamless handoff mid-call, with the full prior transcript and current deal
 * terms already on screen.
 */
export default function HumanHandoffPage({
  params,
}: {
  params: Promise<{ channel: string }>;
}) {
  const { channel } = use(params);
  const {
    joined,
    joining,
    error,
    isMuted,
    agentPresent,
    transcripts,
    partialText,
    partialSpeaker,
    session,
    join,
    leave,
    toggleMute,
  } = useHumanHandoff(channel);

  const buyerName = session?.customer.name || 'Buyer';

  return (
    <main className="min-h-screen bg-[#f6f6f7] text-[#1b1d1e] flex flex-col">
      <header className="bg-white border-b border-[rgba(27,29,30,0.1)] px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="size-8 rounded-full bg-[#4928fd] text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="size-4" aria-hidden />
          </span>
          <div className="min-w-0">
            <h1 className="text-sm font-semibold truncate">
              Human Specialist Console
            </h1>
            <p className="text-[11px] text-[rgba(27,29,30,0.55)] truncate">
              Channel {channel} · {buyerName}
              {session?.customer.company ? ` · ${session.customer.company}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {agentPresent && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#eeeafe] border border-[#4928fd]/20 text-[#4928fd]">
              <Bot className="size-3" aria-hidden />
              Emily in channel
            </span>
          )}

          {joined && (
            <button
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
              className={cn(
                'size-9 rounded-full flex items-center justify-center transition-all cursor-pointer',
                isMuted
                  ? 'bg-[#fce9eb] text-[#a81f30] border border-[#d1293d]/25'
                  : 'bg-[rgba(27,29,30,0.05)] hover:bg-[rgba(27,29,30,0.08)] text-[#1b1d1e]/70',
              )}
            >
              {isMuted ? (
                <MicOff className="size-4" />
              ) : (
                <Mic className="size-4" />
              )}
            </button>
          )}

          {joined ? (
            <button
              onClick={leave}
              className="flex items-center gap-2 pl-3.5 pr-4 py-2 rounded-full text-xs font-semibold border border-[#d1293d] bg-[#d1293d] hover:bg-[#a81f30] text-white transition-colors cursor-pointer"
            >
              <PhoneOff className="size-3.5" aria-hidden />
              Leave call
            </button>
          ) : (
            <button
              onClick={join}
              disabled={joining}
              className="flex items-center gap-2 pl-3.5 pr-4 py-2 rounded-full text-xs font-semibold bg-[#4928fd] hover:bg-[#3b1ee6] disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors cursor-pointer"
            >
              <PhoneCall className="size-3.5" aria-hidden />
              {joining ? 'Joining…' : 'Join live call'}
            </button>
          )}
        </div>
      </header>

      {error && (
        <div
          role="alert"
          className="mx-4 sm:mx-6 mt-4 rounded-xl border border-[#d1293d]/25 bg-[#fce9eb] px-4 py-3 text-xs font-medium text-[#a81f30]"
        >
          {error}
        </div>
      )}

      <div className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
        <div className="lg:col-span-5 flex flex-col gap-4">
          {session ? (
            <DealCockpitPanel session={session} />
          ) : (
            <div className="rounded-2xl bg-white border border-[rgba(27,29,30,0.1)] p-6">
              <div className="skeleton h-4 w-2/3 rounded-full mb-3" />
              <div className="skeleton h-3 w-full rounded-full mb-2" />
              <div className="skeleton h-3 w-4/5 rounded-full" />
              <p className="mt-4 text-[11px] text-[rgba(27,29,30,0.5)]">
                Loading deal context…
              </p>
            </div>
          )}

          {!joined && !joining && (
            <div className="rounded-2xl bg-white border border-[rgba(27,29,30,0.1)] p-5">
              <h2 className="text-sm font-semibold mb-1.5">
                You are about to take over a live call
              </h2>
              <p className="text-xs text-[rgba(27,29,30,0.6)] leading-relaxed">
                Joining puts you into the buyer&apos;s existing Agora RTC
                channel. They stay on the same call — they will simply start
                hearing you. Read the transcript on the right before you speak.
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-7 flex flex-col min-h-[420px]">
          <LiveTranscript
            turns={transcripts}
            partialText={partialText}
            partialSpeaker={partialSpeaker}
            buyerName={buyerName}
            thinking={false}
          />
        </div>
      </div>
    </main>
  );
}
