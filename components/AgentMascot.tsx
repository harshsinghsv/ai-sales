'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon, Bot, Mic, ShieldAlert, Sparkles, CheckCircle2, TrendingUp, Zap, Radio, Volume2 } from 'lucide-react';

export type MascotMode = 'negotiating' | 'listening' | 'margin_defense' | 'closing';

interface AgentMascotProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  initialMode?: MascotMode;
  interactive?: boolean;
  showControls?: boolean;
  className?: string;
  onModeChange?: (mode: MascotMode) => void;
}

const MODE_CONFIGS: Record<MascotMode, {
  label: string;
  badge: string;
  desc: string;
  color: string;
  textColor: string;
  bgLight: string;
  metric: string;
  metricLabel: string;
  icon: LucideIcon;
}> = {
  negotiating: {
    label: 'Live Negotiation',
    badge: 'Real-Time Voice',
    desc: 'Analyzing buyer acoustic signals and objection patterns at 420ms latency.',
    color: '#D97757',
    textColor: 'text-[#D97757]',
    bgLight: 'bg-[#FAF0EC]',
    metric: '420ms',
    metricLabel: 'RTC Turn Latency',
    icon: Mic,
  },
  margin_defense: {
    label: 'Margin Defense',
    badge: 'Policy Enforced',
    desc: 'Guarding 18% floor while offering high-leverage multi-year concession tradeoffs.',
    color: '#B45309',
    textColor: 'text-amber-700',
    bgLight: 'bg-amber-50',
    metric: '18.0%',
    metricLabel: 'Max Concession Floor',
    icon: ShieldAlert,
  },
  closing: {
    label: 'Auto-Close & Sync',
    badge: 'Deal Locked',
    desc: 'Contract terms locked, HubSpot deal updated, Google Calendar invite sent to VP.',
    color: '#15803D',
    textColor: 'text-emerald-700',
    bgLight: 'bg-emerald-50',
    metric: '100%',
    metricLabel: 'HubSpot & GCal Synced',
    icon: CheckCircle2,
  },
  listening: {
    label: 'Active Listening',
    badge: 'Deepgram Nova-3',
    desc: 'Capturing enterprise nuances, seat requirements, and procurement timelines.',
    color: '#4F46E5',
    textColor: 'text-indigo-600',
    bgLight: 'bg-indigo-50',
    metric: '99.4%',
    metricLabel: 'STT Accuracy',
    icon: Radio,
  },
};

