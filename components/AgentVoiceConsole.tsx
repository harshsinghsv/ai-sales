'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  Volume2,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Calendar,
  Database,
  ArrowRight,
  TrendingUp,
  Radio,
  Lock,
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface Scenario {
  id: string;
  title: string;
  badge: string;
  buyerQuote: string;
  buyerName: string;
  buyerRole: string;
  agentResponse: string;
  telemetry: {
    latency: string;
    listPrice: string;
    finalPrice: string;
    concession: string;
    marginStatus: string;
    crmAction: string;
  };
}

const SCENARIOS: Scenario[] = [
  {
    id: 'margin',
    title: 'Margin Defense',
    badge: 'Price Objection',
    buyerName: 'Tina (Razorpay)',
    buyerRole: 'VP Engineering',
    buyerQuote: 'We need 250 enterprise seats, but $75/seat is above our budget. Can you give us 25% off?',
    agentResponse: 'I understand budget constraints, Tina. I cannot do 25% while guaranteeing dedicated enterprise infrastructure, but if you commit to a 24-month term, my deal engine unlocks a 12% concession at $66/seat. That saves your team $27,000 annually.',
    telemetry: {
      latency: '418ms',
      listPrice: '$225,000 / yr',
      finalPrice: '$198,000 / yr',
      concession: '-12.0% (Policy Bounded)',
      marginStatus: 'Floor Enforced (Max 18%)',
      crmAction: 'HubSpot: Deal Updated to Stage 3',
    },
  },
  {
    id: 'security',
    title: 'Compliance & SLA',
    badge: 'Security Review',
    buyerName: 'Marcus (Fintech VP)',
    buyerRole: 'Chief Security Officer',
    buyerQuote: 'Does Claude Enterprise train on our financial prompts? And do you sign a BAA for HIPAA?',
    agentResponse: 'Never. Claude Enterprise provides zero data retention for model training, customer-managed encryption keys, and SOC 2 Type II compliance. We execute standard HIPAA BAAs for all deployments over 50 seats.',
    telemetry: {
      latency: '395ms',
      listPrice: '$180,000 / yr',
      finalPrice: '$180,000 / yr',
      concession: '0% (Compliance Gate Passed)',
      marginStatus: 'Full Margin Retained',
      crmAction: 'HubSpot: Security Packet Attached',
    },
  },
  {
    id: 'closing',
    title: 'Autonomous Close',
    badge: 'Deal Closed',
    buyerName: 'David (Scale-Up)',
    buyerRole: 'Head of Operations',
    buyerQuote: 'That works for us. Let’s do 100 seats on the 2-year prepay plan.',
    agentResponse: 'Fantastic. I have locked in $67.50/seat on a 24-month agreement, created your deal in HubSpot, and sent a Google Calendar invite to your inbox for our solutions architect to complete your SSO setup.',
    telemetry: {
      latency: '424ms',
      listPrice: '$90,000 / yr',
      finalPrice: '$81,000 / yr',
      concession: '-10.0% (2-Yr Tradeoff)',
      marginStatus: 'Closed-Won Automated',
      crmAction: 'HubSpot: Won · GCal: Invite Sent',
    },
  },
];

