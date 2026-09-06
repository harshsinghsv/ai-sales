'use client';

import React, { useEffect, useRef, memo } from 'react';

interface DotFieldProps {
  dotRadius?: number;
  dotSpacing?: number;
  cursorRadius?: number;
  cursorForce?: number;
  glowRadius?: number;
  gradientFrom?: string;
  gradientTo?: string;
  className?: string;
}

export const DotField: React.FC<DotFieldProps> = memo(({
  dotRadius = 1.4,
  dotSpacing = 16,
  cursorRadius = 450,
  cursorForce = 0.18,
  glowRadius = 180,
  gradientFrom = 'rgba(217, 119, 87, 0.35)',
  gradientTo = 'rgba(245, 158, 11, 0.15)',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    interface Dot {
      ox: number;
      oy: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
    }

    let dots: Dot[] = [];
    let width = 0;
    let height = 0;

    const mouse = {
      x: -9999,
      y: -9999,
      targetX: -9999,
      targetY: -9999,
      active: false,
    };

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Rebuild dots
      dots = [];
      const step = dotSpacing + dotRadius * 2;
      const cols = Math.ceil(width / step);
      const rows = Math.ceil(height / step);
      const offsetX = (width - cols * step) / 2;
      const offsetY = (height - rows * step) / 2;

      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          const ox = offsetX + c * step;
          const oy = offsetY + r * step;
          dots.push({
            ox,
            oy,
            x: ox,
            y: oy,
            vx: 0,
            vy: 0,
          });
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.active = true;
    };

    const handlePointerLeave = () => {
      mouse.active = false;
      mouse.targetX = -9999;
      mouse.targetY = -9999;
    };

    window.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerleave', handlePointerLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse tracking
      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;

      // Draw subtle cursor radial glow
      if (mouse.active && mouse.x > 0 && mouse.x < width && mouse.y > 0 && mouse.y < height) {
        const glow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          glowRadius
        );
        glow.addColorStop(0, gradientFrom);
        glow.addColorStop(0.5, gradientTo);
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(
          mouse.x - glowRadius,
          mouse.y - glowRadius,
          glowRadius * 2,
          glowRadius * 2
        );
      }

      // Physics update and render dots
      ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        if (mouse.active) {
          const dx = dot.x - mouse.x;
          const dy = dot.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          const cursorRadiusSq = cursorRadius * cursorRadius;

          if (distSq < cursorRadiusSq && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const factor = (1 - dist / cursorRadius) * cursorForce * 12;
            dot.vx += (dx / dist) * factor;
            dot.vy += (dy / dist) * factor;
          }
        }

        // Spring return to original position
        const springX = (dot.ox - dot.x) * 0.08;
        const springY = (dot.oy - dot.y) * 0.08;
        dot.vx = (dot.vx + springX) * 0.86;
        dot.vy = (dot.vy + springY) * 0.86;

        dot.x += dot.vx;
        dot.y += dot.vy;

        // Render dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [dotRadius, dotSpacing, cursorRadius, cursorForce, glowRadius, gradientFrom, gradientTo]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
});

DotField.displayName = 'DotField';
