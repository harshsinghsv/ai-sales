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
  let glow = 'rgba(217,119,87,0.22)';

  if (state === 'listening') {
    agentState = 'listening';
    colors = ['#788C5D', '#D97757'];
    glow = 'rgba(120,140,93,0.25)';
  } else if (state === 'thinking') {
    agentState = 'thinking';
    colors = ['#D97757', '#C96442'];
    glow = 'rgba(217,119,87,0.28)';
  } else if (state === 'speaking') {
    agentState = 'talking';
    colors = ['#D97757', '#F5BA9E'];
    glow = 'rgba(217,119,87,0.38)';
  }

  const manualInput = state === 'listening' ? Math.min(1, Math.max(0, volume * 1.6)) : 0;
  const manualOutput = state === 'speaking' ? Math.min(1, Math.max(0, volume * 1.6)) : 0;
  const isAudioActive = (state === 'listening' || state === 'speaking') && volume > 0.03;

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Floating 3D Celestial Orb (Seamless without plastic frame border) */}
      <div className="relative size-48 sm:size-56 flex items-center justify-center">
        <div
          className="absolute inset-[-14px] rounded-full transition-all duration-700 blur-3xl opacity-65 pointer-events-none scale-105"
          style={{ background: glow }}
        />
        <div className="relative h-full w-full overflow-hidden rounded-full drop-shadow-[0_16px_32px_rgba(217,119,87,0.18)]">
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

      {/* Audio Waveform: Only displays active dancing bars, avoiding static dots */}
      <div className="mt-3 h-6 flex items-center justify-center">
        {isAudioActive ? (
          <ElevenLabsWaveform
            active={true}
            volume={volume}
            barColor={state === 'listening' ? '#788C5D' : '#D97757'}
            barCount={20}
            height={20}
          />
        ) : (
          <div className="h-1 w-12 rounded-full bg-[#E8E6DC]/80 transition-opacity opacity-60" />
        )}
      </div>
    </div>
  );
};
