'use client';

import React from 'react';
import { ArrowRight, PhoneCall, Zap, ShieldCheck, Activity, Workflow, Globe } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { AnthropicShowcase } from '@/components/AnthropicShowcase';
import { IntegrationBeams } from '@/components/IntegrationBeams';
import { ConcessionSimulator } from '@/components/ConcessionSimulator';
import { AgentVoiceConsole } from '@/components/AgentVoiceConsole';
import { Footer } from '@/components/Footer';
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
          2. HERO SECTION (React Bits DotField + Clean Typography + Code Window)
         ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex flex-col justify-center bg-[#0d0b12] text-white pt-28 pb-20 overflow-hidden border-b border-white/10">
        {/* React Bits Signature DotField interactive canvas background */}
        <DotField
          dotRadius={1.4}
          dotSpacing={16}
          cursorRadius={420}
          cursorForce={0.16}
          glowRadius={200}
          gradientFrom="rgba(217, 119, 87, 0.35)"
          gradientTo="rgba(245, 158, 11, 0.15)"
        />

        {/* Ambient bottom vignette fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0d0b12]/40 to-[#0d0b12] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Value Prop */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              {/* React Bits Eyebrow Pill */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-xs font-mono text-white/80 shadow-lg mb-6 hover:bg-white/10 transition-colors">
                <span className="px-2.5 py-0.5 rounded-md bg-[#D97757] text-white font-semibold text-[10px] tracking-wide uppercase">
                  Agora Voice RTC
                </span>
                <span>Sub-450ms Conversational AI Pipeline</span>
                <ArrowRight className="w-3 h-3 text-[#D97757]" />
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-semibold tracking-tight text-white leading-[1.08] mb-6">
                <span>Autonomous voice agents for </span>
                <br className="hidden sm:inline" />
                <span className="text-[#D97757] font-semibold drop-shadow-[0_0_35px_rgba(217,119,87,0.45)]">
                  enterprise deal execution
                </span>
              </h1>

              {/* Subtitle - Crisp, non-slop copy */}
              <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-xl mb-8 font-normal">
                Trained on enterprise pricing boundaries, objection trees, and compliance protocols. Emily conducts live sales calls, protects margins, and triggers real-time CRM updates with zero client-side latency.
              </p>

              {/* Hero Action Buttons - React Bits Style */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
                <button
                  onClick={onLaunchDemo}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-[#D97757] hover:bg-[#c66547] shadow-[0_10px_25px_rgba(217,119,87,0.35)] transition-all cursor-pointer active:scale-95"
                >
                  <span>Experience Claude Enterprise Demo</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>

                <button
                  onClick={onStartDirectCall}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-white/5 hover:bg-white/10 border border-white/10 shadow-lg backdrop-blur-xl transition-all cursor-pointer hover:border-white/20 active:scale-95"
                >
                  <PhoneCall className="w-4 h-4 text-[#D97757]" />
                  <span>Start Voice Call with Emily</span>
                  <span className="ml-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-semibold">
                    LIVE
                  </span>
                </button>
              </div>

              {/* Proof Strip - React Bits Proof Style */}
              <ul className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs font-mono text-white/60 pt-6 border-t border-white/10 w-full">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white font-medium">418ms</span> RTC Latency
                </li>
                <li className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="text-white font-medium">18.0%</span> Margin Guard
                </li>
                <li className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span className="text-white font-medium">100%</span> Cloud Pipeline
                </li>
              </ul>
            </div>

            {/* Right Column: React Bits Code Window + Agent Voice Console */}
            <div className="lg:col-span-6 w-full relative">
              <TiltedCard maxRotate={5} scale={1.01}>
                <div className="relative rounded-2xl border border-white/10 bg-[#120F17] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
                  {/* React Bits macOS Titlebar */}
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
                        VOICE PIPELINE READY
                      </span>
                    </div>
                  </div>

                  {/* Body: Agent Voice Console */}
                  <div className="p-2">
                    <AgentVoiceConsole onLaunchDemo={onLaunchDemo} />
                  </div>

                  {/* Window Footer Bar */}
                  <div className="px-4 py-2.5 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-[11px] font-mono text-white/50">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Deepgram Nova-3 Multi · MiniMax Speech-2.8</span>
                    </div>
                    <span className="text-white/40">Agora SD-RTN</span>
                  </div>

                  <BorderBeam
                    size={300}
                    duration={12}
                    colorFrom="#D97757"
                    colorTo="#F59E0B"
                  />
                </div>
              </TiltedCard>
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
