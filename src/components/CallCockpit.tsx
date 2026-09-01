"use client";

import { useRef, useEffect } from "react";
import { Mic, MicOff, PhoneCall, PhoneOff, Radio, Sparkles, Volume2, ShieldAlert, Headphones } from "lucide-react";
import VoiceOrb from "./VoiceOrb";
import type { TranscriptMessage } from "@/types";

interface BenchmarkScenario {
  id: string;
  key: string;
  icon: string;
  phase: string;
  title: string;
  prompt: string;
}

const BENCHMARK_SCENARIOS: BenchmarkScenario[] = [
  {
    id: "scen_1",
    key: "1",
    icon: "\u{1F4B0}",
    phase: "Discovery",
    title: "50-Seat Pricing Inquiry",
    prompt: "How much does EchoSphere cost for a 50-seat SDR team?"
  },
  {
    id: "scen_2",
    key: "2",
    icon: "\u{26A1}",
    phase: "Barge-in",
    title: "Interrupt: Compare vs Vapi",
    prompt: "Wait, how is this different from Vapi or traditional bots?"
  },
  {
    id: "scen_3",
    key: "3",
    icon: "\u{1F4C8}",
    phase: "Scale Pivot",
    title: "Pivot: Scaled to 200 Seats",
    prompt: "Actually, we just scaled. We need it for 200 users, not 50."
  },
  {
    id: "scen_4",
    key: "4",
    icon: "\u{1F6E1}",
    phase: "Negotiation",
    title: "Budget Pushback",
    prompt: "That's slightly above our quarterly software budget."
  },
  {
    id: "scen_5",
    key: "5",
    icon: "\u{1F4C5}",
    phase: "Calendar API",
    title: "Book Executive Demo",
    prompt: "Can we schedule an enterprise demo with our executive team?"
  },
  {
    id: "scen_6",
    key: "6",
    icon: "\u{1F91D}",
    phase: "Warm Handoff",
    title: "Escalate to Human Rep",
    prompt: "I'd like to speak with an enterprise account director about custom MSA terms."
  }
];

interface CallCockpitProps {
  isCallActive: boolean;
  isMuted: boolean;
  isSpeaking: boolean;
  isAgentSpeaking: boolean;
  audioLevel: number;
  transcript: TranscriptMessage[];
  bargeInTriggered: boolean;
  callDuration?: string;
  onToggleCall: () => void;
  onToggleMute: () => void;
  onExecuteScenario: (prompt: string) => void;
}

