# Adaptive AI Sales & Negotiation Agent

Real-time voice sales agent ("Emily", Claude Enterprise) built on the
[Agora Conversational AI Engine](https://github.com/AgoraIO-Conversational-AI/agent-quickstart-nextjs)
quickstart architecture, with a Python deal engine, live deal cockpit, and
HubSpot / Google Calendar / Slack integrations.

## Repository layout

The Next.js app sits at the repository root, mirroring the quickstart template.
The FastAPI backend lives alongside it as the business brain.

```
app/
  api/generate-agora-token/   RTC + RTM token (agora-token)
  api/invite-agent/           starts the cloud agent (agora-agents)
  api/stop-conversation/      stops the agent, finalizes the session
  api/agent-think/            injects typed cockpit messages into the live call
  page.tsx, layout.tsx, globals.css
components/                   LandingPage, SalesCockpit, DealCockpitPanel,
                              LiveTranscript, VoiceOrb, PostCallDealMemo, ui/
hooks/useAgoraVoice.ts        voice runtime (RTC join, RTM, toolkit events)
lib/                          agora.ts, conversation.ts, agent-registry.ts,
                              types.ts, utils.ts
types/conversation.ts         lifecycle contracts shared with the API routes
backend/                      FastAPI: deal engine, session state, custom LLM
                              middleware, CRM/calendar/escalation, cockpit WS
```

## Architecture

Voice runs entirely inside Agora's cloud pipeline, and Agora's engine also
performs the agent's tool calls against our MCP server:

```
browser mic ──RTC──> Agora Conversational AI Engine ──RTC──> browser speaker
                    Deepgram ASR → OpenAI LLM → MiniMax TTS
                       │                │
                       │                └──MCP──> Deal Engine MCP server
                       │                          (FastAPI /mcp?cid=<session>)
                       │                          pricing · discount · HubSpot
                       │                          calendar · escalation · memory
                       │
                       └──RTM──> transcripts · agent state · latency · barge-in
```

All three model slots run on **Agora-managed credentials** — no Deepgram,
OpenAI or MiniMax API keys required. Sarvam remains available as BYOK via
`AGORA_STT_VENDOR` / `AGORA_TTS_VENDOR`.

### Why MCP matters here

On the Agora-managed LLM path the model has no access to our Python functions,
so without MCP the agent could only *talk* about pricing. Exposing the deal
engine over MCP (`llm.mcp_servers`) means Agora's engine invokes
`get_pricing`, `apply_discount`, `create_crm_lead`, `book_meeting`,
`update_session_state` and `escalate_to_human` itself. Each call is announced
to the cockpit as an `AGENT_TOOL_CALL` frame and rendered live in the Agora
Pipeline panel, tagged `via Agora MCP`.

Every MCP tool delegates to `execute_tool_call` — the same function the
custom-LLM path uses — so there is one implementation of the deal logic.

### Live human handoff

`escalate_to_human` mints a link to `/human/<channel>`. The specialist opens it
and joins the buyer's **existing Agora RTC channel**, arriving with the full
RTM transcript and current deal terms on screen. The buyer stays on the same
call and simply starts hearing a person.

The LLM slot has two modes, selected by `AGORA_LLM_MODE`:

- `managed_openai` (default) — Agora-hosted OpenAI credentials, driven by the
  stage-aware Emily persona built in `backend/middleware/sales_persona.py`.
- `custom` — Agora calls the FastAPI `/v1/chat/completions` middleware, which
  runs the deal engine, tool calls, CRM sync, and cockpit broadcasts.

Either way the persona and deal logic stay in Python. `/api/invite-agent`
fetches them from `GET /api/agent/pipeline-config` rather than duplicating any
prompt or pricing logic in TypeScript.

Deal cockpit state (customer profile, deal terms, objections, integration
toasts, post-call memo) streams from FastAPI over its WebSocket at `/ws`.

## Setup

1. Copy the env template and fill it in:

   ```bash
   cp .env.example .env
   ```

   `NEXT_PUBLIC_AGORA_APP_ID` is required — the browser needs it to join RTC and
   cannot read a non-public variable. `NEXT_AGORA_APP_CERTIFICATE` falls back to
   `AGORA_APP_CERTIFICATE` if unset.

2. Install the frontend:

   ```bash
   npm install
   ```

   ```bash
   .venv/Scripts/python -m pip install -r backend/requirements.txt
   ```

3. Run the backend:

   ```bash
   .venv/Scripts/python -m uvicorn backend.server:app --reload --port 8000
   ```

4. Run the frontend:

   ```bash
   npm run dev
   ```

## Verification

```bash
npm run typecheck
```

```bash
npm run build
```

```bash
.venv/Scripts/python -m pytest backend/tests -q
```

## Deploying the backend

Agora's cloud must reach the backend for MCP tool calls, so it cannot stay on
localhost for a live demo. `backend/Dockerfile` + `railway.json` build and run
it anywhere that takes a Dockerfile.

After deploying, set these so the agent and the handoff link point at real URLs:

- `PUBLIC_BASE_URL` — the deployed backend origin (used to build the MCP URL)
- `HUMAN_HANDOFF_BASE_URL` — the deployed frontend origin
- `NEXT_PUBLIC_BACKEND_URL` / `NEXT_PUBLIC_WS_URL` — backend HTTP/WS origins

## Notes

- `backend/services/agora_convo_client.py` and `POST /api/session/start` are the
  previous backend-side agent join. `/api/invite-agent` now owns the agent
  lifecycle; calling the old path while a Next-started agent is live would put a
  second agent in the same channel. Both are retained for backend-only testing.
- `POST /api/stt` and the client use of `/v1/audio/speech` are unused by the
  frontend now that Agora's pipeline handles ASR and TTS. `/v1/audio/speech`
  remains available as a `generic_http` TTS target.
