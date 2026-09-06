'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface MovingBorderButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  duration?: number; // duration in seconds, default 3
  borderWidth?: number; // in pixels, default 2
  variant?: 'white' | 'terracotta';
  glowClassName?: string;
  faceClassName?: string;
  asChild?: boolean;
}

const GLOW_GRADIENTS = {
  white:
    'conic-gradient(from 0deg, transparent 0deg, transparent 170deg, rgba(255, 255, 255, 1) 260deg, rgba(180, 200, 255, 1) 280deg, transparent 340deg, transparent 360deg)',
  terracotta:
    'conic-gradient(from 0deg, transparent 0deg, transparent 170deg, rgba(255, 255, 255, 1) 260deg, rgba(217, 119, 87, 1) 280deg, transparent 340deg, transparent 360deg)',
};

export const MovingBorderButton = React.forwardRef<
  HTMLButtonElement,
  MovingBorderButtonProps
>(
  (
    {
      children,
      className,
      duration = 3,
      borderWidth = 2,
      variant = 'white',
      glowClassName,
      faceClassName,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'group relative inline-flex items-center justify-center h-12 rounded-full overflow-hidden cursor-pointer border-0 bg-transparent transition-transform active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60',
          className,
        )}
        style={{ padding: `${borderWidth}px` }}
        {...props}
      >
        {/* Moving glowing gradient border */}
        <span
          aria-hidden="true"
          className={cn(
            'absolute inset-[-150%] pointer-events-none will-change-transform',
            glowClassName,
          )}
          style={{
            background: GLOW_GRADIENTS[variant] || GLOW_GRADIENTS.white,
            animation: `spin ${duration}s linear infinite`,
          }}
        />

        {/* Inner button face */}
        <span
          className={cn(
            'relative z-10 inline-flex h-full w-full items-center justify-center gap-2.5 px-8 rounded-full text-sm font-medium text-zinc-300 transition-colors group-hover:text-white',
            faceClassName,
          )}
          style={{
            background: 'linear-gradient(180deg, #1c1c1f 0%, #0a0a0b 60%)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08)',
          }}
        >
          {children}
        </span>
      </button>
    );
  },
);

MovingBorderButton.displayName = 'MovingBorderButton';

export default MovingBorderButton;
