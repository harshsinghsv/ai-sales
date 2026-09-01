"use client";

import { PhoneCall, BrainCircuit, Code2, RefreshCw } from "lucide-react";

interface IconRailProps {
  onOpenJson: () => void;
  onReset: () => void;
  onScrollToCall: () => void;
  onScrollToIntelligence: () => void;
  isCallActive: boolean;
}

export default function IconRail({ onOpenJson, onReset, onScrollToCall, onScrollToIntelligence, isCallActive }: IconRailProps) {
  return (
    <nav className="icon-rail" aria-label="Primary">
      <div className="rail-brand" title="EchoSphere">
        E
      </div>
      <div className="rail-divider" />

      <button className="rail-btn" onClick={onScrollToCall} title="Call Studio">
        <PhoneCall size={17} />
      </button>
      <button className="rail-btn" onClick={onScrollToIntelligence} title="Deal Intelligence">
        <BrainCircuit size={17} />
      </button>

      <div className="rail-spacer" />

      <button className="rail-btn accent" onClick={onOpenJson} title="View Live State Machine">
        <Code2 size={17} />
      </button>
      <button className="rail-btn accent" onClick={onReset} title="Reset Session">
        <RefreshCw size={17} />
      </button>

      <div className="rail-status" title={isCallActive ? "Agora SD-RTN: live channel connected" : "Agora SD-RTN: ready"}>
        <span className="rail-status-dot" />
      </div>
    </nav>
  );
}
