'use client';

import React, { useState, useEffect } from 'react';
import { useAgoraVoice } from '@/hooks/useAgoraVoice';
import { VoiceOrb } from '@/components/VoiceOrb';
import { DealCockpitPanel } from '@/components/DealCockpitPanel';
import { LiveTranscript } from '@/components/LiveTranscript';
import { IntegrationToasts } from '@/components/IntegrationToasts';
import { VoiceState } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  PhoneOff,
  Mic,
  MicOff,
  Send,
  RotateCcw,
  Command,
  CornerDownLeft,
  ChevronDown,
  Radio,
} from 'lucide-react';

interface SalesCockpitProps {
  onReturnToLanding: () => void;
  voiceHook: ReturnType<typeof useAgoraVoice>;
}

const STATE_PILL: Record<VoiceState, { label: string; classes: string; dot: string }> = {
  idle: {
    label: 'Ready',
    classes: 'bg-[rgba(27,29,30,0.05)] text-[rgba(27,29,30,0.6)] border-[rgba(27,29,30,0.1)]',
    dot: 'bg-[rgba(27,29,30,0.3)]',
  },
  listening: {
    label: 'Listening',
    classes: 'bg-[#e2f0ff] text-[#1d6fb3] border-[#70b5ff]/40',
    dot: 'bg-[#1d6fb3] animate-softpulse',
  },
  thinking: {
    label: 'Evaluating terms',
    classes: 'bg-[#ffefda] text-[#b3661d] border-[#ffaf68]/40',
    dot: 'bg-[#ffaf68] animate-softpulse',
  },
  speaking: {
    label: 'Aarav is speaking',
    classes: 'bg-[#eeeafe] text-[#4928fd] border-[#4928fd]/25',
    dot: 'bg-[#4928fd] animate-softpulse',
  },
};

