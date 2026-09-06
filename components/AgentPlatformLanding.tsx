'use client';

import React from 'react';
import { ArrowRight, PhoneCall, Zap, ShieldCheck, Activity, Workflow, Globe } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { AnthropicShowcase } from '@/components/AnthropicShowcase';
import { IntegrationBeams } from '@/components/IntegrationBeams';
import { ConcessionSimulator } from '@/components/ConcessionSimulator';
import { AgentVoiceConsole } from '@/components/AgentVoiceConsole';
import { Footer } from '@/components/Footer';
import { GradientBars } from '@/components/reactbits/GradientBars';
import { DotField } from '@/components/reactbits/DotField';
import { Squares } from '@/components/reactbits/Squares';
import { BlurText } from '@/components/reactbits/BlurText';
import { StarBorder } from '@/components/reactbits/StarBorder';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';
import { TiltedCard } from '@/components/reactbits/TiltedCard';
import { BorderBeam } from '@/components/ui/border-beam';
import { Marquee } from '@/components/ui/marquee';
import { RainbowButton } from '@/components/ui/rainbow-button';

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
  const [domainInput, setDomainInput] = React.useState('anthropic.com');

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
          2. 21ST.DEV GRADIENT BARS HERO SECTION (From 21st.dev)
         ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[95vh] flex flex-col justify-center items-center bg-[#0A070D] text-white pt-36 pb-24 overflow-hidden border-b border-white/10">
        {/* 21st.dev Vertical Glowing Gradient Bars Background */}
        <GradientBars barCount={32} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center flex flex-col items-center">
          {/* 21st.dev Avatar Social Proof Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg mb-8 hover:bg-white/10 transition-colors">
            {/* Avatar Stack */}
            <div className="flex -space-x-2 overflow-hidden">
              <span className="inline-block h-5 w-5 rounded-full ring-1 ring-black bg-[#D97757] text-[10px] font-bold text-white flex items-center justify-center">
                S
              </span>
              <span className="inline-block h-5 w-5 rounded-full ring-1 ring-black bg-emerald-600 text-[10px] font-bold text-white flex items-center justify-center">
                M
              </span>
              <span className="inline-block h-5 w-5 rounded-full ring-1 ring-black bg-indigo-600 text-[10px] font-bold text-white flex items-center justify-center">
                E
              </span>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-white/90">
              1,240+ Deals Negotiated · Agora SD-RTN 418ms
            </span>
          </div>

          {/* 21st.dev Headline: Bold Modern Sans + Editorial Italic Serif */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] mb-6 max-w-4xl mx-auto">
            <span>Redefining Autonomous Sales,</span>
            <br />
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#FFA87D] via-[#D97757] to-[#F59E0B] drop-shadow-[0_0_45px_rgba(217,119,87,0.55)]">
              One Negotiation at a Time.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-white/75 leading-relaxed max-w-2xl mx-auto mb-10 font-normal">
            Trained on enterprise margin policies, objection trees, and compliance gates. Emily defends pricing floors, syncs HubSpot deals, and books Google Calendar slots in sub-500ms voice turns.
          </p>

          {/* 21st.dev Interactive Launcher Form (Matching @waleedkibhen/gradient-bar-hero-section) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onLaunchDemo();
            }}
            className="w-full max-w-xl mx-auto flex flex-col sm:flex-row gap-3 mb-6 px-4"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                placeholder="Enter enterprise domain (e.g. razorpay.com)..."
                className="w-full px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-white/5 border border-white/20 focus:border-white outline-none text-white text-sm sm:text-base shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300 font-mono placeholder-white/40"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </div>

            <button
              type="submit"
              className="px-8 py-3.5 sm:py-4 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 whitespace-nowrap text-sm sm:text-base font-semibold bg-white hover:bg-gray-100 text-[#0A070D] shadow-[0_0_30px_rgba(255,255,255,0.35)] cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Launch Live Demo</span>
              <ArrowRight className="w-4 h-4 text-[#0A070D]" />
            </button>
          </form>

          {/* Symmetrical Quick Action Buttons with 21st.dev Rainbow Button */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <RainbowButton
              type="button"
              onClick={onStartDirectCall}
              className="py-3.5 sm:py-4 px-7 sm:px-8 rounded-full text-xs sm:text-sm font-semibold shadow-[0_0_30px_rgba(217,119,87,0.35)] active:scale-95"
            >
              <PhoneCall className="w-4 h-4 text-[#FFA87D]" />
              <span>Start Voice Call with Emily</span>
              <span className="relative flex h-1.5 w-1.5 ml-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
            </RainbowButton>

            <a
              href="#demo-showcase"
              className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-medium text-white/85 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 backdrop-blur-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer no-underline"
            >
              <Zap className="w-4 h-4 text-[#F59E0B]" />
              <span>Inspect Deal Architecture ↓</span>
            </a>
          </div>

          {/* 21st.dev Trust & Tech Stack Badges Strip */}
          <div className="pt-8 border-t border-white/10 w-full flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-white/50">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Agora SD-RTN (418ms)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97757]" />
              <span>Deepgram Nova-3 STT</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>MiniMax 2.8 Turbo Voice</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span>HubSpot · GCal · Slack</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. MARQUEE TICKER (Live Platform Signals)
         ───────────────────────────────────────────────────────────── */}
      <div className="py-3.5 bg-[#120F17] border-b border-white/10 overflow-hidden">
        <Marquee pauseOnHover repeat={4} className="[--gap:2rem]">
          {TICKER_ITEMS.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono shadow-2xs text-white"
            >
              <span className="text-white/50">{item.label}:</span>
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
          5. CAPABILITIES (Minimal 4-Pillar Architectural Moats)
         ───────────────────────────────────────────────────────────── */}
      <section id="capabilities" className="py-20 bg-[#FAF9F5] border-y border-[#E8E6DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0EC] border border-[#D97757]/20 text-[#D97757] text-xs font-mono font-medium mb-3">
              <Zap className="w-3.5 h-3.5" />
              <span>CORE ARCHITECTURAL MOATS</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#141413] tracking-tight">
              Engineered to Protect Margin While Closing Faster
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#5E5D59]">
              Four core engineering primitives that turn real-time voice into an autonomous negotiation engine.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E8E6DC] shadow-xs flex flex-col justify-between hover:border-[#D97757]/40 transition-all">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#FAF0EC] flex items-center justify-center text-[#D97757] mb-4">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#D97757] font-semibold mb-1">
                  &lt;500ms Turnaround
                </div>
                <h3 className="font-serif text-lg font-bold text-[#141413] mb-2">
                  Sub-500ms Voice RTC
                </h3>
                <p className="text-xs text-[#5E5D59] leading-relaxed">
                  Agora SD-RTN edge routing, Deepgram Nova-3 Multi, and MiniMax 2.8 Turbo in a unified cloud pipeline.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#E8E6DC] flex items-center gap-1.5 text-[11px] font-mono text-[#8C8984]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Agora SD-RTN Edge</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E8E6DC] shadow-xs flex flex-col justify-between hover:border-[#D97757]/40 transition-all">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#FAF0EC] flex items-center justify-center text-[#D97757] mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-amber-700 font-semibold mb-1">
                  Margin Defense
                </div>
                <h3 className="font-serif text-lg font-bold text-[#141413] mb-2">
                  18% Floor Guard
                </h3>
                <p className="text-xs text-[#5E5D59] leading-relaxed">
                  Strict algorithmic boundary that prevents excessive discounting and requires multi-year reciprocal terms.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#E8E6DC] flex items-center gap-1.5 text-[11px] font-mono text-[#8C8984]">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>Policy Enforced</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E8E6DC] shadow-xs flex flex-col justify-between hover:border-[#D97757]/40 transition-all">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#FAF0EC] flex items-center justify-center text-[#D97757] mb-4">
                  <Workflow className="w-5 h-5" />
                </div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-semibold mb-1">
                  Autonomous Stack
                </div>
                <h3 className="font-serif text-lg font-bold text-[#141413] mb-2">
                  Tri-Channel Sync
                </h3>
                <p className="text-xs text-[#5E5D59] leading-relaxed">
                  Autonomous tool execution across HubSpot CRM deals, Google Calendar appointments, and Slack rooms.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#E8E6DC] flex items-center gap-1.5 text-[11px] font-mono text-[#8C8984]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>HubSpot · GCal · Slack</span>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E8E6DC] shadow-xs flex flex-col justify-between hover:border-[#D97757]/40 transition-all">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#FAF0EC] flex items-center justify-center text-[#D97757] mb-4">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-indigo-700 font-semibold mb-1">
                  Bilingual Acoustic
                </div>
                <h3 className="font-serif text-lg font-bold text-[#141413] mb-2">
                  Code-Switching
                </h3>
                <p className="text-xs text-[#5E5D59] leading-relaxed">
                  Native English and Hindi (Hinglish) code-switching for multinational enterprise buyers and procurement.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#E8E6DC] flex items-center gap-1.5 text-[11px] font-mono text-[#8C8984]">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>Deepgram Nova-3 Multi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. REAL-TIME DATA PATH (Kept & Highlighted - As Requested!)
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
          8. CLOSING CTA BANNER (With React Bits StarBorder Buttons)
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
            <RainbowButton
              onClick={onStartDirectCall}
              className="w-full sm:w-auto py-3.5 sm:py-4 px-8 rounded-full shadow-[0_0_30px_rgba(217,119,87,0.35)]"
            >
              <PhoneCall className="w-4 h-4 text-[#FFA87D]" />
              <span>Start Voice Call with Emily</span>
            </RainbowButton>

            <StarBorder
              onClick={onLaunchDemo}
              color="#D97757"
              className="w-full sm:w-auto"
            >
              <span>View Customer Demo (Claude Enterprise)</span>
              <ArrowRight className="w-4 h-4 text-[#D97757]" />
            </StarBorder>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. ENTERPRISE FOOTER
         ───────────────────────────────────────────────────────────── */}
      <Footer onLaunchDemo={onLaunchDemo} />
    </div>
  );
};