export default function CallCockpit({
  isCallActive,
  isMuted,
  isSpeaking,
  isAgentSpeaking,
  audioLevel,
  transcript,
  bargeInTriggered,
  onToggleCall,
  onToggleMute,
  onExecuteScenario,
  callDuration = "00:00"
}: CallCockpitProps) {
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  return (
    <div className="call-studio-layout">
      {/* 1. Active Voice Calling Stage */}
      <div className="voice-stage-card">
        <div className="caller-profile-header">
          <div className="caller-main-identity">
            <div className="caller-avatar-circle">
              <span>RS</span>
              <span className={`caller-live-indicator ${isCallActive ? "online" : ""}`}></span>
            </div>
            <div className="caller-text-meta">
              <div className="caller-name-row">
                <h3>Rahul Sharma</h3>
                <span className="caller-role-chip">CTO &bull; Decision Maker</span>
              </div>
              <span className="caller-org">TechCorp Solutions &bull; Inbound Voice Lead</span>
            </div>
          </div>

          <div className="caller-header-right">
            <div className="agora-telemetry-pill">
              <Radio size={11} className="text-lime" />
              <span>Agora SD-RTN 48kHz</span>
            </div>

            <div className={`call-timer-pill ${isCallActive ? "active" : ""}`}>
              <span className="timer-dot"></span>
              <span>{isCallActive ? `LIVE ${callDuration}` : "STANDBY"}</span>
            </div>
          </div>
        </div>

        <div className="orb-center-stage">
          <VoiceOrb
            isActive={isCallActive}
            isAgentSpeaking={isAgentSpeaking}
            isSpeaking={isSpeaking}
            volume={audioLevel}
            bargeIn={bargeInTriggered}
            size={180}
          />

          <div className="orb-status-display">
            {bargeInTriggered ? (
              <div className="speaker-bubble interrupted">
                <ShieldAlert size={14} />
                <span>Barge-in Interruption Caught (88ms Cutoff)</span>
              </div>
            ) : isAgentSpeaking ? (
              <div className="speaker-bubble agent">
                <Volume2 size={14} />
                <span>EchoSphere AI Speaking (Streaming Audio)</span>
              </div>
            ) : isSpeaking ? (
              <div className="speaker-bubble user">
                <Mic size={14} />
                <span>Rahul Sharma Speaking (Deepgram VAD)</span>
              </div>
            ) : isCallActive ? (
              <div className="speaker-bubble active">
                <span className="dot-green"></span>
                <span>Active Agora Session &bull; Awaiting Speech</span>
              </div>
            ) : (
              <div className="speaker-bubble standby">
                <span>Channel Ready &bull; Join Call or Trigger a Scenario Below</span>
              </div>
            )}
          </div>
        </div>

        <div className="hardware-phone-toolbar">
          <button className={`btn-phone-toggle ${isCallActive ? "hangup" : "dial"}`} onClick={onToggleCall}>
            {isCallActive ? <PhoneOff size={16} /> : <PhoneCall size={16} />}
            <span>{isCallActive ? "Disconnect Channel" : "Connect Live Microphone"}</span>
          </button>

          <button
            className={`btn-phone-mute ${isMuted ? "muted" : ""}`}
            onClick={onToggleMute}
            disabled={!isCallActive}
            title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
          >
            {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
        </div>
      </div>

      {/* 2. Interactive Conversation Simulator Grid */}
      <div className="sim-deck-container">
        <div className="sim-deck-header">
          <div className="flex-row items-center gap-2">
            <Sparkles size={14} className="text-lime" />
            <span className="sim-deck-title">Interactive Turn Simulator</span>
          </div>
          <span className="sim-deck-hint">Click a turn to speak as the prospect &amp; observe AI reasoning</span>
        </div>

        <div className="sim-buttons-grid">
          {BENCHMARK_SCENARIOS.map((scen) => (
            <button key={scen.id} className="sim-card-btn" onClick={() => onExecuteScenario(scen.prompt)}>
              <div className="sim-card-top">
                <div className="flex-row items-center gap-1">
                  <span>{scen.icon}</span>
                  <span className="font-mono text-lime" style={{ fontSize: "10px", fontWeight: 700 }}>
                    Turn {scen.key}
                  </span>
                </div>
                <span className="sim-phase-tag">{scen.phase}</span>
              </div>
              <div className="sim-card-title">{scen.title}</div>
              <div className="sim-card-text">&ldquo;{scen.prompt}&rdquo;</div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Live Dialogue Intelligence Stream */}
      <div className="dialogue-card-container">
        <div className="dialogue-top-bar">
          <div className="flex-row items-center gap-2">
            <Headphones size={13} className="text-lime" />
            <span className="dialogue-heading">Live Conversation Intelligence</span>
          </div>
          <span className="font-mono text-muted" style={{ fontSize: "11px" }}>
            {transcript.length} turns recorded
          </span>
        </div>

        <div className="dialogue-messages-scroll">
          {transcript.map((msg, idx) => (
            <div key={idx} className={`dialogue-message-item ${msg.sender}`}>
              <div className="dialogue-author-avatar">{msg.sender === "user" ? "RS" : "AI"}</div>
              <div className="dialogue-content-box">
                <div className="dialogue-meta-info">
                  <span className="author-name">{msg.sender === "user" ? "Rahul Sharma (CTO)" : "EchoSphere AI SDR"}</span>
                  <span className="message-timestamp">{msg.time}</span>
                  {msg.intent && <span className="message-intent-badge">{msg.intent}</span>}
                </div>
                <div className="message-text-body">{msg.text}</div>
              </div>
            </div>
          ))}
          <div ref={transcriptEndRef} />
        </div>
      </div>
    </div>
  );
}
