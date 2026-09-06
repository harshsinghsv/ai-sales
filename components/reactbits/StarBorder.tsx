'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface StarBorderProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  color?: string;
  speed?: string;
  children?: React.ReactNode;
}

export const StarBorder: React.FC<StarBorderProps> = ({
  className = '',
  color = '#D97757',
  speed = '4s',
  children,
  ...props
}) => {
  return (
    <button
      className={cn(
        'relative inline-block p-[1.5px] overflow-hidden rounded-2xl cursor-pointer group shadow-lg',
        className
      )}
      {...props}
    >
      <div
        className="absolute w-[300%] h-[50%] opacity-80 bottom-[-11px] right-[-250%] rounded-full animate-spin-around pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 60%)`,
          animationDuration: speed,
        }}
      />
      <div
        className="absolute w-[300%] h-[50%] opacity-80 top-[-10px] left-[-250%] rounded-full animate-spin-around pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 60%)`,
          animationDuration: speed,
        }}
      />
      <div className="relative z-10 bg-[#141413] hover:bg-[#201F1D] text-white text-center rounded-[inherit] py-3.5 px-6 font-semibold text-sm transition-colors flex items-center justify-center gap-2">
        {children}
      </div>
    </button>
  );
};
