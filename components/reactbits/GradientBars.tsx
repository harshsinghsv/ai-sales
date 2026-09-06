'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GradientBarsProps {
  barCount?: number;
  className?: string;
}

export const GradientBars: React.FC<GradientBarsProps> = ({
  barCount = 16,
  className = '',
}) => {
  // Waleed Kibhen's 21st.dev U-shaped concave height curve:
  // Tallest on edges (100%), lowest in center (28%), creating a dramatic luminous stage for the hero typography
  const calculateHeight = (index: number, total: number) => {
    const normalized = index / (total - 1);
    const maxH = 100;
    const minH = 28;
    const distFromCenter = Math.abs(normalized - 0.5);
    const curve = Math.pow(distFromCenter * 2, 1.25);
    return minH + (maxH - minH) * curve;
  };

  return (
    <div className={`absolute inset-0 z-0 overflow-hidden pointer-events-none select-none ${className}`}>
      {/* Deep Obsidian Base */}
      <div className="absolute inset-0 bg-[#0A070D]" />

      {/* Atmospheric Ambient Backlight Glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] h-[75%] rounded-[100%] opacity-40 blur-[130px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at bottom, rgba(217,119,87,0.7) 0%, rgba(185,28,28,0.35) 45%, transparent 80%)',
        }}
      />

      {/* Vertical Luminous Gradient Bars Container */}
      <div
        className="flex h-full absolute inset-0 items-end"
        style={{
          width: '100%',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
        }}
      >
        {Array.from({ length: barCount }).map((_, i) => {
          const height = calculateHeight(i, barCount);
          const scale = height / 100;

          return (
            <motion.div
              key={i}
              initial={{ scaleY: scale * 0.9, opacity: 0.7 }}
              animate={{
                scaleY: [scale * 0.88, scale * 1.1, scale * 0.88],
                opacity: [0.65, 0.92, 0.65],
              }}
              transition={{
                duration: 2.2 + (i % 4) * 0.25,
                delay: i * 0.08,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                flex: `1 0 calc(100% / ${barCount})`,
                maxWidth: `calc(100% / ${barCount})`,
                height: '100%',
                background:
                  'linear-gradient(to top, rgba(217, 119, 87, 0.95) 0%, rgba(234, 88, 12, 0.65) 25%, rgba(185, 28, 28, 0.3) 55%, transparent 95%)',
                transformOrigin: 'bottom',
                boxSizing: 'border-box',
                borderRight: '1px solid rgba(0, 0, 0, 0.4)',
              }}
            />
          );
        })}
      </div>

      {/* Top and Bottom Fog Overlays for Seamless Blending */}
      <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#0A070D] via-[#0A070D]/80 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0A070D] via-[#0A070D]/70 to-transparent pointer-events-none" />
    </div>
  );
};
