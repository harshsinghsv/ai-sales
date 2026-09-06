'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface BlurTextProps {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  highlightWord?: string;
  highlightClass?: string;
}

export const BlurText: React.FC<BlurTextProps> = ({
  text = '',
  delay = 60,
  className = '',
  animateBy = 'words',
  direction = 'top',
  highlightWord = '',
  highlightClass = 'text-[#D97757] italic',
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');

  const defaultFrom =
    direction === 'top'
      ? { filter: 'blur(12px)', opacity: 0, y: -24 }
      : { filter: 'blur(12px)', opacity: 0, y: 24 };

  const defaultTo = { filter: 'blur(0px)', opacity: 1, y: 0 };

  return (
    <span className={`inline-block ${className}`}>
      {elements.map((element, index) => {
        const isHighlight = highlightWord && element.toLowerCase().includes(highlightWord.toLowerCase());
        return (
          <motion.span
            key={index}
            initial={defaultFrom}
            animate={defaultTo}
            transition={{
              duration: 0.6,
              delay: (index * delay) / 1000,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className={`inline-block whitespace-pre ${isHighlight ? highlightClass : ''}`}
          >
            {element}
            {animateBy === 'words' && index < elements.length - 1 && ' '}
          </motion.span>
        );
      })}
    </span>
  );
};
