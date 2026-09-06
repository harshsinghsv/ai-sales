'use client';

import React, { useRef } from 'react';
import { AnimatedBeam } from '@/components/ui/animated-beam';
import { Mic, Radio, Cpu, Database, Calendar, MessageSquare, Zap } from 'lucide-react';

export const IntegrationBeams: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const buyerRef = useRef<HTMLDivElement>(null);
  const agoraRef = useRef<HTMLDivElement>(null);
  const agentRef = useRef<HTMLDivElement>(null);
  const hubspotRef = useRef<HTMLDivElement>(null);
  const gcalRef = useRef<HTMLDivElement>(null);
  const slackRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative flex h-[360px] w-full max-w-4xl mx-auto items-center justify-between p-6 sm:p-10 rounded-2xl bg-[#FAF9F5] border border-[#E8E6DC] shadow-sm overflow-hidden"
    >
      {/* Column 1: Input (Buyer Voice) */}
      <div className="flex flex-col justify-center items-center gap-3 z-10">
        <div
          ref={buyerRef}
          className="w-14 h-14 rounded-2xl bg-white border border-[#E8E6DC] shadow-md flex flex-col items-center justify-center text-[#141413] hover:scale-105 transition-transform"
        >
          <Mic className="w-6 h-6 text-[#D97757]" />
        </div>
        <div className="text-center">
          <div className="text-xs font-bold text-[#141413]">Buyer Voice</div>
          <div className="text-[10px] font-mono text-[#8C8984]">Agora RTC Ingest</div>
        </div>
      </div>

      {/* Column 2: Agora RTC Gateway */}
      <div className="flex flex-col justify-center items-center gap-3 z-10">
        <div
          ref={agoraRef}
          className="w-16 h-16 rounded-2xl bg-[#141413] text-white shadow-xl flex flex-col items-center justify-center hover:scale-105 transition-transform"
        >
          <Radio className="w-7 h-7 text-[#D97757] animate-pulse" />
        </div>
        <div className="text-center">
          <div className="text-xs font-bold text-[#141413]">Agora SD-RTN</div>
          <div className="text-[10px] font-mono text-[#D97757] font-semibold">&lt;50ms Edge</div>
        </div>
      </div>

      {/* Column 3: AI Brain & Deal Engine */}
      <div className="flex flex-col justify-center items-center gap-3 z-10">
        <div
          ref={agentRef}
          className="w-20 h-20 rounded-3xl bg-[#FAF0EC] border-2 border-[#D97757] shadow-xl flex flex-col items-center justify-center text-[#D97757] hover:scale-105 transition-transform"
        >
          <span className="text-2xl font-bold leading-none select-none">✻</span>
          <span className="text-[10px] font-mono font-bold mt-1 tracking-wider text-[#141413]">EMILY</span>
        </div>
        <div className="text-center">
          <div className="text-xs font-bold text-[#141413]">Deal Engine</div>
          <div className="text-[10px] font-mono text-emerald-700 font-semibold">18% Floor Guard</div>
        </div>
      </div>

      {/* Column 4: Autonomous Integrations (HubSpot, GCal, Slack) */}
      <div className="flex flex-col justify-between h-full py-4 z-10 gap-4">
        <div className="flex items-center gap-3">
          <div
            ref={hubspotRef}
            className="w-12 h-12 rounded-xl bg-white border border-[#E8E6DC] shadow-sm flex items-center justify-center text-orange-600 hover:scale-105 transition-transform"
          >
            <Database className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#141413]">HubSpot CRM</div>
            <div className="text-[10px] font-mono text-[#8C8984]">Auto Deal Stage</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            ref={gcalRef}
            className="w-12 h-12 rounded-xl bg-white border border-[#E8E6DC] shadow-sm flex items-center justify-center text-blue-600 hover:scale-105 transition-transform"
          >
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#141413]">Google Calendar</div>
            <div className="text-[10px] font-mono text-[#8C8984]">Exec Slot Booked</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            ref={slackRef}
            className="w-12 h-12 rounded-xl bg-white border border-[#E8E6DC] shadow-sm flex items-center justify-center text-emerald-600 hover:scale-105 transition-transform"
          >
            <MessageSquare className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#141413]">Slack #deals</div>
            <div className="text-[10px] font-mono text-[#8C8984]">Instant Alert</div>
          </div>
        </div>
      </div>

      {/* Animated Beams connecting nodes */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={buyerRef}
        toRef={agoraRef}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={agoraRef}
        toRef={agentRef}
        duration={3}
        delay={0.5}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={agentRef}
        toRef={hubspotRef}
        duration={3.5}
        delay={1}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={agentRef}
        toRef={gcalRef}
        duration={3.5}
        delay={1.3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={agentRef}
        toRef={slackRef}
        duration={3.5}
        delay={1.6}
      />
    </div>
  );
};
