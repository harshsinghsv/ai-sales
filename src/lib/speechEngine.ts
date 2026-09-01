/**
 * EchoSphere Speech Engine
 * Coordinates browser SpeechRecognition (STT) and SpeechSynthesis (TTS)
 * with instant barge-in cancellation and natural conversational cadence.
 */

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  [index: number]: { transcript: string };
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionErrorEventLike {
  error: string;
}

interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

export interface SpeechEngineOptions {
  onUserTranscript?: (payload: { text: string; isFinal: boolean }) => void;
  onAgentSpeakingStart?: (payload: { text: string }) => void;
  onAgentSpeakingEnd?: () => void;
  onInterruption?: (payload: { transcript: string }) => void;
}

export class SpeechEngine {
  private onUserTranscript: NonNullable<SpeechEngineOptions["onUserTranscript"]>;
  private onAgentSpeakingStart: NonNullable<SpeechEngineOptions["onAgentSpeakingStart"]>;
  private onAgentSpeakingEnd: NonNullable<SpeechEngineOptions["onAgentSpeakingEnd"]>;
  private onInterruption: NonNullable<SpeechEngineOptions["onInterruption"]>;

  private recognition: SpeechRecognitionLike | null = null;
  private isListening = false;
  isSpeaking = false;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor(options: SpeechEngineOptions = {}) {
    this.onUserTranscript = options.onUserTranscript || (() => {});
    this.onAgentSpeakingStart = options.onAgentSpeakingStart || (() => {});
    this.onAgentSpeakingEnd = options.onAgentSpeakingEnd || (() => {});
    this.onInterruption = options.onInterruption || (() => {});

    if (typeof window !== "undefined") {
      this.initSpeechRecognition();
      this.initVoices();
    }
  }

  private initVoices(): void {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          (v.name.includes("Natural") ||
            v.name.includes("Google") ||
            v.name.includes("Samantha") ||
            v.name.includes("Daniel") ||
            v.name.includes("Alex"))
      );
      this.selectedVoice = preferred || voices.find((v) => v.lang.startsWith("en")) || voices[0] || null;
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  private initSpeechRecognition(): void {
    if (typeof window === "undefined") return;

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      console.warn("SpeechRecognition API not available in this browser");
      return;
    }

    try {
      this.recognition = new SpeechRec();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = "en-US";

      this.recognition.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if ((interimTranscript.length > 2 || finalTranscript.length > 2) && this.isSpeaking) {
          this.stopSpeaking();
          this.onInterruption({ transcript: interimTranscript || finalTranscript });
        }

        if (finalTranscript.trim().length > 0) {
          this.onUserTranscript({ text: finalTranscript.trim(), isFinal: true });
        }
      };

      this.recognition.onerror = (event) => {
        if (event.error !== "no-speech") {
          console.warn("Speech recognition error:", event.error);
        }
      };

      this.recognition.onend = () => {
        if (this.isListening && this.recognition) {
          try {
            this.recognition.start();
          } catch {
            // already started, ignore
          }
        }
      };
    } catch (e) {
      console.warn("Could not instantiate SpeechRecognition:", e);
    }
  }

  startListening(): boolean {
    if (!this.recognition) return false;
    this.isListening = true;
    try {
      this.recognition.start();
      return true;
    } catch {
      return false;
    }
  }

  stopListening(): void {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // already stopped, ignore
      }
    }
  }

  speak(text: string, onDone: () => void = () => {}): void {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      onDone();
      return;
    }

    this.stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.currentUtterance = utterance;
      this.onAgentSpeakingStart({ text });
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.onAgentSpeakingEnd();
      onDone();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.onAgentSpeakingEnd();
      onDone();
    };

    window.speechSynthesis.speak(utterance);
  }

  stopSpeaking(): void {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.currentUtterance = null;
    this.onAgentSpeakingEnd();
  }
}
