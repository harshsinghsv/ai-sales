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
- STT/LLM/TTS: Sarvam AI, wired through Agora's native/custom vendor slots
  as already architected (STT = native Agora "sarvam" vendor, LLM = our
  own FastAPI custom-LLM middleware calling Sarvam, TTS = our FastAPI
  shim calling Sarvam Bulbul, exposed to Agora as generic_http).
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