'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  ShieldCheck,
  Sliders,
  Database,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
  Clock,
  Sparkles
} from 'lucide-react';
import { BorderBeam } from '@/components/ui/border-beam';
import { ShimmerButton } from '@/components/ui/shimmer-button';

interface Step {
  id: string;
  tabLabel: string;
  title: string;
  description: string;
  buyerLine: string;
  emilyLine: string;
  badge: string;
  metricLabel: string;
  metricVal: string;
  toolEvent: string;
}

const STEPS: Step[] = [
  {
    id: 'qualification',
    tabLabel: '1. Lead Qualification',
    title: 'Instant Enterprise Seat Qualification',
    description: 'Emily evaluates buyer team size, role distribution across Engineering and Design, and matches them to the Claude Enterprise tier with SCIM directory integration.',
    buyerLine: 'We are expanding from Claude Pro to Enterprise across 250 engineers. What makes Enterprise different?',
    emilyLine: 'Claude Enterprise gives your 250 engineers 1,000,000-token context windows, Claude Code terminal workflows, and unified SAML SSO with granular audit logging.',
    badge: 'QUALIFICATION COMPLETED',
    metricLabel: 'Seats Sized',
    metricVal: '250 Seats ($75/mo List)',
    toolEvent: 'HubSpot: Contact Enriched · Deal Sized at $225,000 ARR',
  },
  {
    id: 'security',
    tabLabel: '2. Security & Compliance',
    title: 'Zero Data Training & HIPAA BAA Defense',
    description: 'Enterprise procurement questions are handled in voice without stalling. Emily validates SOC 2 Type II, zero-retention policies, and HIPAA Business Associate Agreements.',
    buyerLine: 'Before we discuss pricing, we must verify: will Anthropic train on our proprietary code or customer queries?',
    emilyLine: 'Never. Claude Enterprise strictly guarantees zero data retention for training. Your proprietary inputs remain private, and we execute custom HIPAA BAAs for all teams over 50 seats.',
    badge: 'COMPLIANCE GATE CLEARED',
    metricLabel: 'Security SLA',
    metricVal: 'SOC 2 Type II · HIPAA BAA',
    toolEvent: 'HubSpot: Security Packet Auto-Dispatched to Procurement',
  },
  {
    id: 'concession',
    tabLabel: '3. Margin Defense',
    title: 'Algorithmic Concession Tradeoffs',
    description: 'When the prospect pushes for a 25% discount, Emily protects the 18% margin floor, offering a 12% discount in exchange for a 24-month upfront commitment.',
    buyerLine: 'Can you give us a 25% discount if we sign this quarter?',
    emilyLine: 'I cannot do 25% while maintaining dedicated enterprise infrastructure, but if we align on a 24-month term, my deal engine unlocks a 12% concession at $66/seat.',
    badge: '18% MARGIN FLOOR DEFENDED',
    metricLabel: 'Discount Unlocked',
    metricVal: '-12.0% ($27,000 ARR Saved)',
    toolEvent: 'Deal Engine: Policy Compliant · Reciprocal Term Enforced',
  },
  {
    id: 'closing',
    tabLabel: '4. CRM & Calendar Booking',
    title: 'Autonomous In-Call Deal Closing',
    description: 'Once terms are accepted, Emily executes real-time tool calls: updates HubSpot deal stages, creates calendar events for the VP, and fires Slack room alerts.',
    buyerLine: 'Deal. Send the agreement and set a time with your solutions engineer.',
    emilyLine: 'Terms locked. I have created the deal in HubSpot and sent a Google Calendar invite to your inbox for Tuesday 10 AM with our solutions architect.',
    badge: 'AUTONOMOUS CLOSE-WON',
    metricLabel: 'Execution Time',
    metricVal: '420ms Synthetic Turn',
    toolEvent: 'HubSpot: Deal Stage Moved to Won · Google Calendar: Invite Dispatched',
  },
];

