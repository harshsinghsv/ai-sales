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
}) => {
  // Harmonic Claude palettes: Primary (uColor1) and Secondary (uColor2)
  let agentState: AgentState = null;
  let colors: [string, string] = ['#D97757', '#F2A385'];
  let glow = 'rgba(217,119,87,0.18)';

  if (state === 'listening') {
    agentState = 'listening';
    colors = ['#788C5D', '#D97757'];
    glow = 'rgba(120,140,93,0.22)';
  } else if (state === 'thinking') {
    agentState = 'thinking';
    colors = ['#D97757', '#C96442'];
    glow = 'rgba(217,119,87,0.25)';
  } else if (state === 'speaking') {
    agentState = 'talking';
    colors = ['#D97757', '#F2A385'];
    glow = 'rgba(217,119,87,0.32)';
  }

  const manualInput = state === 'listening' ? Math.min(1, Math.max(0, volume * 1.6)) : 0;
  const manualOutput = state === 'speaking' ? Math.min(1, Math.max(0, volume * 1.6)) : 0;

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Orb — sits directly on the page, with subtle Claude terracotta glow */}
      <div className="relative size-44 sm:size-52">
        <div
          className="absolute inset-[-12px] rounded-full transition-all duration-700 blur-2xl opacity-70 pointer-events-none"
          style={{ background: glow }}
        />
        <div className="relative h-full w-full overflow-hidden rounded-full border border-[#E8E6DC] bg-[#FAF9F5] shadow-sm">
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
          <div className="absolute inset-0 rounded-full border-2 border-[#D97757]/60 animate-ping pointer-events-none" />
        )}
      </div>

      {/* Live Audio Waveform in Claude Terracotta / Sage */}
      <div className="mt-4 h-6 flex items-center justify-center">
        <ElevenLabsWaveform
          active={state === 'listening' || state === 'speaking'}
          volume={volume}
          barColor={
            state === 'listening'
              ? '#788C5D'
              : state === 'speaking'
              ? '#D97757'
              : state === 'thinking'
              ? '#C96442'
              : '#D97757'
          }
          barCount={20}
          height={24}
        />
      </div>
    </div>
  );
};
