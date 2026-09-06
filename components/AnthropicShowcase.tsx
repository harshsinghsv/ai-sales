'use client';

import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  Sliders,
  CheckCircle2,
  ArrowRight,
  Database,
  LucideIcon
} from 'lucide-react';
import { BorderBeam } from '@/components/ui/border-beam';

interface PipelineStage {
  step: string;
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  icon: LucideIcon;
  action: string;
  impact: string;
  toolPayload: {
    service: string;
    action: string;
    latency: string;
  };
}

const STAGES: PipelineStage[] = [
  {
    step: '01',
    id: 'qualification',
    title: 'Instant Seat Sizing',
    badge: '250 Seats Qualified',
    badgeColor: 'text-[#D97757] bg-[#FAF0EC] border-[#D97757]/30',
    icon: Building2,
    action: 'Evaluates engineering headcount, verifies SCIM SAML requirement, and tiers account at $75/seat/month list.',
    impact: '$225,000 Pipeline Value',
    toolPayload: {
      service: 'HubSpot CRM',
      action: 'Create Deal · Tier: Claude Enterprise · Seats: 250',
      latency: '390ms',
    },
  },
  {
    step: '02',
    id: 'compliance',
    title: 'Compliance & BAA Gate',
    badge: 'Zero Data Retention',
    badgeColor: 'text-blue-700 bg-blue-50 border-blue-200',
    icon: ShieldCheck,
    action: 'Autonomously answers enterprise procurement questions: confirms zero model training, SOC 2 Type II, and HIPAA BAAs.',
    impact: 'Security Review Cleared',
    toolPayload: {
      service: 'Security Portal',
      action: 'Auto-Dispatch SOC 2 & HIPAA Packet to Procurement',
      latency: '410ms',
    },
  },
  {
    step: '03',
    id: 'margin',
    title: '18% Margin Floor Defense',
    badge: '18.0% Floor Protected',
    badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
    icon: Sliders,
    action: 'Counters a requested 25% discount by offering a 12% concession ($198K ARR) in exchange for a mandatory 24-month term.',
    impact: '$27,000 Margin Defended',
    toolPayload: {
      service: 'Deal Engine',
      action: 'Lock Margin Floor · Enforce 24-Mo Reciprocal Term',
      latency: '420ms',
    },
  },
  {
    step: '04',
    id: 'closing',
    title: 'Autonomous In-Call Close',
    badge: 'Won in 420ms',
    badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    icon: CheckCircle2,
    action: 'Finalizes agreement in voice, updates HubSpot deal to Closed-Won, and books executive solutions architecture call.',
    impact: 'Deal Closed Same Call',
    toolPayload: {
      service: 'HubSpot & GCal',
      action: 'Stage: Closed-Won · Invite Dispatched for Tuesday 10 AM',
      latency: '420ms',
    },
  },
];

export const AnthropicShowcase: React.FC<{ onLaunchDemo: () => void }> = ({ onLaunchDemo }) => {
  const [selectedStageId, setSelectedStageId] = useState<string>('margin');
  const currentStage = STAGES.find((s) => s.id === selectedStageId) || STAGES[2];

  return (
    <section id="demo-showcase" className="py-20 bg-[#FAF9F5] border-b border-[#E8E6DC] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Minimal Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0EC] border border-[#D97757]/20 text-[#D97757] text-xs font-mono font-medium mb-3">
            <span className="text-base leading-none">✻</span>
            <span>ENTERPRISE CASE STUDY</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#141413] tracking-tight">
            How Anthropic Deploys Emily for Claude Enterprise
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#5E5D59]">
            The 4-stage autonomous voice pipeline that qualifies enterprise seats, guarantees compliance, and protects margin floors.
          </p>
        </div>

        {/* 4-Stage Horizontal Pipeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {STAGES.map((stage) => {
            const isSelected = stage.id === selectedStageId;
            const IconComponent = stage.icon;

            return (
              <button
                key={stage.id}
                onClick={() => setSelectedStageId(stage.id)}
                type="button"
                className={`p-5 rounded-2xl text-left border transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                  isSelected
                    ? 'bg-white border-[#D97757] shadow-md ring-1 ring-[#D97757]/30'
                    : 'bg-white/80 border-[#E8E6DC] hover:border-[#D97757]/40 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-[#8C8984]">
                      {stage.step}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-[#FAF0EC] text-[#D97757]'
                          : 'bg-[#F5F4ED] text-[#5E5D59] group-hover:text-[#D97757]'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-serif text-base font-bold text-[#141413] mb-1.5">
                    {stage.title}
                  </h3>

                  <p className="text-xs text-[#5E5D59] leading-relaxed line-clamp-3 mb-3">
                    {stage.action}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E8E6DC]/70 flex items-center justify-between text-[11px] font-mono">
                  <span className={`px-2 py-0.5 rounded-md border font-semibold ${stage.badgeColor}`}>
                    {stage.badge}
                  </span>
                </div>

                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#D97757]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Minimal Live Execution Detail Bar (Shows what happens during this step) */}
        <div className="rounded-2xl bg-[#141413] text-white p-6 sm:p-7 border border-white/10 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            {/* Left: Stage Title & Outcome */}
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2 text-xs font-mono text-[#D97757]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>STAGE {currentStage.step} EXECUTION RUNTIME</span>
                <span className="text-white/40">·</span>
                <span className="text-white/80">{currentStage.impact}</span>
              </div>
              <h4 className="text-lg sm:text-xl font-bold font-serif text-white">
                {currentStage.title}
              </h4>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                {currentStage.action}
              </p>
            </div>

            {/* Middle: Real-Time Tool Dispatch */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 font-mono text-xs space-y-1.5 min-w-[280px]">
              <div className="flex items-center justify-between text-[10px] text-white/50">
                <span>AUTONOMOUS TOOL DISPATCH</span>
                <span className="text-emerald-400 font-semibold">{currentStage.toolPayload.latency}</span>
              </div>
              <div className="text-white font-semibold flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-[#D97757]" />
                <span>{currentStage.toolPayload.service}</span>
              </div>
              <div className="text-white/80 text-[11px] truncate">
                {currentStage.toolPayload.action}
              </div>
            </div>

            {/* Right: Quick Action */}
            <div className="shrink-0">
              <button
                type="button"
                onClick={onLaunchDemo}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-semibold text-[#100D15] bg-white hover:bg-[#F3F1ED] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md active:scale-95"
              >
                <span>Launch Claude Demo</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#100D15]" />
              </button>
            </div>
          </div>

          <BorderBeam
            size={220}
            duration={10}
            colorFrom="#D97757"
            colorTo="#F59E0B"
          />
        </div>
      </div>
    </section>
  );
};
