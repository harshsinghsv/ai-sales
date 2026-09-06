'use client';

import React, { useState, useEffect } from 'react';

interface NavbarProps {
  onLaunchDemo: () => void;
  onStartDirectCall?: () => void;
  ctaText?: string;
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onLaunchDemo,
  onStartDirectCall,
  ctaText = 'DEMO',
  className = '',
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScrollState = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScrollState, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollState);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className={`fixed top-5 sm:top-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none ${className}`}>
      <nav
        aria-label="Main Navigation"
        className={`pointer-events-auto w-full max-w-[760px] h-[54px] sm:h-[58px] rounded-full bg-black border border-white/15 flex items-center justify-between p-1.5 pl-2 pr-1.5 transition-all duration-300 ${
          isScrolled
            ? 'shadow-[0_20px_50px_rgba(0,0,0,0.85)] border-white/20'
            : 'shadow-[0_20px_45px_rgba(0,0,0,0.65)]'
        }`}
      >
        {/* Left Emblem: Circular White Badge with Stylized Italic "A" */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-black flex items-center justify-center font-black select-none shrink-0 shadow-sm transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Agora AI Home"
        >
          <span className="font-sans font-black italic text-xl sm:text-2xl leading-none tracking-tighter -ml-0.5">
            A
          </span>
        </button>

        {/* Middle Navigation Links: Work, About, Playground, Resource */}
        <div className="flex items-center gap-4 sm:gap-8 mx-auto px-2 sm:px-6 select-none">
          <button
            type="button"
            onClick={() => scrollTo('capabilities')}
            className="text-[13px] sm:text-[14px] font-medium text-white/80 hover:text-white transition-colors cursor-pointer tracking-tight"
          >
            Work
          </button>
          <button
            type="button"
            onClick={() => scrollTo('demo-showcase')}
            className="text-[13px] sm:text-[14px] font-medium text-white/80 hover:text-white transition-colors cursor-pointer tracking-tight"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => scrollTo('simulator')}
            className="text-[13px] sm:text-[14px] font-medium text-white/80 hover:text-white transition-colors cursor-pointer tracking-tight"
          >
            Playground
          </button>
          <button
            type="button"
            onClick={() => scrollTo('pipeline')}
            className="hidden xs:inline text-[13px] sm:text-[14px] font-medium text-white/80 hover:text-white transition-colors cursor-pointer tracking-tight"
          >
            Resource
          </button>
        </div>

        {/* Right CTA Pill: High-Contrast White Capsule */}
        <button
          type="button"
          onClick={onLaunchDemo}
          className="h-10 sm:h-11 px-5 sm:px-6 rounded-full bg-white hover:bg-zinc-100 text-black font-semibold text-[13px] sm:text-[13.5px] tracking-tight transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shrink-0 shadow-sm cursor-pointer flex items-center justify-center whitespace-nowrap"
          title="Launch Live Demo (sales@agora.io)"
        >
          <span className="hidden sm:inline">{ctaText}</span>
          <span className="sm:hidden">Demo</span>
        </button>
      </nav>
    </header>
  );
};
