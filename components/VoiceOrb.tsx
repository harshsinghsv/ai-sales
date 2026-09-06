'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { VoiceState } from '@/lib/types';
import type { AgentState } from '@/components/ui/elevenlabs-orb';
import { ElevenLabsWaveform } from '@/components/ui/elevenlabs-waveform';

const ElevenLabsOrb = dynamic(
  () => import('@/components/ui/elevenlabs-orb').then((mod) => mod.Orb),
  {
    ssr: false,
      loading: () => (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-[#eeeafe] border border-[#4928fd]/20 animate-pulse" />
        </div>
      )
  }
);

import { Mic } from 'lucide-react';

interface VoiceOrbProps {
  state: VoiceState;
  volume: number;
  interrupted?: boolean;
  isRecordingSTT?: boolean;
  toggleRecordingSTT?: () => void;
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({
  state,
  volume,
  interrupted,
  isRecordingSTT,
}) => {
  // Warm terracotta & amber ramps tuned for Claude Enterprise theme
  let agentState: AgentState = null;
  let colors: [string, string] = ['#F5D0C5', '#D97757'];
  let glow = 'rgba(217,119,87,0.24)';

  if (state === 'listening') {
    agentState = 'listening';
    colors = ['#93C5FD', '#2563EB'];
    glow = 'rgba(37,99,235,0.28)';
  } else if (state === 'thinking') {
    agentState = 'thinking';
    colors = ['#FDE68A', '#D97706'];
    glow = 'rgba(217,119,6,0.30)';
  } else if (state === 'speaking') {
    agentState = 'talking';
    colors = ['#F97316', '#D97757'];
    glow = 'rgba(217,119,87,0.36)';
  }

  const manualInput = state === 'listening' ? Math.min(1, Math.max(0, volume * 1.6)) : 0;
  const manualOutput = state === 'speaking' ? Math.min(1, Math.max(0, volume * 1.6)) : 0;

  // One line of truth for what's happening, instead of two overlapping pills
  const statusLabel = isRecordingSTT
    ? 'Capturing your voice...'
    : state === 'listening'
    ? 'Listening — speak naturally'
    : state === 'thinking'
    ? 'Evaluating terms...'
    : state === 'speaking'
    ? 'Aarav is speaking'
    : 'Ready';

  const dotColor =
    state === 'listening' ? '#79d45e' : state === 'thinking' ? '#ffaf68' : state === 'speaking' ? '#4928fd' : 'rgba(27,29,30,0.3)';

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Orb — sits directly on the page, just a soft ambient glow behind it
          for depth. No heavy dark housing; the orb graphic is its own disc. */}
      <div className="relative size-44 sm:size-52">
        <div
          className="absolute inset-[-10px] rounded-full transition-all duration-500 blur-2xl opacity-70"
          style={{ background: glow }}
        />
        <div className="relative h-full w-full overflow-hidden rounded-full">
          <ElevenLabsOrb
            agentState={agentState}
            colors={colors}
            volumeMode="manual"
            manualInput={manualInput}
            manualOutput={manualOutput}
            className="w-full h-full"
          />
        </div>

        {interrupted && (
          <div className="absolute inset-0 rounded-full border-2 border-[#d1293d]/60 animate-ping pointer-events-none" />
        )}
      </div>

      {/* Live Audio Waveform */}
      <div className="mt-5 h-7 flex items-center justify-center">
        <ElevenLabsWaveform
          active={state === 'listening' || state === 'speaking'}
          volume={volume}
          barColor={
            state === 'listening'
              ? '#4F46E5'
              : state === 'speaking'
              ? '#6D28D9'
              : state === 'thinking'
              ? '#F59E0B'
              : '#A78BFA'
          }
          barCount={24}
          height={28}
        />
      </div>

      {/* Single consolidated status line */}
      <div
        className={`mt-4 flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
          isRecordingSTT ? 'bg-[#e4f6df] text-[#2f7a1d]' : 'bg-[rgba(27,29,30,0.04)] text-[#1b1d1e]/70'
        }`}
      >
        {isRecordingSTT ? (
          <Mic className="size-3.5 text-[#2f7a1d] animate-pulse" />
        ) : (
          <span className="size-1.5 rounded-full" style={{ backgroundColor: dotColor }} />
        )}
        <span>{statusLabel}</span>
        {interrupted && <span className="text-[11px] text-[#a81f30]">· cut off</span>}
        {isRecordingSTT && (
          <span className="flex gap-0.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="inline-block w-0.5 h-2.5 bg-[#2f7a1d] rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </span>
        )}
      </div>
    </div>
  );
};