export const AnthropicShowcase: React.FC<{ onLaunchDemo: () => void }> = ({ onLaunchDemo }) => {
  const [activeStepId, setActiveStepId] = useState<string>('concession');
  const activeStep = STEPS.find((s) => s.id === activeStepId) || STEPS[0];

  return (
    <section id="demo-showcase" className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0EC] border border-[#D97757]/30 text-[#D97757] text-xs font-mono font-medium mb-3">
              <Building2 className="w-3.5 h-3.5" />
              <span>CUSTOMER SHOWCASE SPOTLIGHT</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#141413] tracking-tight">
              How Anthropic Deploys Emily for Claude Enterprise
            </h2>
          </div>
          <p className="text-sm text-[#5E5D59] max-w-md">
            See how Anthropic leverages our autonomous sales agent to qualify high-ticket accounts, defend margin policies, and auto-book enterprise deals in voice.
          </p>
        </div>

        {/* 21st.dev Interactive Step Switcher Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
          {STEPS.map((step) => {
            const isSelected = step.id === activeStepId;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStepId(step.id)}
                className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#141413] text-white border-[#141413] shadow-md'
                    : 'bg-[#FAF9F5] text-[#5E5D59] border-[#E8E6DC] hover:border-[#D97757]/40 hover:bg-white'
                }`}
              >
                <div className="text-[11px] font-mono uppercase tracking-wider mb-1 opacity-70">
                  {step.tabLabel}
                </div>
                <div className="text-xs font-semibold truncate">
                  {step.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Showcase Container with 21st.dev BorderBeam */}
        <div className="relative rounded-3xl bg-[#FAF9F5] border border-[#E8E6DC] p-6 sm:p-10 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 7 cols: Step Description & Voice Dialogue */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-[#D97757] text-3xl font-bold leading-none select-none">✻</span>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#141413]">
                    {activeStep.title}
                  </h3>
                  <div className="text-xs font-mono text-[#D97757] font-semibold mt-0.5">
                    {activeStep.badge}
                  </div>
                </div>
              </div>

              <p className="text-sm sm:text-base text-[#4D4C47] leading-relaxed">
                {activeStep.description}
              </p>

              {/* Dialogue Transcript Simulation Box */}
              <div className="rounded-2xl bg-white border border-[#E8E6DC] p-5 space-y-3.5 shadow-2xs">
                {/* Buyer Quote */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#8C8984]">
                    <span className="font-semibold text-[#141413]">Enterprise Prospect (VP Eng)</span>
                    <span>Microphone Ingest (Agora RTC)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#4D4C47] italic bg-[#F5F4ED] p-3 rounded-xl">
                    "{activeStep.buyerLine}"
                  </p>
                </div>

                {/* Agent Emily Response */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#D97757]">
                    <span className="font-semibold">Emily (Agora Voice Agent)</span>
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                      420ms Latency
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#141413] bg-[#FAF0EC] p-3 rounded-xl border border-[#D97757]/20 font-medium leading-relaxed">
                    "{activeStep.emilyLine}"
                  </p>
                </div>
              </div>

              {/* Tool Execution Event Chip */}
              <div className="p-3 rounded-xl bg-[#F5F4ED] border border-[#E8E6DC] flex items-center justify-between text-xs font-mono">
                <span className="text-[#8C8984]">Autonomous Action:</span>
                <span className="font-semibold text-emerald-700">{activeStep.toolEvent}</span>
              </div>
            </div>

            {/* Right 5 cols: Live Deal Ledger with 21st.dev BorderBeam */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl bg-[#141413] p-6 text-white shadow-2xl border border-white/10 space-y-5 font-mono text-xs overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-white font-sans font-semibold text-sm">Claude Enterprise Ledger</span>
                  </div>
                  <span className="text-[10px] text-white/50">SESSION #AG-9428</span>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-white/60">Product Tier:</span>
                    <span className="text-[#D97757] font-semibold">Claude Enterprise (250 Seats)</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-white/60">List ARR:</span>
                    <span className="text-white font-semibold">$225,000 / yr</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-white/60">Negotiated ARR:</span>
                    <span className="text-emerald-400 font-semibold">$198,000 / yr (-12%)</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-white/60">Metric Status:</span>
                    <span className="text-amber-300 font-semibold">{activeStep.metricVal}</span>
                  </div>
                </div>

                <div className="space-y-2 text-[11px] text-white/70">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>HubSpot Deal Created in Stage 3</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Google Calendar Executive Invite Dispatched</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Slack #deals Alert Fired with Sentiment Score</span>
                  </div>
                </div>

                <div className="pt-2">
                  <ShimmerButton
                    onClick={onLaunchDemo}
                    shimmerColor="#D97757"
                    className="w-full shadow-lg"
                  >
                    <span className="flex items-center justify-center gap-2 font-semibold text-xs text-white">
                      <span>Launch Claude Enterprise Customer Demo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </ShimmerButton>
                </div>

                {/* 21st.dev BorderBeam on Ledger */}
                <BorderBeam
                  size={200}
                  duration={10}
                  colorFrom="#D97757"
                  colorTo="#F59E0B"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
