/**
 * Shared contracts for the Agora Conversational AI lifecycle.
 * Mirrors the agent-quickstart-nextjs template's types/conversation.ts,
 * extended with the fields our sales session needs.
 */

/** Response from GET /api/generate-agora-token. */
export interface AgoraTokenData {
  token: string;
  uid: string;
  channel: string;
  /** Populated once /api/invite-agent has returned. */
  agentId?: string;
}

/** Optional buyer context seeded into the FastAPI session before the agent joins. */
export interface SalesSessionSeed {
  customer_name?: string;
  company?: string;
  email?: string;
  seat_count?: number;
}

/** Request body for POST /api/invite-agent. */
export interface ClientStartRequest {
  requester_id: string;
  channel_name: string;
  seed?: SalesSessionSeed;
}

/** Response from POST /api/invite-agent. */
export interface AgentResponse {
  agent_id: string;
  create_ts: number;
  state: string;
  /** FastAPI conversation id — equals the channel name. */
  conversation_id: string;
  /**
   * Non-fatal problems detected while starting the agent — most importantly,
   * an unreachable MCP endpoint, which leaves the agent able to talk but
   * unable to actually book, discount, or sync anything. Surfaced in the UI
   * so the failure is never silent.
   */
  warnings?: string[];
}

/** Request body for POST /api/stop-conversation. */
export interface StopConversationRequest {
  agent_id: string;
  conversation_id?: string;
}

/**
 * Pipeline configuration served by the FastAPI backend
 * (GET /api/agent/pipeline-config). The Python side stays the single source of
 * truth for the Emily persona, stage detection, and brain selection — this
 * route only transports it into the Agora agent definition.
 */
export interface AgentPipelineConfig {
  conversation_id: string;
  /** "managed_openai" (Agora-hosted OpenAI) or "custom" (our FastAPI middleware). */
  llm_mode: 'managed_openai' | 'custom';
  system_prompt: string;
  greeting_message: string;
  failure_message: string;
  llm_model: string;
  llm_temperature: number;
  /** Only set when llm_mode === "custom". */
  custom_llm_url?: string;
  custom_llm_api_key?: string;
  /** Which vendor fills Agora's ASR slot. */
  stt_vendor: 'deepgram' | 'sarvam';
  /** Which vendor fills Agora's TTS slot. */
  tts_vendor: 'minimax' | 'sarvam';
  /** Agora-managed Deepgram ASR (no provider key required). */
  deepgram: {
    model: string;
    language: string;
  };
  /** Agora-managed MiniMax TTS (no provider key required). */
  minimax: {
    model: string;
    /** Blank uses Agora's default voice. */
    voice_id: string;
  };
  /** Sarvam BYOK settings, used only when a vendor above is set to "sarvam". */
  sarvam: {
    api_key: string;
    stt_language: string;
    tts_speaker: string;
    tts_target_language_code: string;
    tts_sample_rate: number;
  };
  /**
   * Our own Deal Engine MCP server, already scoped to this conversation via
   * ?cid=. Null when disabled. Agora's engine calls it directly, which is what
   * gives the agent pricing / CRM / calendar / escalation tools on the
   * Agora-managed LLM path.
   */
  deal_engine_mcp_url: string | null;
  /**
   * Additional MCP servers the Agora agent may call tools from. Agora's
   * Conversational AI engine performs the tool calls itself over
   * streamable_http.
   */
  mcp_server_urls: string[];
}
