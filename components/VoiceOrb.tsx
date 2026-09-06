'use client';

import React from 'react';
import { VoiceState } from '@/lib/types';
import { ElevenLabsWaveform } from '@/components/ui/elevenlabs-waveform';

interface VoiceOrbProps {
  state: VoiceState;
  volume: number;
  interrupted?: boolean;
  isRecordingSTT?: boolean;
  toggleRecordingSTT?: () => void;
  avatarSrc?: string;
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({
  state,
  volume,
  interrupted,
  avatarSrc = '/agora-avatar.gif',
}) => {
  // Harmonic dynamic state styling
  let glow = 'rgba(217,119,87,0.22)';
  let ringBorder = 'border-[#D97757]/40';
  let badgeColor = 'bg-[#D97757]';
  let badgeLabel = 'Emily (Agora Sales Agent)';

  if (state === 'listening') {
    glow = 'rgba(120,140,93,0.35)';
    ringBorder = 'border-emerald-500/50';
    badgeColor = 'bg-emerald-500';
    badgeLabel = 'Listening to buyer...';
  } else if (state === 'thinking') {
    glow = 'rgba(217,119,87,0.38)';
    ringBorder = 'border-[#D97757]/60';
    badgeColor = 'bg-amber-500';
    badgeLabel = 'Evaluating objection...';
  } else if (state === 'speaking') {
    glow = 'rgba(217,119,87,0.5)';
    ringBorder = 'border-[#D97757]';
    badgeColor = 'bg-[#D97757]';
    badgeLabel = 'Speaking (Emily)';
  }

  const isAudioActive = (state === 'listening' || state === 'speaking') && volume > 0.03;

  // Reactivity: subtle audio scale when speaking
  const audioScale = state === 'speaking' ? 1 + Math.min(0.06, volume * 0.12) : 1;

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* 3D Animated Sales Agent Avatar Portal */}
      <div className="relative size-52 sm:size-60 flex items-center justify-center">
        {/* Dynamic ambient color glow behind avatar */}
        <div
          className="absolute inset-[-18px] rounded-full transition-all duration-700 blur-3xl opacity-75 pointer-events-none"
          style={{
            background: glow,
            transform: `scale(${1 + Math.min(0.1, volume * 0.2)})`,
          }}
        />

        {/* Outer active audio reactive halo ring */}
        <div
          className="absolute -inset-2 rounded-full pointer-events-none transition-all duration-200"
          style={{
            border:
              state === 'speaking'
                ? `2px solid rgba(217, 119, 87, ${Math.max(0.2, Math.min(0.8, volume * 2.5))})`
                : state === 'listening'
                ? '2px solid rgba(120, 140, 93, 0.4)'
                : '2px solid rgba(232, 230, 220, 0.5)',
            transform: `scale(${audioScale})`,
            boxShadow:
              state === 'speaking'
                ? `0 0 ${20 + volume * 30}px rgba(217, 119, 87, ${Math.min(0.6, volume * 2)})`
                : 'none',
          }}
        />

        {/* Circular Avatar Container with Smooth Gradient Backdrop */}
        <div
          className={`relative h-full w-full overflow-hidden rounded-full border-2 ${ringBorder} shadow-[0_20px_45px_rgba(217,119,87,0.22)] bg-gradient-to-b from-[#FAF0EC] via-[#F4E3DC] to-[#EBD5CA] flex items-center justify-center transition-transform duration-200`}
          style={{ transform: `scale(${audioScale})` }}
        >
          {/* Animated 3D Sales Agent GIF */}
          <img
            src={avatarSrc}
            alt="Emily - Agora Enterprise Sales Voice Agent"
            className="w-full h-full object-cover object-center select-none pointer-events-none scale-105 translate-y-1"
            loading="eager"
          />

          {/* Subtle glossy vignette ring overlay */}
          <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-black/10 pointer-events-none shadow-inner" />
        </div>

        {/* Status Indicator Pip at bottom right */}
        <div className="absolute bottom-2 right-2 z-10">
          <span
            className="flex h-4 w-4 relative"
            title={badgeLabel}
          >
            {state === 'speaking' && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D97757] opacity-75" />
            )}
            {state === 'listening' && (
              <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            )}
            <span
              className={`relative inline-flex rounded-full h-4 w-4 ${badgeColor} border-2 border-white shadow-sm`}
            />
          </span>
        </div>

        {/* Interrupted visual burst */}
        {interrupted && (
          <div className="absolute inset-0 rounded-full border-2 border-[#D97757]/80 animate-ping pointer-events-none" />
        )}
      </div>

      {/* Audio Waveform: Synchronized dancing bars */}
      <div className="mt-3 h-6 flex items-center justify-center">
        {isAudioActive ? (
          <ElevenLabsWaveform
            active={true}
            volume={volume}
            barColor={state === 'listening' ? '#788C5D' : '#D97757'}
            barCount={22}
            height={22}
          />
        ) : (
          <div className="h-1 w-12 rounded-full bg-[#E8E6DC]/80 transition-opacity opacity-60" />
        )}
      </div>
    </div>
  );
};

export default VoiceOrb;
