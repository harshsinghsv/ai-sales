'use client';

import React from 'react';
import { ArrowRight, PhoneCall, Zap, ShieldCheck, Activity, Workflow, Globe } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { AnthropicShowcase } from '@/components/AnthropicShowcase';
import { IntegrationBeams } from '@/components/IntegrationBeams';
import { ConcessionSimulator } from '@/components/ConcessionSimulator';
import { AgentVoiceConsole } from '@/components/AgentVoiceConsole';
import { Footer } from '@/components/Footer';
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
          2. HERO SECTION (React Bits Squares + BlurText + StarBorder)
         ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-24 overflow-hidden border-b border-[#E8E6DC]">
        {/* React Bits Squares interactive canvas background */}
        <Squares
          speed={0.35}
          squareSize={48}
          borderColor="#E8E6DC80"
          hoverFillColor="#D9775715"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Value Prop */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF0EC] border border-[#D97757]/30 text-xs font-mono mb-6 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#D97757] animate-pulse" />
                <span className="font-semibold text-xs text-[#D97757]">
                  Agora Conversational AI · Sub-500ms Voice RTC
                </span>
              </div>

              {/* Main Headline with React Bits BlurText */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-tight text-[#141413] leading-[1.08] mb-6">
                <BlurText
                  text="The Autonomous Sales Agent that Negotiates in Real-Time Voice."
                  delay={45}
                  highlightWord="Negotiates"
                  highlightClass="text-[#D97757] italic font-normal"
                />
              </h1>

              {/* Editorial Subtitle */}
              <p className="text-base sm:text-lg text-[#5E5D59] leading-relaxed max-w-xl mb-8 font-sans">
                Trained on enterprise margin policies, objection handling trees, and multi-tier procurement strategies. Listens, defends pricing floors, and closes high-ticket deals over voice — syncing directly with HubSpot, Google Calendar, and Slack.
              </p>

              {/* Primary Action Buttons with React Bits StarBorder */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
                <StarBorder
                  onClick={onLaunchDemo}
                  color="#D97757"
                  className="w-full sm:w-auto"
                >
                  <span className="flex items-center gap-2">
                    <span>Experience Claude Enterprise Demo</span>
                    <ArrowRight className="w-4 h-4 text-[#D97757]" />
                  </span>
                </StarBorder>

                <StarBorder
                  onClick={onStartDirectCall}
                  color="#D97757"
                  className="w-full sm:w-auto"
                >
                  <span className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-[#D97757]" />
                    <span>Start Voice Call with Emily</span>
                  </span>
                </StarBorder>
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

            {/* Right Column: React Bits TiltedCard + Agent Voice Console */}
            <div className="lg:col-span-6 w-full relative">
              <TiltedCard maxRotate={6} scale={1.02}>
                <div className="relative rounded-2xl border border-[#E8E6DC] bg-[#141413] p-1 shadow-2xl overflow-hidden">
                  <AgentVoiceConsole onLaunchDemo={onLaunchDemo} />
                  <BorderBeam
                    size={280}
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
