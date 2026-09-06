---
trigger: always_on
---

# Agora Sales Agent — Project Rules

## Tech stack is locked. Do not suggest alternatives.
- Frontend: Next.js (App Router) + TypeScript (strict mode, no `any`).
- Real-time voice/RTC: Agora Conversational AI Engine ONLY.
  - Never propose, scaffold, or silently pull in LiveKit, Pipecat, Twilio,
    Vapi, Daily.co, raw WebRTC, or any other RTC/voice SDK, even as a
    "simpler alternative" or "just for testing."
- Repo shape: built on the Agora Conversational AI Next.js quickstart
  (AgoraIO-Conversational-AI/agent-quickstart-nextjs). The Next.js app
  lives at the repo root (app/, components/, hooks/, lib/, types/); the
  agent lifecycle is owned by app/api/{generate-agora-token,invite-agent,
  stop-conversation,agent-think}. Do not reintroduce a separate frontend/
  directory or move the agent join back into Python.
- STT/LLM/TTS: Agora-MANAGED models by default, wired through Agora's
  native vendor slots via the agora-agents SDK -- STT = DeepgramSTT
  (nova-3, language "multi" for Hindi/English code-switching), LLM =
  Agora-managed OpenAI carrying our persona, TTS = MiniMaxTTS
  (speech-2.8-turbo). No provider API keys are required for this path.
  Sarvam remains supported as a BYOK alternative via AGORA_STT_VENDOR /
  AGORA_TTS_VENDOR=sarvam, and CustomLLM still points at the FastAPI
  /v1/chat/completions middleware when AGORA_LLM_MODE=custom.
- Agentic actions should be exposed to the agent through Agora's own
  tool-calling surfaces (llm.mcp_servers via the vendor `mcpServers`
  option, or llm.tools REST definitions) rather than only living inside
  the custom-LLM middleware -- otherwise the agent has NO tools on the
  managed path.
- Voice runs ONLY in Agora's cloud pipeline. Never reintroduce browser
  SpeechRecognition, a client-side VAD loop, client-side TTS playback, or a
  direct browser call to an LLM endpoint — that was the duplicate-audio bug
  this architecture removed. Transcripts and agent state come from RTM via
  agora-agent-client-toolkit, never from browser-side recognition.
- Business logic stays in Python. The persona (sales_persona.py), deal
  engine, and session state must not be duplicated in TypeScript; the
  invite route fetches them from GET /api/agent/pipeline-config.
- CRM: HubSpot API. Calendar: Google Calendar API. Escalation: Slack/email
  webhook. Do not swap these for a different provider without asking first.

## UI/design standard
- Base component system: shadcn/ui + Tailwind CSS. No inline styles, no
  ad-hoc CSS-in-JS, no unstyled default HTML elements in the final UI.
- Voice presence indicator: use a proper animated orb/waveform component
  (e.g. ElevenLabs UI's orb or Deepgram UI's orb/waveform, adapted to our
  own state signals — not built from scratch, not a static icon).
- Layout must show, simultaneously: the voice orb, a live "deal cockpit"
  panel (customer profile fields, deal/discount state, objection tags),
  and a scrolling live transcript. This is a sales dashboard, not a
  generic chatbot widget — never collapse it back down to just a
  centered orb and a mic button.
- No lorem ipsum, no placeholder copy, no obviously-fake sample data left
  in the final UI — use realistic product/pricing content throughout.
- Every async action (tool call, API call, connecting state) needs a
  visible loading/pending state. Never leave the UI silent while
  something is happening in the background.
- Dark, modern, low-clutter aesthetic. Match the polish level of a real
  product dashboard, not a hackathon prototype.

## Scope discipline
- Stay strictly inside the file(s)/feature relevant to the current
  request. Do not refactor, reformat, or "clean up" unrelated files.
- Do not add a new npm/pip dependency without stating what it is and why,
  and waiting for confirmation, unless it's already named in this rules
  file or an explicit prior instruction.
- Do not change the architecture described above (e.g. moving business
  logic into Agora config, or moving TTS logic client-side) without
  explicitly flagging the proposed change and why, before doing it.
- Prefer the smallest diff that correctly accomplishes the task over a
  larger rewrite, even if the rewrite feels "cleaner."
- If a request is ambiguous, make the most reasonable assumption, state
  it in one line, and proceed — don't stall on clarifying questions for
  small ambiguities.

## Never
- Never invent Agora, Sarvam, HubSpot, or Google Calendar API shapes —
  if unsure of a real parameter/endpoint, say so explicitly rather than
  guessing plausible-looking code.
- Never leave mocked data or stubbed tool calls in place silently once
  real credentials/endpoints are available — flag any remaining stub.
- Never remove error handling, loading states, or the deal-cockpit UI
  elements to "simplify" a fix.