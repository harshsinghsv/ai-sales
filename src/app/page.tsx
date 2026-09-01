"use client";

import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import Navbar from "@/components/Navbar";
import IconRail from "@/components/IconRail";
import CallCockpit from "@/components/CallCockpit";
import StateCockpit from "@/components/StateCockpit";
import CalendarModal from "@/components/CalendarModal";
import HandoffModal from "@/components/HandoffModal";
import JsonStateModal from "@/components/JsonStateModal";

import { AgoraVoiceService } from "@/lib/agoraService";
import { ConversationStateEngine, INITIAL_CONVERSATION_STATE } from "@/lib/stateEngine";
import { NegotiationPlaybook } from "@/lib/negotiationPlaybook";
import { SpeechEngine } from "@/lib/speechEngine";
import { MockIntegrationService } from "@/lib/mockIntegrations";
import type { ConversationState, MeetingSlot, TranscriptMessage } from "@/types";

const GREETING: TranscriptMessage = {
  sender: "agent",
  text: "Hi Rahul, thanks for connecting with EchoSphere. I see you're evaluating voice AI options for TechCorp's outbound and inbound sales pipeline. How are your SDRs currently qualifying leads?",
  time: "10:14 AM",
  intent: "GREETING & DISCOVERY"
};

export default function Home() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [bargeInTriggered, setBargeInTriggered] = useState(false);
  const [callDuration, setCallDuration] = useState("00:00");

  const [state, setState] = useState<ConversationState>(INITIAL_CONVERSATION_STATE);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([GREETING]);
  const [crm, setCrm] = useState(() => new MockIntegrationService().crm);

  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isHandoffModalOpen, setIsHandoffModalOpen] = useState(false);
  const [calendarDetails, setCalendarDetails] = useState<MeetingSlot | null>(null);

  const agoraRef = useRef<AgoraVoiceService | null>(null);
  const stateEngineRef = useRef<ConversationStateEngine | null>(null);
  const playbookRef = useRef<NegotiationPlaybook | null>(null);
  const speechEngineRef = useRef<SpeechEngine | null>(null);
  const integrationRef = useRef<MockIntegrationService | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secondsElapsedRef = useRef(0);
  const callPanelRef = useRef<HTMLDivElement>(null);
  const statePanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stateEngine = new ConversationStateEngine();
    stateEngineRef.current = stateEngine;
    const unsub = stateEngine.subscribe((newState) => {
      setState(newState);
    });

    const playbook = new NegotiationPlaybook(stateEngine);
    playbookRef.current = playbook;

    const integration = new MockIntegrationService();
    integrationRef.current = integration;
    setCrm(integration.crm);

    const speechEngine = new SpeechEngine({
      onUserTranscript: ({ text }) => {
        handleUserTurn(text);
      },
      onAgentSpeakingStart: () => {
        setIsAgentSpeaking(true);
      },
      onAgentSpeakingEnd: () => {
        setIsAgentSpeaking(false);
      },
      onInterruption: () => {
        setBargeInTriggered(true);
        stateEngine.addReasoningStep(
          "Barge-in Turn Interruption Detected",
          "Customer spoke while agent was talking. Agora turn detection cut off agent TTS playback immediately (<90ms)."
        );
        setTimeout(() => setBargeInTriggered(false), 3500);
      }
    });
    speechEngineRef.current = speechEngine;

    const agoraService = new AgoraVoiceService({
      onAudioVolume: ({ level }) => {
        setAudioLevel(level);
        setIsSpeaking(level > 15);
      },
      onConnectionChange: ({ current }) => {
        console.log("[Agora RTC Connection]", current);
      }
    });
    agoraRef.current = agoraService;

    return () => {
      unsub();
      speechEngineRef.current?.stopSpeaking();
      agoraRef.current?.leaveChannel();
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCallTimer = () => {
    secondsElapsedRef.current = 0;
    timerRef.current = setInterval(() => {
      secondsElapsedRef.current += 1;
      const mins = String(Math.floor(secondsElapsedRef.current / 60)).padStart(2, "0");
      const secs = String(secondsElapsedRef.current % 60).padStart(2, "0");
      setCallDuration(`${mins}:${secs}`);
    }, 1000);
  };

  const stopCallTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleToggleCall = async () => {
    if (!isCallActive) {
      setIsCallActive(true);
      startCallTimer();
      if (agoraRef.current) {
        await agoraRef.current.joinChannel("echosphere-sales-room");
      }
      speechEngineRef.current?.startListening();
      integrationRef.current?.logCRMActivity("CALL_STARTED", "Rahul Sharma joined Agora RTC channel echosphere-sales-room");
      setCrm(integrationRef.current ? { ...integrationRef.current.crm } : crm);
    } else {
      setIsCallActive(false);
      stopCallTimer();
      speechEngineRef.current?.stopListening();
      speechEngineRef.current?.stopSpeaking();
      if (agoraRef.current) {
        await agoraRef.current.leaveChannel();
      }
      integrationRef.current?.logCRMActivity("CALL_ENDED", `Call completed. Total duration: ${callDuration}`);
      setCrm(integrationRef.current ? { ...integrationRef.current.crm } : crm);
    }
  };

  const handleToggleMute = () => {
    if (agoraRef.current) {
      const muted = agoraRef.current.toggleMute();
      setIsMuted(muted);
    }
  };

  const handleUserTurn = (userText: string) => {
    if (!userText || !userText.trim()) return;
    if (!playbookRef.current || !stateEngineRef.current) return;

    speechEngineRef.current?.stopSpeaking();

    const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const userMsg: TranscriptMessage = {
      sender: "user",
      text: userText,
      time: currentTime
    };

    const result = playbookRef.current.handleTurn(userText);

    const agentMsg: TranscriptMessage = {
      sender: "agent",
      text: result.spokenResponse,
      time: currentTime,
      intent: result.intent
    };

    setTranscript((prev) => [...prev, userMsg, agentMsg]);
    stateEngineRef.current.recordTurn(userText, result.spokenResponse);

    speechEngineRef.current?.speak(result.spokenResponse);

    if (result.intent === "BOOK_ENTERPRISE_DEMO" && result.meetingDetails) {
      setCalendarDetails(result.meetingDetails);
      setIsCalendarModalOpen(true);
      integrationRef.current?.bookCalendarSlot(result.meetingDetails);
      setCrm(integrationRef.current ? { ...integrationRef.current.crm } : crm);
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch {
        // confetti is best-effort visual flair
      }
    } else if (result.intent === "HUMAN_ESCALATION") {
      setIsHandoffModalOpen(true);
    } else if (result.intent === "TEAM_SIZE_EXPANSION") {
      integrationRef.current?.updateCRMDealStage("Solution Fit", "$20,400 ARR");
      setCrm(integrationRef.current ? { ...integrationRef.current.crm } : crm);
    }
  };

  const handleReset = () => {
    stateEngineRef.current?.reset();
    setTranscript([GREETING]);
    setCallDuration("00:00");
    secondsElapsedRef.current = 0;
  };

  return (
    <div className="app-canvas">
      <IconRail
        onOpenJson={() => setIsJsonModalOpen(true)}
        onReset={handleReset}
        onScrollToCall={() => callPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
        onScrollToIntelligence={() => statePanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
        isCallActive={isCallActive}
      />

      <div className="canvas-main">
        <Navbar
          connectionStats={agoraRef.current?.getChannelStats()}
          onReset={handleReset}
          onOpenJson={() => setIsJsonModalOpen(true)}
          isCallActive={isCallActive}
        />

        <main className="finesse-workspace-grid">
          <div ref={callPanelRef}>
            <CallCockpit
              isCallActive={isCallActive}
              isMuted={isMuted}
              isSpeaking={isSpeaking}
              isAgentSpeaking={isAgentSpeaking}
              audioLevel={audioLevel}
              transcript={transcript}
              bargeInTriggered={bargeInTriggered}
              callDuration={callDuration}
              onToggleCall={handleToggleCall}
              onToggleMute={handleToggleMute}
              onExecuteScenario={handleUserTurn}
            />
          </div>

          <div ref={statePanelRef}>
            <StateCockpit
              state={state}
              crm={crm}
              onOpenCalendarModal={() => setIsCalendarModalOpen(true)}
              onOpenHandoffModal={() => setIsHandoffModalOpen(true)}
            />
          </div>
        </main>
      </div>

      <CalendarModal isOpen={isCalendarModalOpen} onClose={() => setIsCalendarModalOpen(false)} meetingDetails={calendarDetails} />

      <HandoffModal isOpen={isHandoffModalOpen} onClose={() => setIsHandoffModalOpen(false)} state={state} />

      <JsonStateModal isOpen={isJsonModalOpen} onClose={() => setIsJsonModalOpen(false)} state={state} />
    </div>
  );
}
