'use client';

import React from 'react';
import { ArrowRight, PhoneCall, Zap, ShieldCheck, Activity, Workflow, Globe } from 'lucide-react';
import { DotPattern } from '@/components/ui/dot-pattern';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { AnimatedShinyText } from '@/components/ui/animated-shiny-text';
import { BorderBeam } from '@/components/ui/border-beam';
import { Marquee } from '@/components/ui/marquee';
import { BentoGrid, BentoCard } from '@/components/ui/bento-grid';
import { Navbar } from '@/components/Navbar';
import { AnthropicShowcase } from '@/components/AnthropicShowcase';
import { IntegrationBeams } from '@/components/IntegrationBeams';
import { ConcessionSimulator } from '@/components/ConcessionSimulator';
import { AgentVoiceConsole } from '@/components/AgentVoiceConsole';
import { Footer } from '@/components/Footer';

interface AgentPlatformLandingProps {
  onLaunchDemo: () => void;
  onStartDirectCall: () => void;
}

const TICKER_ITEMS = [
  { label: 'RTC Turn Latency', val: '418ms (Agora SD-RTN)', color: 'text-[#D97757]' },
  { label: 'Margin Defense', val: '18.0% Floor Enforced', color: 'text-amber-700' },
  { label: 'HubSpot Sync', val: 'Deal #AG-9428 Created ($198,000 ARR)', color: 'text-emerald-700' },
  { label: 'Google Calendar', val: 'Exec Architecture Slot Booked', color: 'text-blue-700' },
  { label: 'STT Pipeline', val: 'Deepgram Nova-3 Multi (Code-Switching)', color: 'text-purple-700' },
  { label: 'Voice Synthesis', val: 'MiniMax Speech-2.8 Turbo', color: 'text-[#D97757]' },
  { label: 'Compliance Gate', val: 'Zero Data Retention · HIPAA BAA', color: 'text-emerald-700' },
];

