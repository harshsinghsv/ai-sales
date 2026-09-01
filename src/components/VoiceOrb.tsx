"use client";

import { useEffect, useRef } from "react";

interface VoiceOrbProps {
  isActive?: boolean;
  isAgentSpeaking?: boolean;
  isSpeaking?: boolean;
  volume?: number;
  bargeIn?: boolean;
  size?: number;
}

export default function VoiceOrb({
  isActive = false,
  isAgentSpeaking = false,
  isSpeaking = false,
  volume = 0,
  bargeIn = false,
  size = 220
}: VoiceOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let phase = 0;
    const numPoints = 64;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      ctx.clearRect(0, 0, w, h);

      let baseRadius = size * 0.32;
      let energy = 0.25;

      if (bargeIn) {
        energy = 1.8;
        baseRadius = size * 0.42;
      } else if (isAgentSpeaking) {
        energy = 0.9 + Math.sin(phase * 4) * 0.45;
        baseRadius = size * 0.38;
      } else if (isSpeaking) {
        energy = 0.6 + (volume / 100) * 0.9;
        baseRadius = size * 0.36;
      } else if (isActive) {
        energy = 0.35 + Math.sin(phase * 1.8) * 0.12;
      }

      const haloGrad = ctx.createRadialGradient(cx, cy, baseRadius * 0.3, cx, cy, baseRadius * 2.5);
      if (bargeIn) {
        haloGrad.addColorStop(0, "rgba(244, 63, 94, 0.4)");
        haloGrad.addColorStop(0.5, "rgba(244, 63, 94, 0.1)");
        haloGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      } else if (isAgentSpeaking) {
        haloGrad.addColorStop(0, "rgba(186, 248, 55, 0.45)");
        haloGrad.addColorStop(0.4, "rgba(0, 240, 255, 0.2)");
        haloGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      } else if (isSpeaking) {
        haloGrad.addColorStop(0, "rgba(9, 157, 253, 0.5)");
        haloGrad.addColorStop(0.5, "rgba(16, 185, 129, 0.15)");
        haloGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      } else {
        haloGrad.addColorStop(0, "rgba(186, 248, 55, 0.2)");
        haloGrad.addColorStop(0.6, "rgba(9, 157, 253, 0.05)");
        haloGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      }
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 2.5, 0, Math.PI * 2);
      ctx.fill();

      if (isActive) {
        const ringCount = 3;
        for (let r = 1; r <= ringCount; r++) {
          const ringRadius = baseRadius * (1.1 + r * 0.28) + Math.sin(phase * 2 + r) * 6 * energy;
          ctx.beginPath();
          ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
          ctx.strokeStyle = isAgentSpeaking
            ? `rgba(186, 248, 55, ${0.35 / r})`
            : isSpeaking
            ? `rgba(9, 157, 253, ${0.4 / r})`
            : `rgba(15, 23, 42, ${0.08 / r})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }

      const blobLayers = 3;
      for (let layer = 0; layer < blobLayers; layer++) {
        ctx.beginPath();
        const layerOffset = layer * 1.6;
        const currentRadius = baseRadius + layer * 3;

        for (let i = 0; i <= numPoints; i++) {
          const angle = (i / numPoints) * Math.PI * 2;
          const wave1 = Math.sin(angle * 3 + phase * 2.5 + layerOffset) * (12 * energy);
          const wave2 = Math.cos(angle * 5 - phase * 1.8 - layerOffset) * (8 * energy);
          const wave3 = Math.sin(angle * 7 + phase * 3.2) * (4 * energy);
          const radius = currentRadius + wave1 + wave2 + wave3;

          const x = cx + Math.cos(angle) * radius;
          const y = cy + Math.sin(angle) * radius;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();

        const grad = ctx.createLinearGradient(cx - baseRadius, cy - baseRadius, cx + baseRadius, cy + baseRadius);

        if (bargeIn) {
          grad.addColorStop(0, "rgba(244, 63, 94, 0.85)");
          grad.addColorStop(1, "rgba(251, 146, 60, 0.7)");
        } else if (isAgentSpeaking) {
          grad.addColorStop(0, "rgba(186, 248, 55, 0.9)");
          grad.addColorStop(0.5, "rgba(0, 240, 255, 0.75)");
          grad.addColorStop(1, "rgba(16, 185, 129, 0.65)");
        } else if (isSpeaking) {
          grad.addColorStop(0, "rgba(9, 157, 253, 0.85)");
          grad.addColorStop(1, "rgba(16, 185, 129, 0.8)");
        } else {
          grad.addColorStop(0, "rgba(186, 248, 55, 0.6)");
          grad.addColorStop(1, "rgba(9, 157, 253, 0.4)");
        }

        ctx.fillStyle = grad;
        ctx.shadowColor = isAgentSpeaking ? "#baf837" : bargeIn ? "#f43f5e" : "#099dfd";
        ctx.shadowBlur = 20 * energy;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius * 0.6);
      coreGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
      coreGrad.addColorStop(0.4, "rgba(255, 255, 255, 0.5)");
      coreGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 0.6, 0, Math.PI * 2);
      ctx.fill();

      phase += isAgentSpeaking ? 0.06 : 0.025;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isActive, isAgentSpeaking, isSpeaking, volume, bargeIn, size]);

  return (
    <div style={{ position: "relative", width: `${size}px`, height: `${size}px`, margin: "0 auto" }}>
      <canvas
        ref={canvasRef}
        width={size * 2}
        height={size * 2}
        style={{ width: `${size}px`, height: `${size}px`, display: "block" }}
      />
    </div>
  );
}
