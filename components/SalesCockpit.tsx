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
    classes: 'bg-[#FAF9F5] text-[#5E5D59] border-[#E8E6DC]',
    dot: 'bg-[#87867F]',
  },
  listening: {
    label: 'Listening',
    classes: 'bg-[#FAF0EC] text-[#D97757] border-[#D97757]/30',
    dot: 'bg-[#788C5D] animate-pulse',
  },
  thinking: {
    label: 'Evaluating terms',
    classes: 'bg-[#F5F4ED] text-[#87867F] border-[#E8E6DC]',
    dot: 'bg-[#D97757] animate-pulse',
  },
  speaking: {
    label: 'Emily is speaking',
    classes: 'bg-[#141413] text-[#FAF9F5] border-[#141413]',
    dot: 'bg-[#D97757] animate-pulse',
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
    { label: "100 Seats Inquiry", text: "We have an engineering and product org of 100 people looking to deploy Claude Enterprise with Opus 5. How does pricing scale?" },
    { label: "1M Context & GitHub", text: "How does the 1,000,000-token context window in Claude Opus 5 and native GitHub integration work across our private repositories?" },
    { label: "Security & Zero-Training", text: "What are your enterprise security and privacy guarantees? Can you assure us our proprietary code is never used for training?" },
    { label: "Opus 5 vs Copilot", text: "We are evaluating Claude Opus 5 versus Microsoft Copilot and ChatGPT Enterprise. Why should our engineering team standardize on Claude?" },
    { label: "20% Discount Request", text: "We want to roll out Claude Opus 5 enterprise-wide. If we sign a 2-year annual commitment, can we get a 20% discount?" },
    { label: "Book Solutions Demo", text: "That sounds very compelling. Can we book a deep-dive architecture demo with an Anthropic solutions architect tomorrow?" },
    { label: "Request Human Lead", text: "I would like to speak directly with an enterprise sales director or account lead." }
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#141413] flex flex-col font-sans selection:bg-[#D97757] selection:text-white relative overflow-hidden">
      {/* Calm ambient background (No blueprint grid pattern) */}
      <div aria-hidden className="fixed inset-0 pointer-events-none z-0 bg-[#FAF9F5]">
        <div className="absolute top-[-180px] left-1/2 -translate-x-1/2 w-[1100px] h-[440px] bg-gradient-to-b from-[#F2ECE4]/70 via-[#FAF9F5] to-[#FAF9F5] blur-3xl opacity-80" />
      </div>

      {/* Top Bar Navigation */}
      <header className="border-b border-[#E8E6DC] bg-[#FAF9F5]/90 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-6 h-14 flex items-center justify-between relative">
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-7 rounded-md bg-[#FAF0EC] border border-[#D97757]/30 flex items-center justify-center shrink-0">
            <span className="text-[#D97757] text-sm font-bold font-serif-anthropic">✻</span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-serif-anthropic font-medium text-sm tracking-tight text-[#141413] truncate">
              Claude Enterprise
            </span>
            <span className="text-[#D5D3CA] shrink-0">/</span>
            <span className="text-xs text-[#5E5D59] font-normal truncate hidden min-[420px]:block">
              Executive Session · Emily AI
            </span>
          </div>
          <div
            aria-live="polite"
            className="flex items-center gap-2 ml-1 sm:ml-3 pl-2 sm:pl-3 border-l border-[#E8E6DC] shrink-0"
          >
            <span aria-hidden className={cn('size-1.5 rounded-full', pill.dot)} />
            <span className="text-xs font-mono font-medium text-[#141413] tabular-nums">
              {formatTime(callDuration)}
            </span>
            <span className="text-[11px] text-[#5E5D59] hidden md:inline">
              · {connecting ? 'Connecting…' : pill.label}
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
              'size-8 rounded-lg flex items-center justify-center transition-all cursor-pointer border',
              isMuted
                ? 'bg-[#FAF0EC] text-[#D97757] border-[#D97757]/40'
                : 'bg-white hover:bg-[#F5F4ED] text-[#141413] border-[#E8E6DC]'
            )}
          >
            {isMuted ? <MicOff className="size-3.5" /> : <Mic className="size-3.5" />}
          </button>

          <button
            onClick={onReturnToLanding}
            title="Return to site"
            aria-label="Return to site"
            className="size-8 rounded-lg flex items-center justify-center bg-white hover:bg-[#F5F4ED] text-[#141413] border border-[#E8E6DC] transition-all cursor-pointer"
          >
            <RotateCcw className="size-3.5" />
          </button>

          <button
            onClick={endCall}
            className="ml-1 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#141413] hover:bg-[#30302E] text-white transition-colors cursor-pointer"
          >
            <PhoneOff className="size-3" aria-hidden />
            <span>End session</span>
          </button>
        </div>
      </header>

      {/* Main Cockpit Grid */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 relative z-10 items-stretch">
        {/* Left Column: Voice Presence & Conversation Dock (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col min-h-0">
          <div className="rounded-2xl bg-white border border-[#E8E6DC] p-5 sm:p-6 flex flex-col shadow-sm h-full">
            {/* Agent Header Tag */}
            <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-[#E8E6DC]">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src="/agora-avatar.gif"
                  alt="Emily"
                  className="size-7 rounded-full object-cover shrink-0 border border-[#D97757]/30 shadow-xs"
                />
                <div className="flex flex-col min-w-0">
                  <span className="font-serif-anthropic text-sm font-medium text-[#141413] leading-tight truncate">
                    Emily
                  </span>
                  <span className="text-[11px] text-[#5E5D59] font-normal leading-tight truncate">
                    Enterprise AI Specialist · Solutions Lead
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-medium tracking-wide px-2.5 py-1 rounded-full bg-[#FAF0EC] text-[#D97757] border border-[#D97757]/25 shrink-0">
                Claude Opus 5
              </span>
            </div>

            {/* Center: Voice Orb */}
            <div className="py-6 sm:py-7 flex flex-col items-center justify-center my-auto gap-3">
              {connecting ? (
                <div className="flex flex-col items-center gap-4 py-4" aria-label="Connecting to call">
                  <div className="size-48 sm:size-56 rounded-full skeleton" />
                  <div className="space-y-2 w-44">
                    <div className="skeleton h-3 w-full rounded-full" />
                    <div className="skeleton h-3 w-2/3 mx-auto rounded-full" />
                  </div>
                  <span className="text-xs font-medium text-[#5E5D59]">
                    Connecting to Agora RTC…
                  </span>
                </div>
              ) : (
                <>
                  <VoiceOrb
                    state={voiceState}
                    volume={volumeLevel}
                    interrupted={interrupted}
                  />
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <div
                      aria-live="polite"
                      className={cn(
                        'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all shadow-sm',
                        isRecordingSTT
                          ? 'bg-[#FAF0EC] text-[#D97757] border-[#D97757]/40'
                          : pill.classes
                      )}
                    >
                      <span aria-hidden className={cn('size-1.5 rounded-full', isRecordingSTT ? 'bg-[#D97757] animate-ping' : pill.dot)} />
                      <span>{isRecordingSTT ? 'Capturing speech…' : pill.label}</span>
                    </div>

                    <button
                      type="button"
                      onClick={toggleRecordingSTT}
                      aria-pressed={isRecordingSTT}
                      title={isRecordingSTT ? 'Release to send speech' : 'Click to speak'}
                      className={cn(
                        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer shadow-sm',
                        isRecordingSTT
                          ? 'bg-[#D97757] text-white border-[#D97757]'
                          : 'bg-white text-[#5E5D59] border-[#E8E6DC] hover:border-[#D5D3CA] hover:text-[#141413]'
                      )}
                    >
                      <Radio className="size-3" aria-hidden />
                      <span>{isRecordingSTT ? 'Release' : 'Push to talk'}</span>
                    </button>
                    {hasQueuedTurn && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#FAF0EC] text-[#D97757] border border-[#D97757]/30">
                        <span aria-hidden className="size-1.5 rounded-full bg-[#D97757] animate-pulse" />
                        Queued…
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Bottom: Prompt Inquiries + Input */}
            <div className="space-y-3 pt-3.5 border-t border-[#E8E6DC]">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-0.5">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#87867F] flex items-center gap-1.5">
                    <Command className="size-3 text-[#87867F]" aria-hidden />
                    Suggested Inquiries
                  </span>
                  <span className="text-[10px] text-[#87867F]">
                    Click to ask Emily
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {demoScenarios.slice(0, 4).map((scen, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendManualMessage(scen.text)}
                      disabled={busy}
                      title={scen.text}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[#FAF9F5] border border-[#E8E6DC] hover:bg-[#FAF0EC] text-[#5E5D59] hover:text-[#D97757] hover:border-[#D97757]/40 disabled:opacity-40 transition-all cursor-pointer"
                    >
                      {scen.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input Bar */}
              <form onSubmit={handleSendCustom} className="flex items-center gap-2 pt-0.5">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Ask Emily or negotiate deal terms…"
                    aria-label="Message Emily"
                    className="w-full pl-3.5 pr-8 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#D5D3CA] text-xs sm:text-sm text-[#141413] placeholder:text-[#87867F] focus:outline-none focus:bg-white focus:border-[#141413] focus:ring-1 focus:ring-[#141413] font-sans transition-all"
                  />
                  <CornerDownLeft
                    className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-[#87867F] pointer-events-none"
                    aria-hidden
                  />
                </div>
                <button
                  type="submit"
                  disabled={!customInput.trim()}
                  aria-label="Send message"
                  className="size-9 rounded-xl bg-[#141413] hover:bg-[#30302E] disabled:opacity-30 disabled:hover:bg-[#141413] disabled:cursor-not-allowed text-white flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-sm"
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

          <div className="flex-1 min-h-[440px] flex flex-col">
            <LiveTranscript
              turns={transcripts}
              partialText={partialText}
              partialSpeaker={partialSpeaker}
              buyerName={buyerName}
              thinking={voiceState === 'thinking'}
              onSelectPrompt={(text) => sendManualMessage(text)}
            />
          </div>
        </div>
      </main>

      {/* Integration Toasts (Anchored bottom-right) */}
      <IntegrationToasts toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};
