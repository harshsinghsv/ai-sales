'use client';

import React from 'react';
import { ArrowRight, PhoneCall, Radio } from 'lucide-react';
import { ShimmerButton } from '@/components/ui/shimmer-button';

interface NavbarProps {
  onLaunchDemo: () => void;
  onStartDirectCall: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onLaunchDemo,
  onStartDirectCall,
}) => {
  return (
    <div className="sticky top-3 z-50 px-4 sm:px-6 pointer-events-none">
      <header className="max-w-6xl mx-auto rounded-full bg-[#FAF9F5]/85 dark:bg-[#141413]/85 backdrop-blur-xl border border-[#E8E6DC] shadow-lg shadow-[#141413]/5 px-4 sm:px-6 py-2.5 flex items-center justify-between pointer-events-auto transition-all">
        {/* Brand & Status Pill */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2 group">
            <span className="text-[#D97757] text-2xl font-bold leading-none select-none transition-transform group-hover:rotate-45 duration-300">
              ✻
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-lg font-bold tracking-tight text-[#141413]">
                Agora
              </span>
              <span className="text-xs font-sans text-[#6B6966] font-medium hidden sm:inline">
                Voice Agent
              </span>
            </div>
          </a>

          {/* Live RTC Indicator */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF0EC] border border-[#D97757]/25 text-[11px] font-mono text-[#D97757]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D97757] opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#D97757]" />
            </span>
            <span>SD-RTN 418ms</span>
          </div>
        </div>

        {/* Clean Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-[#5E5D59]">
          <a
            href="#demo-showcase"
            className="hover:text-[#141413] transition-colors py-1 px-2 rounded-md hover:bg-[#F5F4ED]"
          >
            Customer Showcase
          </a>
          <a
            href="#capabilities"
            className="hover:text-[#141413] transition-colors py-1 px-2 rounded-md hover:bg-[#F5F4ED]"
          >
            Capabilities
          </a>
          <a
            href="#pipeline"
            className="hover:text-[#141413] transition-colors py-1 px-2 rounded-md hover:bg-[#F5F4ED]"
          >
            RTC Pipeline
          </a>
          <a
            href="#simulator"
            className="hover:text-[#141413] transition-colors py-1 px-2 rounded-md hover:bg-[#F5F4ED]"
          >
            Concession Engine
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onStartDirectCall}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#141413] bg-[#F5F4ED] hover:bg-[#E8E6DC] border border-[#E8E6DC] transition-colors cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#D97757]" />
            <span>Call Emily</span>
          </button>

          <ShimmerButton
            onClick={onLaunchDemo}
            shimmerColor="#D97757"
            borderRadius="9999px"
            className="px-4 py-1.5 text-xs shadow-sm"
          >
            <span className="flex items-center gap-1.5 font-semibold text-xs">
              <span>Customer Demo</span>
              <ArrowRight className="w-3 h-3 text-[#D97757]" />
            </span>
          </ShimmerButton>
        </div>
      </header>
    </div>
  );
};
