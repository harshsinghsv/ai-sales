'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type CardNavLink = {
  label: string;
  href: string;
  ariaLabel: string;
  onClick?: () => void;
};

export type CardNavItem = {
  label: string;
  bgColor: string;
  textColor: string;
  links: CardNavLink[];
};

export interface CardNavProps {
  logoText?: string;
  items: CardNavItem[];
  className?: string;
  baseColor?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  onCtaClick?: () => void;
  ctaText?: string;
}

export const CardNav: React.FC<CardNavProps> = ({
  logoText = 'Agora',
  items,
  className = '',
  baseColor = '#120F17',
  menuColor = '#ffffff',
  buttonBgColor = '#D97757',
  buttonTextColor = '#ffffff',
  onCtaClick,
  ctaText = 'Experience Demo',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('pointerdown', handleOutsideClick);
    }
    return () => document.removeEventListener('pointerdown', handleOutsideClick);
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(prev => !prev);

  return (
    <div
      ref={containerRef}
      className={`fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 w-[92%] max-w-[860px] z-50 pointer-events-auto transition-all ${className}`}
    >
      <motion.nav
        animate={{
          height: isOpen ? 'auto' : 62,
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="block rounded-2xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl relative overflow-hidden"
        style={{ backgroundColor: baseColor }}
      >
        {/* Top Navbar Row */}
        <div className="h-[62px] px-4 sm:px-6 flex items-center justify-between relative z-10">
          {/* Hamburger Menu Toggle Button */}
          <button
            type="button"
            onClick={toggleMenu}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors duration-200"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            style={{ color: menuColor }}
          >
            <span
              className={`w-5 h-[2px] bg-current transition-all duration-300 ${
                isOpen ? 'translate-y-[4px] rotate-45' : ''
              }`}
            />
            <span
              className={`w-5 h-[2px] bg-current transition-all duration-300 ${
                isOpen ? '-translate-y-[4px] -rotate-45' : ''
              }`}
            />
          </button>

          {/* Centered Logo */}
          <div className="flex items-center gap-2 select-none">
            <span className="text-[#D97757] text-2xl font-bold leading-none animate-pulse">
              ✻
            </span>
            <span className="font-sans font-bold text-base sm:text-lg tracking-tight text-white">
              {logoText}
            </span>
            <span className="text-white/20 text-xs hidden sm:inline">/</span>
            <span className="text-xs text-white/60 font-mono hidden sm:inline">
              Voice Sales Agent
            </span>
          </div>

          {/* Right Action Button */}
          <button
            type="button"
            onClick={onCtaClick}
            className="px-4 py-2 rounded-xl text-xs font-semibold shadow-[0_0_20px_rgba(217,119,87,0.35)] transition-all duration-200 cursor-pointer hover:brightness-110 active:scale-95 flex items-center gap-1.5"
            style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
          >
            <span>{ctaText}</span>
          </button>
        </div>

        {/* Expandable Cards Content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="px-3 pb-3 sm:px-4 sm:pb-4 pt-1 flex flex-col md:flex-row items-stretch gap-3 md:gap-3.5"
            >
              {(items || []).map((item, idx) => (
                <motion.div
                  key={`${item.label}-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06, duration: 0.3 }}
                  className="flex-1 rounded-xl p-4 sm:p-5 flex flex-col justify-between border border-white/10 shadow-lg min-h-[140px] md:min-h-[160px] transition-transform hover:-translate-y-0.5"
                  style={{ backgroundColor: item.bgColor, color: item.textColor }}
                >
                  <div className="font-sans font-semibold text-lg sm:text-xl tracking-tight mb-4">
                    {item.label}
                  </div>
                  <div className="flex flex-col gap-2 mt-auto">
                    {item.links?.map((lnk, i) => (
                      <a
                        key={`${lnk.label}-${i}`}
                        href={lnk.href}
                        onClick={() => {
                          setIsOpen(false);
                          lnk.onClick?.();
                        }}
                        aria-label={lnk.ariaLabel}
                        className="inline-flex items-center justify-between text-xs sm:text-sm text-white/80 hover:text-white transition-colors duration-200 group no-underline"
                      >
                        <span className="font-mono text-xs">{lnk.label}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
};