export const AgentVoiceConsole: React.FC<{
  onLaunchDemo?: () => void;
  className?: string;
}> = ({ onLaunchDemo, className = '' }) => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>('margin');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(true);
  const [audioBars, setAudioBars] = useState<number[]>([12, 28, 45, 20, 60, 35, 18, 50, 30, 15]);

  const scenario = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];

  // Subtle audio visualizer animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setAudioBars([
        Math.floor(10 + Math.random() * 50),
        Math.floor(15 + Math.random() * 65),
        Math.floor(20 + Math.random() * 75),
        Math.floor(15 + Math.random() * 60),
        Math.floor(25 + Math.random() * 85),
        Math.floor(18 + Math.random() * 70),
        Math.floor(12 + Math.random() * 55),
        Math.floor(20 + Math.random() * 80),
        Math.floor(14 + Math.random() * 60),
        Math.floor(8 + Math.random() * 45),
      ]);
    }, 180);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`w-full rounded-2xl bg-[#141413] text-white border border-white/10 shadow-2xl overflow-hidden ${className}`}>
      {/* Console Header Bar */}
      <div className="px-4 py-3 bg-[#1A1918] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-mono text-xs font-semibold text-white/90 tracking-wide">
            AGORA RTC CONVERSATIONAL PIPELINE
          </span>
          <span className="hidden sm:inline-block font-mono text-[10px] text-white/40 border border-white/10 px-1.5 py-0.5 rounded">
            SESSION #AG-9428
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-xs text-white/70">
            <Zap className="w-3.5 h-3.5 text-[#D97757]" />
            <span>{scenario.telemetry.latency}</span>
          </div>
          <span className="text-white/20">|</span>
          <div className="flex items-center gap-1.5 font-mono text-xs text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="hidden sm:inline">16kHz Opus</span>
          </div>
        </div>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="px-4 pt-3 pb-2 bg-[#1A1918]/60 border-b border-white/5 flex items-center gap-1.5 overflow-x-auto">
        <span className="text-[11px] font-mono text-white/40 mr-2 shrink-0">SCENARIO:</span>
        {SCENARIOS.map((s) => {
          const isSelected = s.id === activeScenarioId;
          return (
            <button
              key={s.id}
              onClick={() => setActiveScenarioId(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-white/15 text-white shadow-sm border border-white/15'
                  : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <span>{s.title}</span>
              <span className={`text-[10px] font-mono px-1 rounded ${isSelected ? 'text-[#D97757] bg-black/40' : 'text-white/40'}`}>
                {s.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Live Voice Visualizer Ribbon */}
      <div className="px-5 py-4 bg-[#141413] border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Audio Waveform Bars */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#D97757]/20 border border-[#D97757]/40 flex items-center justify-center text-[#D97757] shrink-0">
            <Volume2 className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white">Agent Emily</span>
              <span className="text-[10px] font-mono text-[#D97757] uppercase tracking-wider bg-[#D97757]/15 px-1.5 py-0.2 rounded border border-[#D97757]/30">
                Speaking · MiniMax 2.8 Turbo
              </span>
            </div>
            <div className="text-[11px] font-mono text-white/50 mt-0.5">
              Deepgram STT → Deal Margin Guard → RTC SD-RTN
            </div>
          </div>
        </div>

        {/* Dynamic Waveform Graph */}
        <div className="flex items-end gap-1 h-8 px-3 py-1 rounded-lg bg-black/40 border border-white/5">
          {audioBars.map((height, i) => (
            <motion.div
              key={i}
              className="w-1.5 rounded-full"
              style={{
                backgroundColor: i % 2 === 0 ? '#D97757' : '#E8A08A',
                height: `${height}%`,
              }}
              animate={{ height: `${height}%` }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            />
          ))}
        </div>
      </div>

      {/* Live Transcript Stream */}
      <div className="p-5 space-y-4 font-sans text-xs sm:text-sm">
        {/* Buyer Turn */}
        <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/70 font-mono text-[11px]">
              <span className="font-semibold text-white">{scenario.buyerName}</span>
              <span className="text-white/40">· {scenario.buyerRole}</span>
            </div>
            <span className="text-[10px] font-mono text-white/40">INCOMING RTC AUDIO</span>
          </div>
          <p className="text-white/90 leading-relaxed italic">
            "{scenario.buyerQuote}"
          </p>
        </div>

        {/* Agent Turn */}
        <div className="p-3.5 rounded-xl bg-[#D97757]/10 border border-[#D97757]/30 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="font-semibold text-[#D97757]">Emily (Agora Voice)</span>
              <span className="text-[#D97757]/60">· Sub-500ms Synthetic Turn</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
              POLICY DEFENDED
            </span>
          </div>
          <p className="text-white/95 leading-relaxed font-sans">
            "{scenario.agentResponse}"
          </p>
        </div>
      </div>

      {/* Real-time Deal Engine Telemetry Matrix */}
      <div className="px-5 py-3.5 bg-[#181716] border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div>
          <div className="text-[10px] text-white/40 uppercase tracking-wider">List ARR</div>
          <div className="font-semibold text-white/90 mt-0.5">{scenario.telemetry.listPrice}</div>
        </div>
        <div>
          <div className="text-[10px] text-white/40 uppercase tracking-wider">Negotiated ARR</div>
          <div className="font-semibold text-emerald-400 mt-0.5">{scenario.telemetry.finalPrice}</div>
        </div>
        <div>
          <div className="text-[10px] text-white/40 uppercase tracking-wider">Concession</div>
          <div className="font-semibold text-[#D97757] mt-0.5">{scenario.telemetry.concession}</div>
        </div>
        <div>
          <div className="text-[10px] text-white/40 uppercase tracking-wider">CRM Sync</div>
          <div className="font-semibold text-white/80 mt-0.5 truncate">{scenario.telemetry.crmAction}</div>
        </div>
      </div>

      {/* Footer Call to Action */}
      {onLaunchDemo && (
        <div className="p-3 bg-[#1A1918] border-t border-white/5 flex items-center justify-between">
          <span className="text-[11px] font-mono text-white/50 hidden sm:inline">
            Configured for Claude Enterprise seat tiers & governance policies.
          </span>
          <button
            onClick={onLaunchDemo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white text-[#141413] hover:bg-[#E8E6DC] text-xs font-semibold transition-colors cursor-pointer"
          >
            <span>Launch Live Customer Experience</span>
            <ArrowRight className="w-3 h-3 text-[#D97757]" />
          </button>
        </div>
      )}
    </div>
  );
};
