"use client";

import { useEffect, useRef } from "react";

interface MomentumChartProps {
  trend?: number[];
  currentScore?: number;
}

export default function MomentumChart({ trend = [50, 52], currentScore = 52 }: MomentumChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const padding = { top: 12, right: 20, bottom: 18, left: 30 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    ctx.strokeStyle = "rgba(15, 23, 42, 0.08)";
    ctx.lineWidth = 1;

    [25, 50, 75, 100].forEach((val) => {
      const y = padding.top + chartH - (val / 100) * chartH;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = "#64748b";
      ctx.font = "9.5px monospace";
      ctx.fillText(`${val}%`, 4, y + 3);
    });

    if (trend.length < 2) return;

    const points = trend.map((val, idx) => {
      const x = padding.left + (idx / (trend.length - 1)) * chartW;
      const y = padding.top + chartH - (val / 100) * chartH;
      return { x, y, val };
    });

    const areaGrad = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    areaGrad.addColorStop(0, "rgba(186, 248, 55, 0.4)");
    areaGrad.addColorStop(1, "rgba(186, 248, 55, 0.0)");

    ctx.beginPath();
    ctx.moveTo(points[0].x, height - padding.bottom);
    ctx.lineTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cx = (prev.x + curr.x) / 2;
      ctx.bezierCurveTo(cx, prev.y, cx, curr.y, curr.x, curr.y);
    }

    ctx.lineTo(points[points.length - 1].x, height - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = areaGrad;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cx = (prev.x + curr.x) / 2;
      ctx.bezierCurveTo(cx, prev.y, cx, curr.y, curr.x, curr.y);
    }

    ctx.strokeStyle = "#4d7c0f";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    points.forEach((pt, index) => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, index === points.length - 1 ? 4.5 : 3, 0, Math.PI * 2);
      ctx.fillStyle = index === points.length - 1 ? "#4d7c0f" : "#ffffff";
      ctx.fill();
      ctx.strokeStyle = "#4d7c0f";
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }, [trend, currentScore]);

  return <canvas ref={canvasRef} width={460} height={110} className="momentum-canvas-display" />;
}
