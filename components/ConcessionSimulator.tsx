'use client';

import React, { useState } from 'react';
import { Sliders, ArrowRight, Lock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardToolbar, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge-2';

interface ConcessionSimulatorProps {
  onLaunchDemo: () => void;
}

const SEAT_PRESETS = [100, 250, 500, 1000];

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
  const marginPreservedPct = 100 - maxConcessionPct;

  return (
    <section id="simulator" className="py-20 bg-[#FAF9F5] border-t border-[#E8E6DC] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Minimal Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0EC] border border-[#D97757]/20 text-[#D97757] text-xs font-mono font-medium mb-3">
            <Sliders className="w-3.5 h-3.5" />
            <span>ALGORITHMIC MARGIN DEFENSE</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#141413] tracking-tight">
            Test the Agent's Concession Trading Engine
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#5E5D59]">
            Adjust seat volume and contract duration to see Emily defend your 18% margin floor while locking enterprise ARR.
          </p>
        </div>

        {/* Unified Simulator Board */}
        <Card className="max-w-4xl mx-auto bg-white border border-[#E8E6DC] shadow-sm p-6 sm:p-10 space-y-8 relative overflow-hidden">
          {/* Top Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-8 border-b border-[#E8E6DC]">
            {/* Seat Volume Control (7 cols) */}
            <div className="md:col-span-7 space-y-3">
              <div className="flex items-baseline justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-[#8C8984] font-semibold">
                  Enterprise Headcount
                </label>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#141413]">
                    {seatCount.toLocaleString()}
                  </span>
                  <span className="text-xs font-mono text-[#8C8984]">Seats</span>
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min={50}
                max={2000}
                step={25}
                value={seatCount}
                onChange={(e) => setSeatCount(Number(e.target.value))}
                className="w-full h-2 bg-[#E8E6DC] rounded-lg appearance-none cursor-pointer accent-[#D97757]"
              />

              {/* Preset Chips */}
              <div className="flex items-center gap-2 pt-1">
                {SEAT_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setSeatCount(preset)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
                      seatCount === preset
                        ? 'bg-[#141413] text-white border-[#141413]'
                        : 'bg-[#FAF9F5] text-[#5E5D59] border-[#E8E6DC] hover:border-[#D97757]/40'
                    }`}
                  >
                    {preset} seats
                  </button>
                ))}
              </div>
            </div>

            {/* Commitment Duration Control (5 cols) */}
            <div className="md:col-span-5 space-y-3">
              <label className="text-xs font-mono uppercase tracking-wider text-[#8C8984] font-semibold block">
                Contract Term Commitment
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setTermYears(yr)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-medium border transition-all cursor-pointer text-center ${
                      termYears === yr
                        ? 'bg-[#141413] text-white border-[#141413] shadow-xs'
                        : 'bg-[#FAF9F5] text-[#5E5D59] border-[#E8E6DC] hover:border-[#D97757]/40'
                    }`}
                  >
                    <div className="font-bold">{yr} {yr === 1 ? 'Yr' : 'Yrs'}</div>
                    <div className="text-[10px] opacity-70 font-mono mt-0.5">
                      {yr === 1 ? 'Standard' : yr === 2 ? '-12% Max' : '-18% Floor'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Readout: 3 Clean Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Pillar 1: Full List Price */}
            <Card className="bg-white border border-[#E8E6DC] shadow-xs">
              <CardHeader className="border-0 px-4 py-3 min-h-auto">
                <CardTitle className="text-xs font-semibold text-[#5E5D59]">
                  Full List Price
                </CardTitle>
                <CardToolbar>
                  <Badge variant="secondary" appearance="light" size="xs" className="font-mono text-[10px]">
                    Catalog
                  </Badge>
                </CardToolbar>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0 space-y-2">
                <div className="font-serif text-2xl font-bold text-[#141413]">
                  ${rawAnnualList.toLocaleString()}
                </div>
                <div className="p-2 bg-muted/60 flex items-center justify-between rounded-lg text-xs font-mono">
                  <span className="text-muted-foreground">Rate:</span>
                  <span className="font-semibold text-foreground">$75/seat/mo</span>
                </div>
              </CardContent>
            </Card>

            {/* Pillar 2: Negotiated Contract */}
            <Card className="bg-white border border-[#D97757]/30 shadow-xs">
              <CardHeader className="border-0 px-4 py-3 min-h-auto">
                <CardTitle className="text-xs font-semibold text-[#D97757]">
                  Counter-Offer
                </CardTitle>
                <CardToolbar>
                  <Badge variant="primary" appearance="light" size="xs" className="font-mono text-[10px]">
                    -{maxConcessionPct}% Concession
                  </Badge>
                </CardToolbar>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0 space-y-2">
                <div className="font-serif text-2xl font-bold text-[#D97757]">
                  ${negotiatedAnnual.toLocaleString()}
                </div>
                <div className="p-2 bg-[#FAF0EC] flex items-center justify-between rounded-lg text-xs font-mono">
                  <span className="text-[#D97757]">Lock Term:</span>
                  <span className="font-semibold text-[#D97757]">{termYears} Yr Term</span>
                </div>
              </CardContent>
            </Card>

            {/* Pillar 3: Margin Policy Status */}
            <Card className="bg-white border border-emerald-200 shadow-xs">
              <CardHeader className="border-0 px-4 py-3 min-h-auto">
                <CardTitle className="text-xs font-semibold text-emerald-800">
                  18% Margin Floor
                </CardTitle>
                <CardToolbar>
                  <Badge variant="success" appearance="light" size="xs" className="font-mono text-[10px]">
                    Defended
                  </Badge>
                </CardToolbar>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0 space-y-2">
                <div className="font-serif text-2xl font-bold text-emerald-700">
                  {marginPreservedPct.toFixed(0)}% Preserved
                </div>
                <div className="p-2 bg-[#F0F7F4] flex items-center justify-between rounded-lg text-xs font-mono">
                  <span className="text-emerald-700">Floor Status:</span>
                  <span className="font-semibold text-emerald-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Enforced
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[#5E5D59] font-mono">
              <Lock className="w-3.5 h-3.5 text-[#D97757]" />
              <span>Policy Rule: Customer requests &gt;18% discount require VP sign-off or extended terms.</span>
            </div>
            <button
              type="button"
              onClick={onLaunchDemo}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-[#141413] hover:bg-[#252321] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm active:scale-95"
            >
              <span>Test Concession in Live Voice</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </Card>
      </div>
    </section>
  );
};
