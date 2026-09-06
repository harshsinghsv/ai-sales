'use client';

import React from 'react';

type ButtonVariant = 'primary' | 'violet' | 'outline' | 'white' | 'ghost' | 'claude';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  arrow?: boolean;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

/* No shadows anywhere — definition comes from a border + background swap on
   hover, matching the reference site's flat pill-button language. */
const VARIANT_CLASSES: Record<ButtonVariant, { base: string; icon: string }> = {
  primary: {
    base: 'bg-ink text-white border-ink hover:bg-black hover:border-black',
    icon: 'bg-white text-ink',
  },
  claude: {
    base: 'bg-[#D97757] text-white border-[#D97757] hover:bg-[#C66443] hover:border-[#C66443]',
    icon: 'bg-white text-[#D97757]',
  },
  violet: {
    base: 'bg-violet text-white border-violet hover:bg-violethover hover:border-violethover',
    icon: 'bg-white text-violet',
  },
  outline: {
    base: 'bg-transparent text-ink border-border hover:bg-ink hover:text-white hover:border-ink',
    icon: 'bg-soft text-ink group-hover:bg-white group-hover:text-ink',
  },
  white: {
    base: 'bg-white text-ink border-border hover:bg-soft',
    icon: 'bg-ink text-white',
  },
  ghost: {
    base: 'bg-transparent text-secondary border-transparent hover:text-ink hover:bg-soft',
    icon: 'bg-soft text-ink group-hover:bg-white group-hover:text-ink',
  },
};

const SIZE_CLASSES: Record<
  ButtonSize,
  { base: string; icon: string; svg: string; padRest: string; padHover: string }
> = {
  sm: {
    base: 'py-[5px] text-[13px]',
    icon: 'h-[26px] w-[26px]',
    svg: 'h-3 w-3',
    padRest: 'pl-4 pr-[6px]',
    padHover: 'pl-[6px] pr-4',
  },
  md: {
    base: 'py-[7px] text-sm',
    icon: 'h-8 w-8',
    svg: 'h-[15px] w-[15px]',
    padRest: 'pl-[18px] pr-[7px]',
    padHover: 'pl-[7px] pr-[18px]',
  },
  lg: {
    base: 'py-[9px] text-[15px]',
    icon: 'h-[38px] w-[38px]',
    svg: 'h-[17px] w-[17px]',
    padRest: 'pl-[22px] pr-[9px]',
    padHover: 'pl-[9px] pr-[22px]',
  },
};

function ArrowIcon({ className }: { className: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function Button({
  children,
  onClick,
  href,
  variant = 'primary',
  size = 'md',
  arrow = true,
  className = '',
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const v = VARIANT_CLASSES[variant];
  const s = SIZE_CLASSES[size];

  const rootClass = [
    'group inline-flex items-center rounded-pill border font-medium tracking-[-0.01em] whitespace-nowrap cursor-pointer transition-colors duration-300 select-none',
    v.base,
    s.base,
    disabled ? 'opacity-50 pointer-events-none' : '',
    className,
  ].join(' ');

  const swapEase = 'transition-all duration-[350ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]';
  const childEase = 'transition-transform duration-[350ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]';
  const circleClass = `inline-flex items-center justify-center rounded-full shrink-0 ${v.icon} ${s.icon}`;

  const content = arrow ? (
    <span className="relative inline-flex">
      <span className={`flex items-center gap-3 opacity-100 ${s.padRest} ${swapEase} group-hover:opacity-0`}>
        <span className={`${childEase} group-hover:translate-x-5`}>{children}</span>
        <span className={`${circleClass} ${childEase} group-hover:-translate-x-5`}>
          <ArrowIcon className={s.svg} />
        </span>
      </span>
      <span
        aria-hidden="true"
        className={`absolute inset-0 flex items-center gap-3 opacity-0 pointer-events-none ${s.padHover} ${swapEase} group-hover:opacity-100`}
      >
        <span className={`${circleClass} ${childEase} translate-x-5 group-hover:translate-x-0`}>
          <ArrowIcon className={s.svg} />
        </span>
        <span className={`${childEase} -translate-x-5 group-hover:translate-x-0`}>{children}</span>
      </span>
    </span>
  ) : (
    <span className={s.padRest}>{children}</span>
  );

  if (href) {
    return (
      <a href={href} className={rootClass}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} className={rootClass} onClick={onClick} disabled={disabled}>
      {content}
    </button>
  );
}