export const SalesCockpit: React.FC<SalesCockpitProps> = ({ onReturnToLanding, voiceHook }) => {
  const {
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
    endCall,
    toggleMute,
    dismissToast,
    sendManualMessage,
  } = voiceHook;

  const [callDuration, setCallDuration] = useState<number>(0);
  const [customInput, setCustomInput] = useState<string>('');

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (inCall) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [inCall]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      sendManualMessage(customInput.trim());
      setCustomInput('');
    }
  };

  const busy = voiceState === 'thinking' || voiceState === 'speaking';
  const pill = STATE_PILL[voiceState];
  const buyerName = sessionState.customer.name;

  const demoScenarios = [
    { label: "80 Seats Expansion", text: "Actually, our engineering org is growing rapidly. We need it for 80 developers, not 20." },
    { label: "Jira Difference?", text: "Wait, how are you different from Jira? Our team has been using Jira for 4 years." },
    { label: "25% Discount Request", text: "Your pricing is a bit high. Can you give us a 25% discount on the 80 seats?" },
    { label: "Book Architecture Demo", text: "That sounds reasonable. Can we book an enterprise solution architecture demo for tomorrow?" },
    { label: "Request Human Lead", text: "I would like to speak directly with an enterprise sales executive or manager." }
  ];

  return (
    <div className="min-h-screen bg-white text-[#1b1d1e] flex flex-col font-sans selection:bg-[#4928fd] selection:text-white relative overflow-hidden">
      {/* Ambient background */}
      <div aria-hidden className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-140px] left-1/2 -translate-x-1/2 w-[1000px] h-[420px] bg-gradient-to-b from-[#eeeafe] via-[#e2f0ff]/60 to-transparent blur-3xl opacity-80" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      </div>

      {/* Top Bar Navigation */}
      <header className="border-b border-[rgba(27,29,30,0.08)] bg-white/85 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-6 h-14 flex items-center justify-between shadow-sm relative">
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-7 rounded-lg bg-[#4928fd] flex items-center justify-center shadow-sm shrink-0">
            <span className="text-white font-black text-xs tracking-tighter">TS</span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold text-xs tracking-tight text-[#1b1d1e] truncate">
              TeamSync
            </span>
            <span className="text-[rgba(27,29,30,0.25)] shrink-0">/</span>
            <span className="text-xs text-[rgba(27,29,30,0.55)] font-medium truncate hidden min-[400px]:block">
              Sales Negotiation Agent
            </span>
          </div>
          <div
            aria-live="polite"
            className="flex items-center gap-2 ml-1 sm:ml-3 pl-2 sm:pl-3 border-l border-[rgba(27,29,30,0.1)] shrink-0"
          >
            <span aria-hidden className={cn('size-2 rounded-full', pill.dot)} />
            <span className="text-xs font-semibold text-[#1b1d1e] tabular-nums">
              {formatTime(callDuration)}
            </span>
            <span className="text-[11px] text-[rgba(27,29,30,0.4)] hidden md:inline">
              · {connecting ? 'Connecting…' : pill.label} · Agora RTC Live
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleMute}
            title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            aria-pressed={isMuted}
            className={cn(
              'size-9 rounded-full flex items-center justify-center transition-all cursor-pointer',
              isMuted
                ? 'bg-[#fce9eb] text-[#a81f30] border border-[#d1293d]/25'
                : 'bg-[rgba(27,29,30,0.05)] hover:bg-[rgba(27,29,30,0.08)] text-[#1b1d1e]/70'
            )}
          >
            {isMuted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
          </button>

          <button
            onClick={onReturnToLanding}
            title="Return to site"
            aria-label="Return to site"
            className="size-9 rounded-full flex items-center justify-center bg-[rgba(27,29,30,0.05)] hover:bg-[rgba(27,29,30,0.08)] text-[#1b1d1e]/70 transition-all cursor-pointer"
          >
            <RotateCcw className="size-4" />
          </button>

          <button
            onClick={endCall}
            className="ml-1 flex items-center gap-2 pl-3.5 pr-4 py-2 rounded-full text-xs font-semibold border border-[#d1293d] bg-[#d1293d] hover:bg-[#a81f30] hover:border-[#a81f30] text-white transition-colors cursor-pointer"
          >
            <PhoneOff className="size-3.5" aria-hidden />
            <span>End Call</span>
          </button>
        </div>
      </header>

      {/* Main Cockpit Grid */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 relative z-10 items-stretch">
        {/* Left Column: Voice Presence & Conversation Dock (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col min-h-0">
          <div className="rounded-2xl bg-white border border-[rgba(27,29,30,0.1)] p-5 sm:p-6 flex flex-col shadow-[0_1px_3px_rgba(27,29,30,0.06)] h-full">
            {/* Agent Header Tag */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-[rgba(27,29,30,0.08)]">
              <div className="flex items-center gap-2 min-w-0">
                <span aria-hidden className={cn('size-2 rounded-full shrink-0', pill.dot)} />
                <span className="text-xs font-semibold text-[#1b1d1e] truncate">
                  Aarav · Enterprise Sales Lead
                </span>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#eeeafe] border border-[#4928fd]/20 text-[#4928fd] shrink-0">
                Sarvam Multilingual
              </span>
            </div>

            {/* Center: Voice Orb */}
            <div className="py-5 sm:py-6 flex flex-col items-center justify-center my-auto gap-3">
              {connecting ? (
                <div className="flex flex-col items-center gap-4 py-4" aria-label="Connecting to call">
                  <div className="size-44 sm:size-52 rounded-full skeleton" />
                  <div className="space-y-2 w-44">
                    <div className="skeleton h-3 w-full rounded-full" />
                    <div className="skeleton h-3 w-2/3 mx-auto rounded-full" />
                  </div>
                  <span className="text-xs font-medium text-[rgba(27,29,30,0.55)]">
                    Connecting to Agora RTC…
                  </span>
                </div>
              ) : (
                <>
                  <VoiceOrb
                    state={voiceState}
                    volume={volumeLevel}
                    interrupted={interrupted}
                    isRecordingSTT={isRecordingSTT}
                  />
                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    <span
                      aria-live="polite"
                      className={cn(
                        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border',
                        pill.classes
                      )}
                    >
                      <span aria-hidden className={cn('size-1.5 rounded-full', pill.dot)} />
                      {pill.label}
                    </span>
                    <button
                      type="button"
                      onClick={toggleRecordingSTT}
                      aria-pressed={isRecordingSTT}
                      title={isRecordingSTT ? 'Stop push-to-talk capture' : 'Start push-to-talk capture'}
                      className={cn(
                        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border transition-colors cursor-pointer',
                        isRecordingSTT
                          ? 'bg-[#e4f6df] text-[#2f7a1d] border-[#79d45e]/40'
                          : 'bg-white text-[rgba(27,29,30,0.6)] border-[rgba(27,29,30,0.12)] hover:border-[#4928fd]/40 hover:text-[#4928fd]'
                      )}
                    >
                      <Radio className="size-3" aria-hidden />
                      {isRecordingSTT ? 'Capturing…' : 'Push to talk'}
                    </button>
                    {hasQueuedTurn && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#ffefda] text-[#b3661d] border border-[#ffaf68]/40">
                        <span aria-hidden className="size-1.5 rounded-full bg-[#ffaf68] animate-softpulse" />
                        Queued…
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Bottom: Demo controls + Input */}
            <div className="space-y-3 pt-4 border-t border-[rgba(27,29,30,0.08)]">
              <details className="group rounded-xl border border-[rgba(27,29,30,0.08)] bg-[rgba(27,29,30,0.02)] open:bg-white transition-colors">
                <summary className="flex items-center justify-between gap-2 px-3.5 py-2.5 cursor-pointer list-none">
                  <span className="text-[10px] uppercase tracking-wider text-[rgba(27,29,30,0.5)] font-semibold flex items-center gap-1.5">
                    <Command className="size-3 text-[rgba(27,29,30,0.4)]" aria-hidden />
                    Demo controls
                    <span className="px-1.5 py-px rounded-full bg-[rgba(27,29,30,0.06)] text-[rgba(27,29,30,0.55)] tabular-nums">
                      {demoScenarios.length}
                    </span>
                  </span>
                  <ChevronDown
                    className="size-3.5 text-[rgba(27,29,30,0.4)] transition-transform group-open:rotate-180"
                    aria-hidden
                  />
                </summary>
                <div className="px-3.5 pb-3.5 flex flex-wrap gap-1.5">
                  {demoScenarios.map((scen, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendManualMessage(scen.text)}
                      disabled={busy}
                      title={scen.text}
                      className="px-3 py-1.5 rounded-full text-[11px] font-medium bg-[rgba(27,29,30,0.04)] hover:bg-[#eeeafe] text-[#1b1d1e]/75 hover:text-[#4928fd] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      {scen.label}
                    </button>
                  ))}
                </div>
              </details>

              {/* Floating Input Bar */}
              <form onSubmit={handleSendCustom} className="flex items-center gap-2 pt-1">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Ask Aarav or negotiate deal terms…"
                    aria-label="Message Aarav"
                    className="w-full pl-4 pr-9 py-2.5 rounded-full bg-[rgba(27,29,30,0.04)] border border-transparent text-xs text-[#1b1d1e] placeholder:text-[rgba(27,29,30,0.4)] focus:outline-none focus:bg-white focus:border-[#4928fd]/40 font-sans transition-all"
                  />
                  <CornerDownLeft
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 size-3.5 text-[rgba(27,29,30,0.3)] pointer-events-none"
                    aria-hidden
                  />
                </div>
                <button
                  type="submit"
                  disabled={!customInput.trim()}
                  aria-label="Send message"
                  className="size-9 rounded-full bg-[#4928fd] hover:bg-[#3b1ee6] disabled:opacity-30 disabled:hover:bg-[#4928fd] disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                >
                  <Send className="size-3.5" aria-hidden />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column: Deal Operations Cockpit & Live Turn Transcript (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-5 min-h-0">
          <DealCockpitPanel session={sessionState} />

          <div className="flex-1 min-h-[340px] flex flex-col">
            <LiveTranscript
              turns={transcripts}
              partialText={partialText}
              partialSpeaker={partialSpeaker}
              buyerName={buyerName}
              thinking={voiceState === 'thinking'}
            />
          </div>
        </div>
      </main>

      {/* Integration Toasts (Anchored bottom-right) */}
      <IntegrationToasts toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};
