'use client';

import React from 'react';
import { DotPattern } from '@/components/ui/dot-pattern';
import { ArrowRight, Radio, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC<{ onLaunchDemo: () => void }> = ({ onLaunchDemo }) => {
  return (
    <footer className="relative bg-[#FAF9F5] border-t border-[#E8E6DC] pt-16 pb-12 overflow-hidden text-xs text-[#5E5D59]">
      {/* 21st.dev DotPattern background watermark */}
      <DotPattern className="[mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)] opacity-25" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Tier: Brand, Mission, and Sitemap Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#E8E6DC]">
          {/* Col 1 & 2: Platform Description */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[#D97757] text-2xl font-bold leading-none select-none">✻</span>
              <span className="font-serif text-xl font-bold text-[#141413]">
                Agora Voice Agent
              </span>
            </div>
            <p className="text-sm text-[#5E5D59] leading-relaxed max-w-sm">
              The autonomous enterprise sales and negotiation platform. Built on the Agora Conversational AI SDK, Deepgram Nova-3, and real-time CRM tool execution.
            </p>

            {/* Live SD-RTN Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E8E6DC] text-[11px] font-mono shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[#141413] font-semibold">Agora Global SD-RTN</span>
              <span className="text-emerald-700 font-semibold">99.99% Uptime · 418ms</span>
            </div>
          </div>

          {/* Col 3: Product Capabilities */}
          <div className="space-y-3">
            <div className="font-mono text-[11px] uppercase tracking-wider text-[#141413] font-bold">
              Product
            </div>
            <ul className="space-y-2 text-xs">
              <li><a href="#capabilities" className="hover:text-[#D97757] transition-colors">Sub-500ms Voice RTC</a></li>
              <li><a href="#capabilities" className="hover:text-[#D97757] transition-colors">18% Margin Defense</a></li>
              <li><a href="#pipeline" className="hover:text-[#D97757] transition-colors">Cloud Conversational Path</a></li>
              <li><a href="#simulator" className="hover:text-[#D97757] transition-colors">Deal ROI Simulator</a></li>
              <li><a href="#capabilities" className="hover:text-[#D97757] transition-colors">Multi-Language Hinglish</a></li>
            </ul>
          </div>

          {/* Col 4: Integrations */}
          <div className="space-y-3">
            <div className="font-mono text-[11px] uppercase tracking-wider text-[#141413] font-bold">
              Integrations
            </div>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 hover:text-[#D97757] transition-colors cursor-pointer">
                <span>HubSpot CRM Deals</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-[#D97757] transition-colors cursor-pointer">
                <span>Google Calendar Booking</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-[#D97757] transition-colors cursor-pointer">
                <span>Slack Alert Webhooks</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-[#D97757] transition-colors cursor-pointer">
                <span>Deepgram Nova-3 STT</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-[#D97757] transition-colors cursor-pointer">
                <span>MiniMax Speech-2.8</span>
              </li>
            </ul>
          </div>

          {/* Col 5: Showcase & Compliance */}
          <div className="space-y-3">
            <div className="font-mono text-[11px] uppercase tracking-wider text-[#141413] font-bold">
              Customer Showcase
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onLaunchDemo}
                  className="text-left font-semibold text-[#D97757] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Claude Enterprise Demo</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </li>
              <li><span>Zero Data Retention</span></li>
              <li><span>SOC 2 Type II Certified</span></li>
              <li><span>HIPAA BAA Readiness</span></li>
              <li><span>SAML / SCIM Directory</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Tier: Copyright & Tech Stack Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-[#8C8984]">
          <div>
            © {new Date().getFullYear()} Agora Autonomous Voice Sales Engine. All rights reserved.
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <span className="px-2 py-0.5 rounded bg-white border border-[#E8E6DC] text-[#141413]">
              Next.js 16 (App Router)
            </span>
            <span className="px-2 py-0.5 rounded bg-white border border-[#E8E6DC] text-[#141413]">
              Agora RTC & RTM
            </span>
            <span className="px-2 py-0.5 rounded bg-white border border-[#E8E6DC] text-[#141413]">
              21st.dev UI Registry
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