export const AgentMascot: React.FC<AgentMascotProps> = ({
  size = 'hero',
  initialMode = 'negotiating',
  interactive = true,
  showControls = true,
  className = '',
  onModeChange,
}) => {
  const [currentMode, setCurrentMode] = useState<MascotMode>(initialMode);
  const [isHovered, setIsHovered] = useState(false);

  const activeConfig = MODE_CONFIGS[currentMode];

  const handleSelectMode = (mode: MascotMode) => {
    setCurrentMode(mode);
    onModeChange?.(mode);
  };

  const imageSrc = currentMode === 'margin_defense' || currentMode === 'closing'
    ? '/images/agent_mascot_deal.jpg'
    : '/images/agent_mascot_hero.jpg';

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Visual Canvas Container */}
      <div 
        className="relative flex items-center justify-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Soft Ambient Glow Halo behind Mascot */}
        <motion.div
          animate={{
            scale: isHovered ? [1.05, 1.15, 1.05] : [1, 1.08, 1],
            opacity: isHovered ? [0.6, 0.8, 0.6] : [0.35, 0.5, 0.35],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 rounded-full blur-3xl pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${activeConfig.color}40 0%, #D9775715 50%, transparent 70%)`,
          }}
        />

        {/* Audio-Reactive Concentric Rings (Pulse Waves) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              animate={{
                scale: [1, 1.35 + ring * 0.18, 1.7 + ring * 0.25],
                opacity: [0.45, 0.2, 0],
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                delay: ring * 0.8,
                ease: 'easeOut',
              }}
              className="absolute w-64 h-64 rounded-full border"
              style={{
                borderColor: `${activeConfig.color}50`,
              }}
            />
          ))}
        </div>

        {/* Floating Physics Mascot Card */}
        <motion.div
          animate={{
            y: isHovered ? [0, -14, 0] : [0, -10, 0],
            rotate: isHovered ? [0, 1.2, -1.2, 0] : [0, 0.6, -0.6, 0],
          }}
          transition={{
            duration: isHovered ? 3.5 : 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          whileHover={{ scale: 1.02 }}
          className="relative z-10 w-72 h-72 sm:w-84 sm:h-84 md:w-96 md:h-96 rounded-3xl p-3 bg-[#FAF9F5]/90 backdrop-blur-md border border-[#E8E6DC] shadow-2xl shadow-[#141413]/10 overflow-hidden flex flex-col items-center justify-center cursor-pointer transition-shadow hover:shadow-[#D97757]/20"
        >
          {/* Inner Image Container with Rounded Bevel */}
          <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#F5F4ED] to-[#ECEAE0]">
            <Image
              src={imageSrc}
              alt="Agora AI Sales Agent Mascot"
              fill
              priority
              className="object-cover transition-transform duration-700 ease-out hover:scale-105"
              sizes="(max-width: 768px) 320px, 420px"
            />

            {/* Subtle Gradient Vignette at bottom of image */}
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#141413]/70 via-[#141413]/25 to-transparent" />

            {/* Live Audio Indicator Pill on top-left of image */}
            <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#141413]/85 text-white backdrop-blur-md border border-white/15 text-[11px] font-medium shadow-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D97757] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D97757]" />
              </span>
              <span className="font-mono tracking-wider">AGENT EMILY</span>
            </div>

            {/* Latency / Status Badge on top-right */}
            <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 text-[#141413] backdrop-blur-md border border-[#E8E6DC] text-[11px] font-medium shadow-sm">
              <Zap className="w-3 h-3 text-[#D97757]" />
              <span className="font-mono">{activeConfig.metric}</span>
            </div>

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-1.5">
                <activeConfig.icon className="w-4 h-4 text-[#FAF0EC]" />
                <span className="font-medium tracking-wide">{activeConfig.label}</span>
              </div>
              <span className="text-[10px] font-mono opacity-80 uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded backdrop-blur-xs">
                {activeConfig.badge}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Orbiting Telemetry Badges (Floating physics chips) */}
        <motion.div
          animate={{
            y: [0, -8, 0],
            x: [0, 4, 0],
          }}
          transition={{
            duration: 4.2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.4,
          }}
          className="absolute -top-4 -left-6 sm:-left-12 z-20 hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#FAF9F5] border border-[#E8E6DC] shadow-lg shadow-[#141413]/5"
        >
          <div className="w-8 h-8 rounded-xl bg-[#FAF0EC] flex items-center justify-center text-[#D97757]">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B6966]">Speech Engine</div>
            <div className="text-xs font-semibold text-[#141413]">MiniMax Turbo · 2.8</div>
          </div>
        </motion.div>

        <motion.div
          animate={{
            y: [0, 8, 0],
            x: [0, -4, 0],
          }}
          transition={{
            duration: 4.8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1.1,
          }}
          className="absolute -bottom-4 -right-6 sm:-right-10 z-20 hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#FAF9F5] border border-[#E8E6DC] shadow-lg shadow-[#141413]/5"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B6966]">Margin Preserved</div>
            <div className="text-xs font-semibold text-[#141413]">82.4% ARR Protected</div>
          </div>
        </motion.div>
      </div>

      {/* Interactive Mode Controls (Tab Bar) */}
      {showControls && (
        <div className="mt-8 w-full max-w-md">
          <div className="p-1 rounded-2xl bg-[#F5F4ED] border border-[#E8E6DC] grid grid-cols-2 sm:grid-cols-4 gap-1">
            {(Object.keys(MODE_CONFIGS) as MascotMode[]).map((mode) => {
              const cfg = MODE_CONFIGS[mode];
              const isSelected = currentMode === mode;
              const Icon = cfg.icon;
              return (
                <button
                  key={mode}
                  onClick={() => handleSelectMode(mode)}
                  className={`flex flex-col items-center py-2 px-2 rounded-xl text-xs transition-all relative ${
                    isSelected
                      ? 'bg-white text-[#141413] shadow-sm font-semibold'
                      : 'text-[#6B6966] hover:text-[#141413] hover:bg-white/50 font-normal'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 mb-1 ${isSelected ? cfg.textColor : 'text-[#8C8984]'}`} />
                  <span className="text-[11px] truncate w-full text-center leading-tight">
                    {mode === 'margin_defense' ? 'Defense' : mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </span>
                  {isSelected && (
                    <motion.div
                      layoutId="activePill"
                      className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                      style={{ backgroundColor: cfg.color }}
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Mode Explanation Blurb */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMode}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="mt-3 text-center px-4"
            >
              <p className="text-xs text-[#6B6966] leading-relaxed">
                <span className="font-semibold text-[#141413]">{activeConfig.label}:</span>{' '}
                {activeConfig.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

/**
 * Compact Mascot Avatar for badges, navbars, and buttons
 */
export const AgentMascotMini: React.FC<{
  size?: number;
  className?: string;
  pulse?: boolean;
}> = ({ size = 36, className = '', pulse = true }) => {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {pulse && (
        <span className="absolute inset-0 rounded-full bg-[#D97757]/30 animate-ping opacity-60 pointer-events-none" />
      )}
      <div 
        className="relative rounded-full overflow-hidden border-2 border-[#FAF9F5] shadow-sm bg-[#FAF0EC]"
        style={{ width: size, height: size }}
      >
        <Image
          src="/images/agent_mascot_hero.jpg"
          alt="Agent Emily Avatar"
          width={size}
          height={size}
          className="object-cover"
        />
      </div>
      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
    </div>
  );
};
