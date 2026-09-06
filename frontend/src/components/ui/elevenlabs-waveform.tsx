'use client';

import React, { useEffect, useRef } from 'react';

interface ElevenLabsWaveformProps {
  active?: boolean;
  volume?: number;
  barColor?: string;
  barCount?: number;
  height?: number;
  className?: string;
}

export const ElevenLabsWaveform: React.FC<ElevenLabsWaveformProps> = ({
  active = true,
  volume = 0,
  barColor = '#CADCFC',
  barCount = 28,
  height = 36,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const barsRef = useRef<number[]>(new Array(barCount).fill(0.08));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const render = () => {
      time += 0.08;
      const targetVol = active ? Math.max(0.08, volume) : 0.05;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      const barWidth = 2.5;
      const totalWidth = barCount * 5;
      const startX = (w - totalWidth) / 2;

      for (let i = 0; i < barCount; i++) {
        const centerDist = Math.abs(i - barCount / 2) / (barCount / 2);
        const envelope = Math.cos(centerDist * Math.PI * 0.5);

        const wave = Math.sin(time * 3.0 + i * 0.4) * 0.35 + 0.65;
        const targetHeight = active
          ? Math.max(0.1, targetVol * wave * envelope * 0.95 + 0.08)
          : 0.08 + Math.sin(time + i * 0.2) * 0.03;

        barsRef.current[i] += (targetHeight - barsRef.current[i]) * 0.25;
        const currentBarH = Math.max(3, barsRef.current[i] * h * 0.85);

        const x = startX + i * 5;
        const y = (h - currentBarH) / 2;

        const alpha = Math.max(0.2, (1 - centerDist * 0.65) * (active ? 0.9 : 0.3));
        ctx.fillStyle = barColor;
        ctx.globalAlpha = alpha;

        // Draw rounded capsule bar
        ctx.beginPath();
        const r = barWidth / 2;
        ctx.roundRect(x, y, barWidth, currentBarH, r);
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [active, volume, barColor, barCount]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        width={160}
        height={height}
        style={{ width: '160px', height: `${height}px` }}
        className="pointer-events-none"
      />
    </div>
  );
};
