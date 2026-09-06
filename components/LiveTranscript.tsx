'use client';

import React, { useEffect, useRef, useState } from 'react';
import { TranscriptTurn } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  ArrowDown,
  Check,
  Copy,
  MessageSquare,
  Scissors,
  Sparkles,
} from 'lucide-react';

interface LiveTranscriptProps {
  turns: TranscriptTurn[];
  partialText?: string;
  partialSpeaker?: 'customer' | 'agent';
  buyerName?: string | null;
  thinking?: boolean;
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0].slice(0, 1) + parts[parts.length - 1].slice(0, 1)).toUpperCase();
}

const TurnCopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? 'Copied' : 'Copy turn'}
      aria-label={copied ? 'Copied to clipboard' : 'Copy turn text'}
      className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity p-1 rounded-md text-[rgba(27,29,30,0.4)] hover:text-[#1b1d1e] hover:bg-[rgba(27,29,30,0.06)] cursor-pointer"
    >
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
    </button>
  );
};

export const LiveTranscript: React.FC<LiveTranscriptProps> = ({
  turns,
  partialText,
  partialSpeaker,
  buyerName,
  thinking = false,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollEndRef = useRef<HTMLDivElement | null>(null);
  const [showJumpLatest, setShowJumpLatest] = useState(false);
  const displayBuyer = buyerName?.trim() ? buyerName.trim() : 'Buyer';

  useEffect(() => {
    if (!showJumpLatest) {
      scrollEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [turns, partialText, showJumpLatest]);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowJumpLatest(distanceFromBottom > 120);
  };

  const jumpToLatest = () => {
    setShowJumpLatest(false);
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  const showThinkingSkeleton = thinking && !partialText;

  return (
    <div className="relative flex flex-col h-full min-h-0 bg-white border border-[#E8E6DC] rounded-2xl shadow-sm">
      {/* Transcript Header */}
      <div className="flex items-center justify-between gap-3 px-5 pt-4 pb-3.5 border-b border-[#E8E6DC]">
        <div className="flex items-center gap-2.5 min-w-0">
          <MessageSquare className="size-3.5 text-[#D97757] shrink-0" aria-hidden />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#141413] truncate">
            Live transcript
          </h3>
          {turns.length > 0 && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-[#FAF0EC] text-[#D97757] font-mono tabular-nums shrink-0">
              {turns.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#5E5D59] shrink-0">
          <span aria-hidden className="size-1.5 rounded-full bg-[#788C5D] animate-pulse" />
          <span>Deepgram STT · Hinglish</span>
        </div>
      </div>

      {/* Scrolling Chat Flow */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        aria-live="polite"
        aria-label="Conversation transcript"
        className="flex-1 min-h-[280px] max-h-[420px] overflow-y-auto px-5 py-4 space-y-4 custom-scrollbar"
      >
        {turns.length === 0 && !partialText && !showThinkingSkeleton && (
          <div className="h-full min-h-52 flex flex-col items-center justify-center text-center py-12">
            <div className="size-9 rounded-lg bg-[#FAF0EC] border border-[#D97757]/25 flex items-center justify-center mb-2.5">
              <span className="text-base text-[#D97757] font-serif-anthropic">✻</span>
            </div>
            <p className="text-xs font-medium text-[#141413]">Listening for buyer voice…</p>
            <p className="text-[11px] text-[#5E5D59] mt-1 max-w-64 leading-relaxed">
              Speak in English or Hindi, or select an evaluation scenario to begin.
            </p>
          </div>
        )}

        {turns.map((turn) => {
          const isAgent = turn.speaker === 'agent';
          const speakerName = isAgent ? 'Emily' : displayBuyer;
          return (
            <div key={turn.id} className="group flex items-start gap-2.5">
              <div
                aria-hidden
                className={cn(
                  'size-6 rounded-md flex items-center justify-center text-[10px] font-medium shrink-0 mt-0.5 border',
                  isAgent
                    ? 'bg-[#FAF0EC] text-[#D97757] border-[#D97757]/30'
                    : 'bg-[#F0EDE5] text-[#5E5D59] border-[#E8E6DC]'
                )}
              >
                {isAgent ? '✻' : initials(speakerName)}
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2 px-0.5">
                  <span className="text-[11px] font-medium text-[#141413] truncate">
                    {speakerName}
                    <span className="ml-1.5 font-normal text-[#87867F]">
                      {isAgent ? '· Solutions Lead' : '· Buyer'}
                    </span>
                  </span>
                  <span className="flex items-center gap-1 shrink-0">
                    <span className="text-[10px] font-mono text-[#87867F] tabular-nums">
                      {formatTime(turn.timestamp)}
                    </span>
                    <TurnCopyButton text={turn.text} />
                  </span>
                </div>

                <div
                  className={cn(
                    'p-3.5 rounded-xl leading-relaxed text-[13px] sm:text-[13.5px] transition-all',
                    isAgent
                      ? 'bg-[#FAF9F5] border border-[#E8E6DC] text-[#141413]'
                      : 'bg-white border border-[#E8E6DC] text-[#141413]'
                  )}
                >
                  <p className="whitespace-pre-wrap">{turn.text}</p>
                  {turn.interrupted && (
                    <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-[#D97757]/20 text-[10px] text-[#D97757]">
                      <Scissors className="size-3 text-[#D97757]" aria-hidden />
                      <span>Turn cut off by buyer (Agora live barge-in)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Thinking skeleton */}
        {showThinkingSkeleton && (
          <div className="flex items-start gap-2.5" aria-label="Agent is thinking">
            <div className="size-6 rounded-md bg-[#FAF0EC] border border-[#D97757]/30 shrink-0 mt-0.5 flex items-center justify-center text-[10px] font-bold text-[#D97757]">
              ✻
            </div>
            <div className="flex-1 space-y-2">
              <div className="skeleton h-12 rounded-xl bg-[#FAF9F5] border border-[#E8E6DC]" />
              <div className="skeleton h-3 w-24 rounded-full bg-[#E8E6DC]" />
            </div>
          </div>
        )}

        {/* Live Streaming Speech Preview */}
        {partialText && (
          <div className="flex items-start gap-2.5">
            <div
              aria-hidden
              className="size-6 rounded-md bg-[#FAF9F5] border border-[#E8E6DC] shrink-0 mt-0.5 flex items-center justify-center text-[10px] font-medium text-[#5E5D59]"
            >
              {partialSpeaker === 'agent' ? '✻' : initials(displayBuyer)}
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
              <div className="flex items-center justify-between px-0.5">
                <span className="text-[11px] font-medium text-[#87867F]">
                  {partialSpeaker === 'agent' ? 'Emily (streaming…)' : `${displayBuyer} (streaming…)`}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-[#788C5D] font-medium">
                  <span aria-hidden className="size-1.5 rounded-full bg-[#788C5D] animate-pulse" />
                  transcribing
                </span>
              </div>
              <div className="p-3.5 rounded-xl border border-dashed border-[#D5D3CA] bg-[#FAF9F5] text-[#141413] italic text-[13px] animate-pulse">
                {partialText}
                <span aria-hidden className="not-italic text-[#D97757]"> ▍</span>
              </div>
            </div>
          </div>
        )}

        <div ref={scrollEndRef} />
      </div>

      {/* Jump to latest */}
      {showJumpLatest && (
        <button
          type="button"
          onClick={jumpToLatest}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium bg-[#141413] text-white shadow-lg hover:bg-[#30302E] transition-colors cursor-pointer"
        >
          <ArrowDown className="size-3" aria-hidden />
          Jump to latest
        </button>
      )}
    </div>
  );
};
