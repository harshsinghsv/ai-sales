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

          {/* 21st.dev Interactive Launcher Pill Bar */}
          <div className="w-full max-w-xl mx-auto p-1.5 sm:p-2 rounded-full bg-white/10 backdrop-blur-2xl border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex items-center justify-between gap-2 mb-8">
            <div className="flex items-center gap-2.5 pl-4 flex-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <input
                type="text"
                placeholder="Enter enterprise domain (e.g. acme.com)..."
                className="w-full bg-transparent border-0 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none font-mono"
                defaultValue="anthropic.com · 250 seats"
                readOnly
              />
            </div>
            <button
              onClick={onLaunchDemo}
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#D97757] hover:bg-[#c66547] shadow-[0_0_25px_rgba(217,119,87,0.45)] transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              Launch Live Demo →
            </button>
          </div>

          {/* Secondary Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
            <button
              onClick={onStartDirectCall}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium text-white/95 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-xl transition-all hover:border-white/20 active:scale-95 shadow-lg"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#D97757]" />
              <span>Start Voice Call with Emily</span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-semibold">
                LIVE
              </span>
            </button>

            <button
              onClick={onLaunchDemo}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium text-white/80 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-xl transition-all hover:border-white/20 active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>View Full Negotiation Flow</span>
            </button>
          </div>

          {/* Centered Interactive Voice Console Drawer */}
          <div className="w-full max-w-4xl mx-auto relative">
            <TiltedCard maxRotate={4} scale={1.01}>
              <div className="relative rounded-2xl border border-white/10 bg-[#120F17]/90 shadow-[0_25px_60px_rgba(0,0,0,0.75)] backdrop-blur-2xl overflow-hidden text-left">
                {/* macOS Titlebar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.03]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#EF4444]/90" />
                    <span className="w-3 h-3 rounded-full bg-[#F59E0B]/90" />
                    <span className="w-3 h-3 rounded-full bg-[#10B981]/90" />
                    <span className="ml-2 text-xs font-mono text-white/50">agora-voice-runtime.sh</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#D97757]/20 border border-[#D97757]/30 text-[#D97757] font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D97757] animate-pulse" />
                      AGORA SD-RTN 418MS
                    </span>
                  </div>
                </div>

                {/* Body: Agent Voice Console */}
                <div className="p-3 sm:p-4">
                  <AgentVoiceConsole onLaunchDemo={onLaunchDemo} />
                </div>

                {/* Console Footer */}
                <div className="px-4 py-2.5 border-t border-white/10 bg-white/[0.02] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-white/50">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Deepgram Nova-3 Multi · MiniMax Speech-2.8 · HubSpot CRM</span>
                  </div>
                  <span className="text-white/40">Zero Browser Audio Recognition</span>
                </div>

                <BorderBeam size={360} duration={12} colorFrom="#D97757" colorTo="#F59E0B" />
              </div>
            </TiltedCard>
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
          5. CAPABILITIES BENTO (Upgraded with React Bits SpotlightCards)
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
              Built with real-time voice and autonomous negotiation primitives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SpotlightCard className="col-span-1 md:col-span-2 p-8 shadow-xs hover:shadow-md transition-shadow" spotlightColor="rgba(217, 119, 87, 0.18)">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF0EC] flex items-center justify-center text-[#D97757] mb-5">
                <Activity className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#D97757] mb-1 font-semibold">Sub-500ms Turnaround</div>
              <h3 className="font-serif text-2xl font-bold text-[#141413] mb-3">Sub-500ms Voice RTC Pipeline</h3>
              <p className="text-sm text-[#5E5D59] leading-relaxed max-w-xl">
                Zero browser SpeechRecognition quirks. Traverses Agora SD-RTN with Deepgram Nova-3 Multi STT and MiniMax Speech-2.8 Turbo synthesis, delivering sub-half-second natural conversational turns.
              </p>
            </SpotlightCard>

            <SpotlightCard className="col-span-1 md:col-span-1 p-8 shadow-xs hover:shadow-md transition-shadow" spotlightColor="rgba(217, 119, 87, 0.18)">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF0EC] flex items-center justify-center text-[#D97757] mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-amber-700 mb-1 font-semibold">Margin Defense</div>
              <h3 className="font-serif text-2xl font-bold text-[#141413] mb-3">18% Margin Floor Guard</h3>
              <p className="text-sm text-[#5E5D59] leading-relaxed">
                Algorithmic concession boundary. While human sales reps frequently cave to 30% discounts, our engine strictly bounds concessions and demands multi-year commitments in reciprocity.
              </p>
            </SpotlightCard>

            <SpotlightCard className="col-span-1 md:col-span-1 p-8 shadow-xs hover:shadow-md transition-shadow" spotlightColor="rgba(217, 119, 87, 0.18)">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF0EC] flex items-center justify-center text-emerald-700 mb-5">
                <Workflow className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-emerald-700 mb-1 font-semibold">Autonomous Stack</div>
              <h3 className="font-serif text-2xl font-bold text-[#141413] mb-3">Tri-Channel Sync</h3>
              <p className="text-sm text-[#5E5D59] leading-relaxed">
                Autonomous execution across HubSpot CRM deals, Google Calendar appointments, and Slack notification webhooks with real-time sentiment analytics.
              </p>
            </SpotlightCard>

            <SpotlightCard className="col-span-1 md:col-span-2 p-8 shadow-xs hover:shadow-md transition-shadow" spotlightColor="rgba(217, 119, 87, 0.18)">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF0EC] flex items-center justify-center text-indigo-700 mb-5">
                <Globe className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-indigo-700 mb-1 font-semibold">Global Acoustic Engine</div>
              <h3 className="font-serif text-2xl font-bold text-[#141413] mb-3">Multi-Language Code-Switching</h3>
              <p className="text-sm text-[#5E5D59] leading-relaxed max-w-xl">
                Fluent code-switching across English and Hindi (Hinglish) using Deepgram's multi-language acoustic model, perfectly tailored for multinational procurement teams and global deal negotiations.
              </p>
            </SpotlightCard>
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
            <StarBorder
              onClick={onLaunchDemo}
              color="#D97757"
              className="w-full sm:w-auto"
            >
              <span>View Customer Demo (Claude Enterprise)</span>
              <ArrowRight className="w-4 h-4 text-[#D97757]" />
            </StarBorder>

            <StarBorder
              onClick={onStartDirectCall}
              color="#D97757"
              className="w-full sm:w-auto"
            >
              <PhoneCall className="w-4 h-4 text-[#D97757]" />
              <span>Start Voice Call with Emily</span>
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
