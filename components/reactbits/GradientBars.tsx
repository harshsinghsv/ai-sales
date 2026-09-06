'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GradientBarsProps {
  barCount?: number;
  className?: string;
}

export const GradientBars: React.FC<GradientBarsProps> = ({
  barCount = 28,
  className = '',
}) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}>
      {/* Deep Obsidian Base */}
      <div className="absolute inset-0 bg-[#0A070D]" />

      {/* Atmospheric Radial Backlight */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-[75%] rounded-[100%] opacity-40 blur-[130px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at bottom, rgba(217,119,87,0.7) 0%, rgba(185,28,28,0.4) 40%, transparent 80%)',
        }}
      />

      {/* Vertical Luminous Gradient Bars Container */}
      <div className="absolute inset-x-0 bottom-0 h-[65%] flex items-end justify-center gap-1 sm:gap-2 px-2 max-w-7xl mx-auto opacity-75">
        {Array.from({ length: barCount }).map((_, i) => {
          // Calculate bell curve height for centered radiant arch
          const centerDist = Math.abs(i - barCount / 2) / (barCount / 2);
          const baseHeightPct = Math.max(25, 100 - centerDist * 65);
          const delay = (i % 7) * 0.15;
          const duration = 3.5 + (i % 5) * 0.4;

          return (
            <motion.div
              key={i}
              initial={{ height: `${baseHeightPct * 0.85}%`, opacity: 0.6 }}
              animate={{
                height: [
                  `${baseHeightPct * 0.8}%`,
                  `${baseHeightPct * 1.05}%`,
                  `${baseHeightPct * 0.85}%`,
                ],
                opacity: [0.55, 0.9, 0.55],
              }}
              transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="flex-1 min-w-[4px] sm:min-w-[8px] max-w-[28px] rounded-t-lg relative"
              style={{
                background: `linear-gradient(to top, 
                  rgba(217, 119, 87, 0.95) 0%, 
                  rgba(234, 88, 12, 0.75) 20%, 
                  rgba(185, 28, 28, 0.4) 50%, 
                  rgba(10, 7, 13, 0) 100%)`,
                boxShadow: i % 3 === 0 ? '0 0 15px rgba(217, 119, 87, 0.25)' : 'none',
              }}
            >
              {/* Inner subtle glow line */}
              <div className="absolute inset-x-0 top-0 h-1 bg-white/25 rounded-t-lg" />
            </motion.div>
          );
        })}
      </div>

      {/* Top and Bottom Fog Overlays for Cinematic Blending */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#0A070D] via-[#0A070D]/80 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0A070D] via-[#0A070D]/60 to-transparent pointer-events-none" />
    </div>
  );
};
