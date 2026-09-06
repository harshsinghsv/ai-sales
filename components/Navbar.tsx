'use client';

import React, { useState } from 'react';
import { PhoneCall, ArrowRight, Menu, X } from 'lucide-react';
import { MovingBorderButton } from '@/components/ui/moving-border-button';

interface NavbarProps {
  onLaunchDemo: () => void;
  onStartDirectCall: () => void;
}

const NAV_LINKS = [
  { label: 'Case Study', href: '#demo-showcase' },
  { label: 'Pipeline Flow', href: '#pipeline' },
  { label: 'Margin Engine', href: '#simulator' },
  { label: 'Architecture', href: '#capabilities' },
];

export const Navbar: React.FC<NavbarProps> = ({
  onLaunchDemo,
  onStartDirectCall,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-5xl">
      {/* Floating Glass Pill */}
      <nav className="relative bg-[#0D0B12]/85 backdrop-blur-2xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.6)] rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between transition-all duration-300">
        {/* Left: Brand Logo & Status */}
        <div className="flex items-center gap-3 select-none">
          <a
            href="#"
            className="flex items-center gap-2 group transition-opacity hover:opacity-90 no-underline"
          >
            <span className="text-[#D97757] text-xl font-bold leading-none animate-pulse">
              ✻
            </span>
            <span className="font-sans font-bold text-sm sm:text-base tracking-tight text-white">
              Agora
            </span>
            <span className="text-white/20 text-xs hidden sm:inline">/</span>
            <span className="text-xs text-white/50 font-mono hidden sm:inline">
              Voice Sales Agent
            </span>
          </a>

          {/* Real-Time Latency Badge */}
          <div className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400 font-medium ml-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>SD-RTN 418ms</span>
          </div>
        </div>

        {/* Center: Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-3 py-1 shadow-inner">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-medium text-white/70 hover:text-white px-3 py-1 rounded-full hover:bg-white/10 transition-colors no-underline"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick Voice Demo Trigger */}
          <button
            type="button"
            onClick={onStartDirectCall}
            className="hidden sm:inline-flex items-center gap-2 text-xs font-medium text-white/80 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/10 border border-transparent hover:border-white/10 transition-all cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#D97757]" />
            <span>Voice Demo</span>
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
          </button>

          {/* Primary CTA: Moving Border Button */}
          <MovingBorderButton
            type="button"
            onClick={onLaunchDemo}
            className="h-9 sm:h-10"
            faceClassName="px-4 py-1.5 sm:py-2 text-xs font-semibold text-white gap-1.5"
          >
            <span>Customer Demo</span>
            <ArrowRight className="w-3 h-3 text-[#D97757]" />
          </MovingBorderButton>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 rounded-2xl bg-[#0D0B12]/95 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors no-underline"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onStartDirectCall();
              }}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#D97757]" />
              <span>Start Direct Call with Emily</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
