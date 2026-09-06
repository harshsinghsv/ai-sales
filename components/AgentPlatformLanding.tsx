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
import { MovingBorderButton } from '@/components/ui/moving-border-button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge-2';

interface AgentPlatformLandingProps {
  onLaunchDemo: () => void;
  onStartDirectCall: () => void;
}

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

          {/* Symmetrical Action Buttons: Launch Live Demo (Moving Border) & Contact Us (Transparent) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <MovingBorderButton
              type="button"
              onClick={onLaunchDemo}
              className="h-auto w-full sm:w-auto"
              faceClassName="py-3.5 sm:py-4 px-8 text-sm sm:text-base font-semibold text-white whitespace-nowrap gap-2"
            >
              <span>Launch Live Demo</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </MovingBorderButton>

            <button
              type="button"
              onClick={onStartDirectCall}
              className="w-full sm:w-auto h-12 sm:h-[52px] px-8 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-semibold text-white/90 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 backdrop-blur-md transition-all duration-300 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Contact Us</span>
            </button>
          </div>
        </div>
      </section>



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
            <Card className="bg-white border border-[#E8E6DC] shadow-xs hover:border-[#D97757]/40 hover:shadow-md transition-all flex flex-col justify-between">
              <CardHeader className="border-0 px-5 pt-5 pb-3 min-h-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF0EC] flex items-center justify-center text-[#D97757] shrink-0">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-[#141413]">
                      Sub-500ms Voice RTC
                    </CardTitle>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#D97757] font-semibold">
                      Turn Latency
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5 pt-0 space-y-3.5">
                <p className="text-xs text-[#5E5D59] leading-relaxed">
                  Agora SD-RTN edge routing, Deepgram Nova-3 Multi, and MiniMax 2.8 Turbo in a unified cloud pipeline.
                </p>
                <div className="p-2.5 bg-muted/60 flex items-center justify-between rounded-lg text-xs font-mono">
                  <span className="text-[#8C8984]">Routing</span>
                  <span className="font-semibold text-[#141413] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Agora SD-RTN
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Pillar 2 */}
            <Card className="bg-white border border-[#E8E6DC] shadow-xs hover:border-[#D97757]/40 hover:shadow-md transition-all flex flex-col justify-between">
              <CardHeader className="border-0 px-5 pt-5 pb-3 min-h-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF0EC] flex items-center justify-center text-[#D97757] shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-[#141413]">
                      18% Floor Guard
                    </CardTitle>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-amber-700 font-semibold">
                      Margin Defense
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5 pt-0 space-y-3.5">
                <p className="text-xs text-[#5E5D59] leading-relaxed">
                  Strict algorithmic boundary that prevents excessive discounting and requires multi-year reciprocal terms.
                </p>
                <div className="p-2.5 bg-muted/60 flex items-center justify-between rounded-lg text-xs font-mono">
                  <span className="text-[#8C8984]">Enforcement</span>
                  <span className="font-semibold text-[#141413] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Policy Guardrail
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Pillar 3 */}
            <Card className="bg-white border border-[#E8E6DC] shadow-xs hover:border-[#D97757]/40 hover:shadow-md transition-all flex flex-col justify-between">
              <CardHeader className="border-0 px-5 pt-5 pb-3 min-h-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF0EC] flex items-center justify-center text-[#D97757] shrink-0">
                    <Workflow className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-[#141413]">
                      Tri-Channel Sync
                    </CardTitle>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-semibold">
                      Autonomous Stack
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5 pt-0 space-y-3.5">
                <p className="text-xs text-[#5E5D59] leading-relaxed">
                  Autonomous tool execution across HubSpot CRM deals, Google Calendar appointments, and Slack rooms.
                </p>
                <div className="p-2.5 bg-muted/60 flex items-center justify-between rounded-lg text-xs font-mono">
                  <span className="text-[#8C8984]">Integrations</span>
                  <span className="font-semibold text-[#141413] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    HubSpot · GCal
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Pillar 4 */}
            <Card className="bg-white border border-[#E8E6DC] shadow-xs hover:border-[#D97757]/40 hover:shadow-md transition-all flex flex-col justify-between">
              <CardHeader className="border-0 px-5 pt-5 pb-3 min-h-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF0EC] flex items-center justify-center text-[#D97757] shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-[#141413]">
                      Code-Switching
                    </CardTitle>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-indigo-700 font-semibold">
                      Bilingual Acoustic
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5 pt-0 space-y-3.5">
                <p className="text-xs text-[#5E5D59] leading-relaxed">
                  Native English and Hindi (Hinglish) code-switching for multinational enterprise buyers and procurement.
                </p>
                <div className="p-2.5 bg-muted/60 flex items-center justify-between rounded-lg text-xs font-mono">
                  <span className="text-[#8C8984]">Model</span>
                  <span className="font-semibold text-[#141413] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    Nova-3 Multi
                  </span>
                </div>
              </CardContent>
            </Card>
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
            <MovingBorderButton
              onClick={onStartDirectCall}
              className="w-full sm:w-auto h-auto"
              faceClassName="py-3.5 sm:py-4 px-8 text-sm font-semibold text-white"
            >
              <PhoneCall className="w-4 h-4 text-[#D97757]" />
              <span>Start Voice Call with Emily</span>
            </MovingBorderButton>

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
