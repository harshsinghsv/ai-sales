'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  PhoneCall,
  ShieldCheck,
  Zap,
  Activity,
  Calendar,
  Database,
  Sliders,
  Building2,
  Cpu,
  Headphones,
  Lock,
  Workflow,
  CheckCircle2,
  TrendingUp,
  Volume2
} from 'lucide-react';
import { AgentVoiceConsole } from './AgentVoiceConsole';

interface AgentPlatformLandingProps {
  onLaunchDemo: () => void;
  onStartDirectCall: () => void;
}

export const AgentPlatformLanding: React.FC<AgentPlatformLandingProps> = ({
  onLaunchDemo,
  onStartDirectCall,
}) => {
  // State for Interactive Concession Simulator
  const [seatCount, setSeatCount] = useState<number>(250);
  const [termYears, setTermYears] = useState<number>(2);
  const [selectedArchStep, setSelectedArchStep] = useState<number>(0);

  // Concession calculation rules matching Deal Engine
  const baseListPricePerSeat = 75; // $75/seat/month for Claude Enterprise
  const rawAnnualList = seatCount * baseListPricePerSeat * 12;

  // Margin Defense & Concession Logic:
  let maxConcessionPct = 0;
  if (termYears === 1) {
    maxConcessionPct = seatCount >= 200 ? 5 : 0;
  } else if (termYears === 2) {
    maxConcessionPct = seatCount >= 200 ? 12 : 10;
  } else {
    maxConcessionPct = seatCount >= 500 ? 18 : 15;
  }

  const discountAmount = rawAnnualList * (maxConcessionPct / 100);
  const negotiatedAnnual = rawAnnualList - discountAmount;
  const marginPreserved = rawAnnualList * (1 - maxConcessionPct / 100);

  const architectureSteps = [
    {
      id: 'rtc-in',
      title: '1. Agora RTC Voice Ingest',
      subtitle: 'Sub-50ms Transport',
      desc: 'Buyer voice stream ingests over Agora RTC global network with jitter buffer and echo cancellation.',
      tag: 'Agora WebRTC SDK',
      icon: Headphones,
    },
    {
      id: 'stt',
      title: '2. Deepgram Nova-3 STT',
      subtitle: 'Streaming Transcript',
      desc: 'Real-time multi-lingual speech-to-text with interim partials and semantic end-of-thought detection.',
      tag: 'Nova-3 Multi',
      icon: Zap,
    },
    {
      id: 'engine',
      title: '3. Deal Engine & Persona',
      subtitle: 'Margin Guard & Tools',
      desc: 'Evaluates buyer objections against the 18% margin floor, selecting optimal concession tradeoffs.',
      tag: 'Agora Orchestration',
      icon: Cpu,
    },
    {
      id: 'tools',
      title: '4. Autonomous Execution',
      subtitle: 'Tri-Stack Sync',
      desc: 'Invokes real-time tool calls to create HubSpot deals, Google Calendar appointments, and Slack notifications.',
      tag: 'HubSpot · GCal · Slack',
      icon: Workflow,
    },
    {
      id: 'tts-out',
      title: '5. MiniMax Turbo Voice Out',
      subtitle: 'Sub-500ms Total Loop',
      desc: 'Low-latency natural conversational voice synthesizes back over Agora RTC to the buyer.',
      tag: 'MiniMax Speech-2.8',
      icon: Activity,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#141413] selection:bg-[#D97757]/20 selection:text-[#141413] antialiased">
      {/* ---------------------------------------------------- */}
      {/* Platform Navigation Bar (Single, High-Precision Nav) */}
      {/* ---------------------------------------------------- */}
      <header className="sticky top-0 z-50 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E8E6DC] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-17 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <span className="text-[#D97757] text-2xl font-bold leading-none select-none">✻</span>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-xl font-semibold tracking-tight text-[#141413]">
                Agora Voice Agent
              </span>
              <span className="text-[11px] font-mono text-[#8C8984] hidden sm:inline">
                Enterprise Edition
              </span>
            </div>
          </div>

          {/* Clean Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm text-[#5E5D59] font-medium">
            <a href="#showcase" className="hover:text-[#141413] transition-colors">
              Customer Story
            </a>
            <a href="#capabilities" className="hover:text-[#141413] transition-colors">
              Capabilities
            </a>
            <a href="#simulator" className="hover:text-[#141413] transition-colors">
              Deal Simulator
            </a>
            <a href="#architecture" className="hover:text-[#141413] transition-colors">
              Architecture
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onStartDirectCall}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#141413] bg-[#F5F4ED] hover:bg-[#E8E6DC] border border-[#E8E6DC] transition-colors cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#D97757]" />
              <span>Talk to Emily</span>
            </button>

            <button
              onClick={onLaunchDemo}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#141413] hover:bg-[#262624] shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <span>Customer Demo (Claude Enterprise)</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D97757]" />
            </button>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------- */}
      {/* Hero Section: Editorial Typography + Live Console    */}
      {/* ---------------------------------------------------- */}
      <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Editorial Value Proposition */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              {/* Refined Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0EC] border border-[#D97757]/25 text-[#D97757] text-xs font-mono font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-[#D97757] animate-pulse" />
                <span>AGORA CONVERSATIONAL AI · SUB-500MS VOICE RTC</span>
              </div>

              {/* Main Editorial Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-tight text-[#141413] leading-[1.08] mb-6">
                The Autonomous Enterprise Sales Agent that{' '}
                <span className="italic font-normal text-[#D97757]">Negotiates</span> in Real-Time Voice.
              </h1>

              {/* Editorial Subtitle */}
              <p className="text-base sm:text-lg text-[#5E5D59] leading-relaxed max-w-xl mb-8 font-sans">
                Trained on company margin policies, objection trees, and multi-tier procurement strategies.
                Listens, defends pricing floors, and closes high-ticket deals over voice — syncing directly
                with HubSpot, Google Calendar, and Slack.
              </p>

              {/* Primary CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-10">
                <button
                  onClick={onLaunchDemo}
                  className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#141413] text-white hover:bg-[#262624] font-semibold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <span>Experience Claude Enterprise Demo</span>
                  <ArrowRight className="w-4 h-4 text-[#D97757] group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={onStartDirectCall}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-[#F5F4ED] text-[#141413] border border-[#E8E6DC] font-semibold text-sm transition-all cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-[#D97757]" />
                  <span>Start Instant Call with Emily</span>
                </button>
              </div>

              {/* Real-time Telemetry Strip */}
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
                  <div className="text-xs text-[#8C8984] font-mono mt-0.5">Cloud Voice (No Dups)</div>
                </div>
                <div>
                  <div className="text-2xl font-serif font-bold text-emerald-700">Tri-Stack</div>
                  <div className="text-xs text-[#8C8984] font-mono mt-0.5">HubSpot · GCal · Slack</div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive Agent Voice Console (NO AI SLOP) */}
            <div className="lg:col-span-6 w-full">
              <AgentVoiceConsole onLaunchDemo={onLaunchDemo} />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* Customer Showcase: How Anthropic Deploys Emily       */}
      {/* ---------------------------------------------------- */}
      <section id="showcase" className="py-20 bg-[#F5F4ED] border-y border-[#E8E6DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0EC] border border-[#D97757]/30 text-[#D97757] text-xs font-mono font-medium mb-3">
                <Building2 className="w-3.5 h-3.5" />
                <span>CUSTOMER SHOWCASE SPOTLIGHT</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#141413] tracking-tight">
                How Anthropic Deploys Our Voice Agent for Claude Enterprise
              </h2>
            </div>
            <p className="text-sm text-[#5E5D59] max-w-md">
              A real demonstration of how an enterprise client configures seat tiers, compliance gates, and automated deal booking.
            </p>
          </div>

          <div className="rounded-3xl bg-[#FAF9F5] border border-[#E8E6DC] p-6 sm:p-10 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FAF0EC] flex items-center justify-center text-[#D97757] font-serif font-bold text-lg">
                    ✻
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#141413]">
                      Claude Enterprise Solutions · Agent Emily
                    </h3>
                    <p className="text-xs text-[#8C8984] font-mono">
                      Target Audience: Heads of AI, Engineering Directors, Procurement VPs
                    </p>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-[#4D4C47] leading-relaxed">
                  When prospects explore Claude Enterprise solutions, they don't wait days for an SDR email. Instead, <span className="font-semibold text-[#141413]">Emily</span> conducts an instant real-time voice negotiation:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[#F5F4ED] border border-[#E8E6DC]">
                    <div className="flex items-center gap-2 font-semibold text-xs text-[#141413] mb-1">
                      <ShieldCheck className="w-4 h-4 text-[#D97757]" />
                      <span>Security & Compliance Check</span>
                    </div>
                    <p className="text-xs text-[#6B6966]">
                      Validates zero-retention policies, HIPAA BAA readiness, SSO, and SCIM directory requirements.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F5F4ED] border border-[#E8E6DC]">
                    <div className="flex items-center gap-2 font-semibold text-xs text-[#141413] mb-1">
                      <Sliders className="w-4 h-4 text-[#D97757]" />
                      <span>Seat & Margin Defense</span>
                    </div>
                    <p className="text-xs text-[#6B6966]">
                      Defends $75/seat list price and only concedes up to 18% in exchange for multi-year commitments.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F5F4ED] border border-[#E8E6DC]">
                    <div className="flex items-center gap-2 font-semibold text-xs text-emerald-700 mb-1">
                      <Database className="w-4 h-4" />
                      <span>HubSpot CRM Deal Creation</span>
                    </div>
                    <p className="text-xs text-[#6B6966]">
                      Automatically generates enterprise deals in HubSpot with stage, ARR value, and objection notes.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F5F4ED] border border-[#E8E6DC]">
                    <div className="flex items-center gap-2 font-semibold text-xs text-indigo-700 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span>Google Calendar Booking</span>
                    </div>
                    <p className="text-xs text-[#6B6966]">
                      Dispatches direct calendar invites for Anthropic account executives upon term agreement.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={onLaunchDemo}
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#141413] hover:bg-[#262624] text-white font-semibold text-sm transition-all shadow-sm cursor-pointer"
                  >
                    <span>Launch Claude Enterprise Customer Experience</span>
                    <ArrowRight className="w-4 h-4 text-[#D97757]" />
                  </button>
                </div>
              </div>

              {/* Right Visual: Clean Dark Metric Ledger */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl bg-[#141413] p-6 text-white shadow-xl border border-white/10 space-y-4 font-mono text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-white font-sans font-semibold">Live Deal Ledger</span>
                    </div>
                    <span className="text-[10px] text-white/40">CONFIG: CLAUDE ENTERPRISE</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-white/60">Target Tier:</span>
                      <span className="text-[#D97757] font-semibold">Claude Enterprise (250 Seats)</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-white/60">List ARR:</span>
                      <span className="text-white font-semibold">$225,000 / yr</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-white/60">Negotiated ARR:</span>
                      <span className="text-emerald-400 font-semibold">$198,000 / yr (12% off)</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-white/60">Tradeoff:</span>
                      <span className="text-amber-300">2-Year Prepay Agreement</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-[11px] leading-relaxed">
                    <div className="text-[#D97757] font-bold mb-1">Emily (Voice):</div>
                    <p className="text-white/80 font-sans italic">
                      "I can unlock the 12% tier discount for 250 seats today if we align on a 24-month commitment. Shall I send the agreement to your email and set a sync with our solutions architect?"
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-white/40">
                    <span>HubSpot: Deal Created</span>
                    <span>GCal: Pending Confirmation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* Core Platform Capabilities: 3 Architectural Pillars  */}
      {/* ---------------------------------------------------- */}
      <section id="capabilities" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0EC] text-[#D97757] text-xs font-mono font-medium mb-3">
              <Zap className="w-3.5 h-3.5" />
              <span>CORE ARCHITECTURAL MOATS</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#141413] tracking-tight">
              Engineered to Protect Margin While Closing Faster
            </h2>
            <p className="mt-4 text-base text-[#5E5D59]">
              Unlike generic voice widgets or static web forms, Agora Sales Engine marries real-time cloud RTC with game-theoretic deal defense algorithms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="p-8 rounded-3xl bg-[#F5F4ED] border border-[#E8E6DC] hover:border-[#D97757]/40 transition-all shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FAF0EC] flex items-center justify-center text-[#D97757] mb-6">
                  <Activity className="w-6 h-6" />
                </div>
                <div className="text-xs font-mono uppercase tracking-wider text-[#8C8984] mb-1">
                  Pillar 01 · Voice RTC
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#141413] mb-3">
                  Sub-500ms Conversational Cloud Pipeline
                </h3>
                <p className="text-sm text-[#4D4C47] leading-relaxed mb-6">
                  Zero browser SpeechRecognition quirks. All voice streams traverse Agora's Software Defined Real-time Network (SD-RTN), transcribed via Deepgram Nova-3 Multi, and synthesized via MiniMax Turbo with sub-half-second turn latency.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#E8E6DC] text-xs font-mono text-[#6B6966]">
                <span className="text-[#D97757] font-semibold">Latency:</span> 420ms · Deepgram Nova-3 · MiniMax Turbo
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-8 rounded-3xl bg-[#F5F4ED] border border-[#E8E6DC] hover:border-[#D97757]/40 transition-all shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FAF0EC] flex items-center justify-center text-[#D97757] mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="text-xs font-mono uppercase tracking-wider text-[#8C8984] mb-1">
                  Pillar 02 · Deal Defense
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#141413] mb-3">
                  Algorithmic Concession & Margin Floor
                </h3>
                <p className="text-sm text-[#4D4C47] leading-relaxed mb-6">
                  Human sales reps frequently cave and give 30% discounts without reciprocity. Our deal engine calculates concession trade-offs in real-time, enforcing strict margin floors (max 18%) while requiring multi-year commitments in exchange.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#E8E6DC] text-xs font-mono text-[#6B6966]">
                <span className="text-amber-700 font-semibold">Floor:</span> Max 18% · Reciprocal Tradeoff Enforced
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-8 rounded-3xl bg-[#F5F4ED] border border-[#E8E6DC] hover:border-[#D97757]/40 transition-all shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FAF0EC] flex items-center justify-center text-[#D97757] mb-6">
                  <Workflow className="w-6 h-6" />
                </div>
                <div className="text-xs font-mono uppercase tracking-wider text-[#8C8984] mb-1">
                  Pillar 03 · Autonomous Sync
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#141413] mb-3">
                  Tri-Channel Autonomous Stack Execution
                </h3>
                <p className="text-sm text-[#4D4C47] leading-relaxed mb-6">
                  When agreement is reached, the agent autonomously executes native API tool-calls: updates HubSpot deal stages, creates Google Calendar invites for the VP, and fires Slack room webhooks with conversation summaries and sentiment scores.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#E8E6DC] text-xs font-mono text-[#6B6966]">
                <span className="text-emerald-700 font-semibold">Integrations:</span> HubSpot API · GCal API · Slack Webhooks
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* Interactive Margin & Concession Simulator Widget     */}
      {/* ---------------------------------------------------- */}
      <section id="simulator" className="py-20 bg-[#F5F4ED] border-y border-[#E8E6DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0EC] text-[#D97757] text-xs font-mono font-medium mb-3">
              <Sliders className="w-3.5 h-3.5" />
              <span>INTERACTIVE ROI SIMULATOR</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#141413] tracking-tight">
              Test the Agent's Concession Trading Engine
            </h2>
            <p className="mt-3 text-sm text-[#5E5D59]">
              See how the agent balances enterprise volume against strict margin defense floors.
            </p>
          </div>

          <div className="max-w-4xl mx-auto rounded-3xl bg-[#FAF9F5] border border-[#E8E6DC] p-6 sm:p-10 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Controls (Left 6 cols) */}
              <div className="lg:col-span-6 space-y-8">
                {/* Seat Count Slider */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#6B6966]">
                      Enterprise Seats Requested
                    </label>
                    <span className="font-serif text-2xl font-bold text-[#141413]">
                      {seatCount.toLocaleString()} Seats
                    </span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={2500}
                    step={25}
                    value={seatCount}
                    onChange={(e) => setSeatCount(Number(e.target.value))}
                    className="w-full h-2 bg-[#E8E6DC] rounded-lg appearance-none cursor-pointer accent-[#D97757]"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-[#8C8984] mt-1.5">
                    <span>50 seats</span>
                    <span>500 seats</span>
                    <span>2,500 seats</span>
                  </div>
                </div>

                {/* Commitment Length Buttons */}
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-[#6B6966] block mb-3">
                    Contract Commitment Term
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((yr) => (
                      <button
                        key={yr}
                        onClick={() => setTermYears(yr)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          termYears === yr
                            ? 'bg-[#141413] text-white border-[#141413] shadow-xs'
                            : 'bg-white text-[#4D4C47] border-[#E8E6DC] hover:border-[#D97757]/40'
                        }`}
                      >
                        {yr} {yr === 1 ? 'Year' : 'Years'}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-[#8C8984] font-mono mt-2">
                    {termYears === 1 && '1-Year: Standard annual commitment. Low concession elasticity.'}
                    {termYears === 2 && '2-Year: High-value tradeoff. Unlocks up to 12% discount.'}
                    {termYears === 3 && '3-Year: Enterprise lock-in. Maximum 18% floor unlocked for 500+ seats.'}
                  </p>
                </div>

                {/* Agent Policy Status Banner */}
                <div className="p-4 rounded-2xl bg-[#FAF0EC] border border-[#D97757]/20 flex items-start gap-3">
                  <Lock className="w-5 h-5 text-[#D97757] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-[#141413]">
                      Autonomous Margin Policy: Enforced
                    </div>
                    <div className="text-[11px] text-[#6B6966] mt-0.5 leading-relaxed">
                      If the buyer demands greater than {maxConcessionPct}% discount, the agent executes an objection pivot and alerts the sales director in Slack.
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Financial Readout (Right 6 cols) */}
              <div className="lg:col-span-6 rounded-2xl bg-[#141413] p-6 text-white flex flex-col justify-between shadow-lg">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <span className="text-xs font-mono uppercase tracking-wider text-white/60">
                      Live Deal Evaluation
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                      DEAL POLICY COMPLIANT
                    </span>
                  </div>

                  <div className="space-y-4 my-6">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-white/70">Base List ARR:</span>
                      <span className="font-mono text-sm text-white/90 line-through">
                        ${rawAnnualList.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-white/70">Agent Concession:</span>
                      <span className="font-mono text-sm text-[#D97757] font-semibold">
                        -{maxConcessionPct}% (${discountAmount.toLocaleString()})
                      </span>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                      <span className="text-sm font-semibold text-white">Closed Annual ARR:</span>
                      <span className="font-serif text-2xl font-bold text-emerald-400">
                        ${negotiatedAnnual.toLocaleString()}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                      <div className="flex justify-between text-white/70 mb-1">
                        <span>ARR Margin Preserved:</span>
                        <span className="font-mono font-bold text-white">
                          ${marginPreserved.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${100 - maxConcessionPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onLaunchDemo}
                  className="w-full py-3 rounded-xl bg-[#D97757] hover:bg-[#C96442] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Experience This Negotiation in Live Voice</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* Technical Architecture: Pipeline Walk                */}
      {/* ---------------------------------------------------- */}
      <section id="architecture" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0EC] text-[#D97757] text-xs font-mono font-medium mb-3">
              <Cpu className="w-3.5 h-3.5" />
              <span>END-TO-END PIPELINE ARCHITECTURE</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#141413] tracking-tight">
              Real-Time Voice Architecture at Global Scale
            </h2>
            <p className="mt-4 text-base text-[#5E5D59]">
              Every millisecond counts when handling sales objections. Here is the full cloud lifecycle of an Agora sales negotiation turn.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Step Selection Buttons (Left 5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              {architectureSteps.map((step, idx) => {
                const isSelected = selectedArchStep === idx;
                const Icon = step.icon;
                return (
                  <button
                    key={step.id}
                    onClick={() => setSelectedArchStep(idx)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#141413] text-white border-[#141413] shadow-md'
                        : 'bg-[#F5F4ED] text-[#4D4C47] border-[#E8E6DC] hover:border-[#D97757]/30 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-white/10 text-[#D97757]' : 'bg-white text-[#6B6966]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold leading-tight">{step.title}</div>
                        <div
                          className={`text-[11px] font-mono mt-0.5 ${
                            isSelected ? 'text-white/60' : 'text-[#8C8984]'
                          }`}
                        >
                          {step.subtitle}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                        isSelected ? 'bg-white/15 text-white' : 'bg-white text-[#6B6966] border border-[#E8E6DC]'
                      }`}
                    >
                      {step.tag}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Detailed Visual Explainer (Right 7 cols) */}
            <div className="lg:col-span-7 rounded-3xl bg-[#FAF9F5] border border-[#E8E6DC] p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#FAF0EC] flex items-center justify-center text-[#D97757]">
                  {React.createElement(architectureSteps[selectedArchStep].icon, { className: 'w-6 h-6' })}
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#141413]">
                    {architectureSteps[selectedArchStep].title}
                  </h3>
                  <p className="text-xs font-mono text-[#D97757] font-semibold">
                    {architectureSteps[selectedArchStep].subtitle} · {architectureSteps[selectedArchStep].tag}
                  </p>
                </div>
              </div>

              <p className="text-base text-[#4D4C47] leading-relaxed mb-6">
                {architectureSteps[selectedArchStep].desc}
              </p>

              {/* Technical Code / Spec Box */}
              <div className="rounded-2xl bg-[#141413] p-5 text-white font-mono text-xs overflow-x-auto space-y-2">
                <div className="text-white/40 text-[10px] pb-2 border-b border-white/10 uppercase tracking-widest">
                  Pipeline Telemetry & Parameters
                </div>
                {selectedArchStep === 0 && (
                  <>
                    <div className="text-emerald-400">// Agora RTC Channel Configuration</div>
                    <div className="text-white/80">channel: "sales-call-anthropic"</div>
                    <div className="text-white/80">audioProfile: "speech_standard_16khz"</div>
                    <div className="text-white/80">latencyPolicy: "LOW_LATENCY_INTERACTIVE"</div>
                  </>
                )}
                {selectedArchStep === 1 && (
                  <>
                    <div className="text-emerald-400">// Deepgram Nova-3 Multi-Language STT</div>
                    <div className="text-white/80">model: "nova-3", language: "en-US / multi"</div>
                    <div className="text-white/80">interim_results: true, smart_format: true</div>
                    <div className="text-white/80">endpointing_ms: 320ms</div>
                  </>
                )}
                {selectedArchStep === 2 && (
                  <>
                    <div className="text-emerald-400">// Deal Engine Margins & Persona Guard</div>
                    <div className="text-white/80">max_concession_floor: 0.18 // 18% floor</div>
                    <div className="text-white/80">objection_pivots: ["security", "price", "pilot"]</div>
                    <div className="text-white/80">tool_choice: "auto" (HubSpot, GCal, Slack)</div>
                  </>
                )}
                {selectedArchStep === 3 && (
                  <>
                    <div className="text-emerald-400">// Autonomous CRM & Scheduling Tools</div>
                    <div className="text-white/80">hubspot.create_deal(deal_name, stage, amount)</div>
                    <div className="text-white/80">calendar.create_event(start_time, attendees)</div>
                    <div className="text-white/80">slack.post_alert(channel="#deals", transcript)</div>
                  </>
                )}
                {selectedArchStep === 4 && (
                  <>
                    <div className="text-emerald-400">// MiniMax Speech-2.8 Turbo TTS</div>
                    <div className="text-white/80">voice_id: "emily_enterprise_consultant"</div>
                    <div className="text-white/80">streaming_chunk_size: 20ms</div>
                    <div className="text-white/80">roundtrip_latency: ~420ms</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* Big Closing Banner & Editorial CTA                   */}
      {/* ---------------------------------------------------- */}
      <section className="py-20 bg-[#141413] text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#D97757] text-xs font-mono mb-6">
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
            <button
              onClick={onLaunchDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#D97757] hover:bg-[#C96442] text-white font-semibold text-base shadow-xl transition-all cursor-pointer"
            >
              <span>View Customer Demo (Claude Enterprise)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onStartDirectCall}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-base transition-all cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-[#D97757]" />
              <span>Talk Directly with Emily</span>
            </button>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* Footer                                               */}
      {/* ---------------------------------------------------- */}
      <footer className="py-12 bg-[#FAF9F5] border-t border-[#E8E6DC] text-xs text-[#6B6966]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[#D97757] font-bold">✻</span>
            <span className="font-serif font-bold text-[#141413]">Agora Voice Agent</span>
            <span>·</span>
            <span>Built on Agora Conversational AI SDK</span>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span>Deepgram Nova-3</span>
            <span>MiniMax Turbo</span>
            <span>HubSpot API</span>
            <span>Google Calendar API</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
