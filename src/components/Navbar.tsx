"use client";

import { Zap, Activity, Code2, RefreshCw } from "lucide-react";
import type { ChannelStats } from "@/types";

interface NavbarProps {
  connectionStats?: ChannelStats;
  onReset: () => void;
  onOpenJson: () => void;
  isCallActive: boolean;
}

export default function Navbar({ onReset, onOpenJson }: NavbarProps) {
  return (
    <header className="finesse-header">
      <div className="brand-section">
        <div className="brand-glyph">E</div>
        <div className="brand-title-box">
          <h1>EchoSphere</h1>
          <span className="finesse-badge">SALES AGENT</span>
        </div>

        <div className="team-pill">
          Agora Hackathon 2026 &bull; Team <strong>Venom</strong> (Gargie &amp; Harsh)
        </div>
      </div>

      <div className="header-meta-strip">
        <div className="telemetry-capsule">
          <div className="flex-row items-center gap-1">
            <span className="pulse-dot-green"></span>
            <span>Agora SD-RTN</span>
          </div>
          <span className="telemetry-sep"></span>
          <div className="flex-row items-center gap-1" style={{ color: "var(--lime)" }}>
            <Zap size={11} />
            <span>&lt;800ms</span>
          </div>
          <span className="telemetry-sep"></span>
          <div className="flex-row items-center gap-1">
            <Activity size={11} />
            <span>Loss 0.02%</span>
          </div>
        </div>

        <button className="btn-finesse-ghost" onClick={onOpenJson} title="View Live State Machine">
          <Code2 size={13} />
          <span>JSON State</span>
        </button>

        <button className="btn-finesse-ghost" onClick={onReset} title="Reset Conversation Session">
          <RefreshCw size={13} />
          <span>Reset</span>
        </button>
      </div>
    </header>
  );
}
