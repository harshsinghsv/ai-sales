'use client';

import React, { useState } from 'react';
import { ArrowRight, PhoneCall, Radio, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavbarProps {
  onLaunchDemo: () => void;
  onStartDirectCall: () => void;
}

const NAV_ITEMS = [
  { label: 'Customer Showcase', href: '#demo-showcase' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'RTC Pipeline', href: '#pipeline' },
  { label: 'Concession Engine', href: '#simulator' },
];

export const Navbar: React.FC<NavbarProps> = ({
  onLaunchDemo,
  onStartDirectCall,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 pointer-events-none">
      <header className="max-w-6xl mx-auto rounded-full bg-[#120F17]/85 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.36),inset_0_0.5px_0_rgba(255,255,255,0.1)] px-4 sm:px-6 py-2.5 flex items-center justify-between pointer-events-auto transition-all">
        {/* Brand & Status */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2 group">
            <span className="text-[#D97757] text-xl font-bold leading-none select-none transition-transform group-hover:rotate-45 duration-300">
              ✻
            </span>
            <div className="flex items-center gap-2">
              <span className="font-sans text-sm font-semibold tracking-tight text-white">
                Agora
              </span>
              <span className="text-white/25 text-xs select-none">/</span>
              <span className="text-xs text-white/60 font-mono hidden sm:inline">
                Sales Voice Agent
              </span>
            </div>
          </a>

          {/* Live RTC Indicator */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-[#D97757]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D97757] opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#D97757]" />
            </span>
            <span>SD-RTN 418ms</span>
          </div>
        </div>

        {/* Sliding Magnetic Nav Links */}
        <nav
          className="hidden lg:flex items-center gap-1 text-xs font-medium text-white/70 relative"
          onMouseLeave={() => setHoveredIdx(null)}
        >
          {NAV_ITEMS.map((item, idx) => (
            <a
              key={item.label}
              href={item.href}
              onMouseEnter={() => setHoveredIdx(idx)}
              className="relative px-3 py-1.5 rounded-full transition-colors hover:text-white"
            >
              {hoveredIdx === idx && (
                <motion.div
                  layoutId="navbar-hover"
                  className="absolute inset-0 rounded-full bg-white/10"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onStartDirectCall}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-white/90 bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer hover:border-white/20 active:scale-95"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#D97757]" />
            <span>Call Emily</span>
          </button>

          <button
            onClick={onLaunchDemo}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-[#D97757] hover:bg-[#c86646] shadow-[0_0_20px_rgba(217,119,87,0.35)] transition-all cursor-pointer active:scale-95"
          >
            <span>Customer Demo</span>
            <ArrowRight className="w-3 h-3 text-white" />
          </button>
        </div>
      </header>
    </div>
  );
};
