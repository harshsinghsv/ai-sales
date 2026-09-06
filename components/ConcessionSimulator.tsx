'use client';

import React, { useState } from 'react';
import { Sliders, Lock, ArrowRight, ShieldCheck, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';
import { BorderBeam } from '@/components/ui/border-beam';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';
import { TiltedCard } from '@/components/reactbits/TiltedCard';

interface ConcessionSimulatorProps {
  onLaunchDemo: () => void;
}

const SEAT_PRESETS = [50, 100, 250, 500, 1000, 2500];

export const ConcessionSimulator: React.FC<ConcessionSimulatorProps> = ({ onLaunchDemo }) => {
  const [seatCount, setSeatCount] = useState<number>(250);
  const [termYears, setTermYears] = useState<number>(2);

  const baseListPricePerSeat = 75; // $75/seat/month
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
  const marginPreservedPct = 100 - maxConcessionPct;

  return (
    <section id="simulator" className="py-20 bg-[#F5F4ED] border-t border-[#E8E6DC] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0EC] text-[#D97757] text-xs font-mono font-medium mb-3">
            <Sliders className="w-3.5 h-3.5" />
            <span>INTERACTIVE ROI & MARGIN SIMULATOR</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#141413] tracking-tight">
            Test the Agent's Concession Trading Engine
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#5E5D59]">
            Simulate how Emily calculates volume tradeoffs in real-time, defending your 18% margin floor while maximizing closed ARR.
          </p>
        </div>

        {/* React Bits SpotlightCard */}
        <SpotlightCard className="max-w-5xl mx-auto p-6 sm:p-10 shadow-xl" spotlightColor="rgba(217, 119, 87, 0.16)">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Controls (6 cols) */}
            <div className="lg:col-span-6 space-y-8">
              {/* Preset Chips & Slider */}
              <div>
                <div className="flex justify-between items-baseline mb-3">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#8C8984]">
                    Enterprise Seats Requested
                  </label>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-serif text-3xl font-bold text-[#141413]">
                      {seatCount.toLocaleString()}
                    </span>
                    <span className="text-xs font-mono text-[#8C8984]">seats</span>
                  </div>
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  min={50}
                  max={2500}
                  step={25}
                  value={seatCount}
                  onChange={(e) => setSeatCount(Number(e.target.value))}
                  className="w-full h-2.5 bg-[#E8E6DC] rounded-lg appearance-none cursor-pointer accent-[#D97757]"
                />

                {/* Preset Seat Chips */}
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  {SEAT_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setSeatCount(preset)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
                        seatCount === preset
                          ? 'bg-[#141413] text-white border-[#141413] shadow-xs'
                          : 'bg-white text-[#5E5D59] border-[#E8E6DC] hover:border-[#D97757]/40 hover:bg-[#FAF9F5]'
                      }`}
                    >
                      {preset} seats
                    </button>
                  ))}
                </div>
              </div>

              {/* Commitment Term Selection */}
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-[#8C8984] block mb-3">
                  Contract Commitment Duration
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[1, 2, 3].map((yr) => (
                    <button
                      key={yr}
                      onClick={() => setTermYears(yr)}
                      className={`py-3 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                        termYears === yr
                          ? 'bg-[#141413] text-white border-[#141413] shadow-sm'
                          : 'bg-white text-[#4D4C47] border-[#E8E6DC] hover:border-[#D97757]/40'
                      }`}
                    >
                      <div>{yr} {yr === 1 ? 'Year' : 'Years'}</div>
                      <div className="text-[10px] font-mono opacity-70 mt-0.5">
                        {yr === 1 ? 'Annual' : yr === 2 ? 'Prepay (12%)' : 'Lock-in (18%)'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Margin Policy Guarantee Pill */}
              <div className="p-4 rounded-2xl bg-[#FAF0EC] border border-[#D97757]/20 flex items-start gap-3.5">
                <Lock className="w-5 h-5 text-[#D97757] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-[#141413]">
                    Autonomous Margin Policy: Guaranteed
                  </div>
                  <p className="text-[11px] text-[#6B6966] mt-0.5 leading-relaxed">
                    Emily protects an 18% floor hard limit. If a customer pushes for a 25% or 30% discount, the agent automatically pivots to term length, onboarding credits, or notifies the VP of Sales in Slack.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Financial Readout (6 cols) with React Bits TiltedCard + BorderBeam */}
            <div className="lg:col-span-6 relative">
              <TiltedCard maxRotate={6} scale={1.02}>
                <div className="relative rounded-2xl bg-[#141413] p-7 text-white shadow-2xl border border-white/10 space-y-6 overflow-hidden font-mono text-xs">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-white font-sans font-semibold text-sm">Deal Engine Evaluation</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                      POLICY APPROVED
                    </span>
                  </div>

                  {/* Core Figures */}
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-white/70">Base List ARR:</span>
                      <span className="font-mono text-sm text-white/60 line-through">
                        ${rawAnnualList.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-white/70">Agent Concession Tradeoff:</span>
                      <span className="font-mono text-sm text-[#D97757] font-semibold">
                        -{maxConcessionPct}% (-${discountAmount.toLocaleString()})
                      </span>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                      <span className="text-sm font-semibold text-white">Closed Contract ARR:</span>
                      <span className="font-serif text-2xl font-bold text-emerald-400">
                        ${negotiatedAnnual.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Margin Gauge Visualizer */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/70">Gross Margin Preserved:</span>
                      <span className="font-bold text-white font-mono">{marginPreservedPct.toFixed(1)}% (${marginPreserved.toLocaleString()})</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${marginPreservedPct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-white/40 pt-0.5">
                      <span>Floor Boundary: 82.0%</span>
                      <span>100% Full List</span>
                    </div>
                  </div>

                  {/* Call to Action using 21st.dev ShimmerButton */}
                  <div className="pt-2">
                    <ShimmerButton
                      onClick={onLaunchDemo}
                      shimmerColor="#D97757"
                      className="w-full shadow-lg"
                    >
                      <span className="flex items-center justify-center gap-2 font-semibold text-xs text-white">
                        <span>Experience This Deal in Live Voice Demo</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </ShimmerButton>
                  </div>

                  {/* 21st.dev BorderBeam */}
                  <BorderBeam
                    size={240}
                    duration={12}
                    colorFrom="#D97757"
                    colorTo="#F59E0B"
                  />
                </div>
              </TiltedCard>
            </div>
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
};