export const AgentPlatformLanding: React.FC<AgentPlatformLandingProps> = ({
  onLaunchDemo,
  onStartDirectCall,
}) => {
  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#141413] selection:bg-[#D97757]/20 selection:text-[#141413] antialiased">
      {/* ─────────────────────────────────────────────────────────────
          1. 21ST.DEV FLOATING PILL NAVBAR
         ───────────────────────────────────────────────────────────── */}
      <Navbar
        onLaunchDemo={onLaunchDemo}
        onStartDirectCall={onStartDirectCall}
      />

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION (21st.dev DotPattern + Shimmer + BorderBeam)
         ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-24 overflow-hidden border-b border-[#E8E6DC]">
        {/* 21st.dev Background DotPattern with radial fade */}
        <DotPattern className="[mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] opacity-35" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Value Prop */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              {/* 21st.dev Animated Shiny Text Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF0EC] border border-[#D97757]/30 text-xs font-mono mb-6 cursor-pointer hover:border-[#D97757]/60 transition-colors">
                <span className="w-2 h-2 rounded-full bg-[#D97757] animate-pulse" />
                <AnimatedShinyText className="font-semibold text-xs text-[#D97757]">
                  Agora Conversational AI · Sub-500ms Voice RTC
                </AnimatedShinyText>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-tight text-[#141413] leading-[1.08] mb-6">
                The Autonomous Sales Agent that{' '}
                <span className="italic font-normal text-[#D97757]">Negotiates</span> in Real-Time Voice.
              </h1>

              {/* Editorial Subtitle */}
              <p className="text-base sm:text-lg text-[#5E5D59] leading-relaxed max-w-xl mb-8 font-sans">
                Trained on enterprise margin policies, objection handling trees, and multi-tier procurement strategies. Listens, defends pricing floors, and closes high-ticket deals over voice — syncing directly with HubSpot, Google Calendar, and Slack.
              </p>

              {/* Primary Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-10">
                {/* 21st.dev Shimmer Button */}
                <ShimmerButton
                  onClick={onLaunchDemo}
                  shimmerColor="#D97757"
                  className="shadow-xl"
                >
                  <span className="flex items-center gap-2 font-semibold text-sm">
                    <span>Experience Claude Enterprise Demo</span>
                    <ArrowRight className="w-4 h-4 text-[#D97757]" />
                  </span>
                </ShimmerButton>

                <ShimmerButton
                  onClick={onStartDirectCall}
                  shimmerColor="#D97757"
                  background="#262624"
                  className="shadow-md"
                >
                  <span className="flex items-center gap-2 font-semibold text-sm">
                    <PhoneCall className="w-4 h-4 text-[#D97757]" />
                    <span>Start Voice Call with Emily</span>
                  </span>
                </ShimmerButton>
              </div>

              {/* Telemetry Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full pt-6 border-t border-[#E8E6DC]">
                <div>
                  <div className="text-2xl font-serif font-bold text-[#141413]">420ms</div>
                  <div className="text-xs text-[#8C8984] font-mono mt-0.5">RTC Turn Latency</div>
                </div>
                <div>
                  <div className="text-2xl font-serif font-bold text-[#D97757]">18.0%</div>
                  <div className="text-xs text-[#8C8984] font-mono mt-0.5">Margin Floor Guard</div>
                </div>
                <div>
                  <div className="text-2xl font-serif font-bold text-[#141413]">100%</div>
                  <div className="text-xs text-[#8C8984] font-mono mt-0.5">Cloud Pipeline (No Dups)</div>
                </div>
                <div>
                  <div className="text-2xl font-serif font-bold text-emerald-700">Tri-Stack</div>
                  <div className="text-xs text-[#8C8984] font-mono mt-0.5">HubSpot · GCal · Slack</div>
                </div>
              </div>
            </div>

            {/* Right Column: 21st.dev BorderBeam Container + Agent Voice Console */}
            <div className="lg:col-span-6 w-full relative">
              <div className="relative rounded-2xl border border-[#E8E6DC] bg-[#141413] p-1 shadow-2xl overflow-hidden">
                <AgentVoiceConsole onLaunchDemo={onLaunchDemo} />
                <BorderBeam
                  size={280}
                  duration={12}
                  colorFrom="#D97757"
                  colorTo="#F59E0B"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. 21ST.DEV MARQUEE TICKER (Live Platform Signals)
         ───────────────────────────────────────────────────────────── */}
      <div className="py-4 bg-[#F5F4ED] border-b border-[#E8E6DC] overflow-hidden">
        <Marquee pauseOnHover repeat={4} className="[--gap:2rem]">
          {TICKER_ITEMS.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E8E6DC] text-xs font-mono shadow-2xs"
            >
              <span className="text-[#8C8984]">{item.label}:</span>
              <span className={`font-semibold ${item.color}`}>{item.val}</span>
            </div>
          ))}
        </Marquee>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. CUSTOMER SHOWCASE SPOTLIGHT (Anthropic Story - Rebuilt)
         ───────────────────────────────────────────────────────────── */}
      <AnthropicShowcase onLaunchDemo={onLaunchDemo} />

      {/* ─────────────────────────────────────────────────────────────
          5. 21ST.DEV BENTO GRID (Core Architectural Moats)
         ───────────────────────────────────────────────────────────── */}
      <section id="capabilities" className="py-20 bg-[#F5F4ED] border-y border-[#E8E6DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0EC] text-[#D97757] text-xs font-mono font-medium mb-3">
              <Zap className="w-3.5 h-3.5" />
              <span>CORE ARCHITECTURAL MOATS</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#141413] tracking-tight">
              Engineered to Protect Margin While Closing Faster
            </h2>
            <p className="mt-4 text-base text-[#5E5D59]">
              Built with 21st-century voice and negotiation primitives.
            </p>
          </div>

          <BentoGrid>
            <BentoCard
              name="Sub-500ms Voice RTC Pipeline"
              className="col-span-1 md:col-span-2"
              Icon={Activity}
              description="Zero browser SpeechRecognition quirks. Traverses Agora SD-RTN with Deepgram Nova-3 Multi STT and MiniMax Speech-2.8 Turbo synthesis, delivering sub-half-second turnaround latency."
              cta="Explore Pipeline Spec"
            />

            <BentoCard
              name="18% Margin Floor Guard"
              className="col-span-1 md:col-span-1"
              Icon={ShieldCheck}
              description="Algorithmic concession boundary. Human reps frequently cave to 30% discounts; our engine strictly bounds concessions while demanding multi-year commitments in reciprocity."
              cta="Test Concession Engine"
            />

            <BentoCard
              name="Tri-Channel Autonomous Stack"
              className="col-span-1 md:col-span-1"
              Icon={Workflow}
              description="Autonomous execution across HubSpot CRM deals, Google Calendar appointments, and Slack notification webhooks with real-time sentiment analytics."
              cta="View CRM Sync Flow"
            />

            <BentoCard
              name="Multi-Language Code Switching"
              className="col-span-1 md:col-span-2"
              Icon={Globe}
              description="Fluent code-switching across English and Hindi (Hinglish) using Deepgram's multi-language acoustic model, perfectly suited for global procurement teams."
              cta="Inspect Acoustic Models"
            />
          </BentoGrid>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. 21ST.DEV ANIMATED BEAM (Pipeline Flow Visualizer)
         ───────────────────────────────────────────────────────────── */}
      <section id="pipeline" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0EC] text-[#D97757] text-xs font-mono font-medium mb-3">
              <Zap className="w-3.5 h-3.5" />
              <span>LIVE BEAM FLOW VISUALIZER</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#141413] tracking-tight">
              Real-Time Conversational Data Path
            </h2>
            <p className="mt-3 text-base text-[#5E5D59]">
              How voice packets travel from the prospect's microphone into Agora's edge, through the Deal Engine, and into enterprise CRM tools.
            </p>
          </div>

          <IntegrationBeams />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. INTERACTIVE ROI & CONCESSION SIMULATOR (Rebuilt)
         ───────────────────────────────────────────────────────────── */}
      <ConcessionSimulator onLaunchDemo={onLaunchDemo} />

      {/* ─────────────────────────────────────────────────────────────
          8. CLOSING CTA BANNER (With Matching 21st.dev ShimmerButtons)
         ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#141413] text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#D97757] text-xs font-mono mb-6">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>REAL-TIME VOICE SALES ENGINE</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight mb-6">
            Experience How Emily Closes High-Value Enterprise Deals.
          </h2>

          <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto mb-10 font-sans">
            Jump directly into the customer demo showcasing how Anthropic equips Emily with pricing tiers, compliance guardrails, and real-time CRM tool execution.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Button 1: ShimmerButton */}
            <ShimmerButton
              onClick={onLaunchDemo}
              shimmerColor="#D97757"
              className="w-full sm:w-auto shadow-2xl"
            >
              <span className="flex items-center gap-2 font-semibold text-base">
                <span>View Customer Demo (Claude Enterprise)</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </ShimmerButton>

            {/* Button 2: Matching ShimmerButton (As requested by user!) */}
            <ShimmerButton
              onClick={onStartDirectCall}
              shimmerColor="#D97757"
              background="#262624"
              className="w-full sm:w-auto shadow-xl"
            >
              <span className="flex items-center gap-2 font-semibold text-base text-white">
                <PhoneCall className="w-4 h-4 text-[#D97757]" />
                <span>Start Voice Call with Emily</span>
              </span>
            </ShimmerButton>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. 21ST.DEV GLOWING SITEMAP FOOTER
         ───────────────────────────────────────────────────────────── */}
      <Footer onLaunchDemo={onLaunchDemo} />
    </div>
  );
};
