/**
 * Strict TypeScript types for the Adaptive AI Sales & Negotiation Agent.
 * Strict mode enabled - zero `any` usage.
 */

export type VoiceState = 'idle' | 'listening' | 'thinking' | 'speaking';

export interface CustomerProfile {
  name: string | null;
  company: string | null;
  email: string | null;
}

export interface Requirements {
  seat_count: number | null;
  use_case: string | null;
  must_haves: string[];
}

export interface ObjectionItem {
  id: string;
  type: 'pricing' | 'competitor' | 'trust' | 'implementation';
  label: string;
  resolved: boolean;
  context: string;
}

export interface DealState {
  tier: string;
  tier_name: string;
  list_price_per_seat: number;
  effective_price_per_seat: number;
  current_offer_pct_off: number;
  margin_floor_pct: number;
  concessions_given: string[];
  trades_requested: string[];
  margin_remaining_pct: number;
}

export interface SessionState {
  conversation_id: string;
  customer: CustomerProfile;
  requirements: Requirements;
  objections_raised: ObjectionItem[];
  deal_state: DealState;
  outcome: string | null;
  escalated: boolean;
  last_action_toast?: string | null;
}

export interface TranscriptTurn {
  id: string;
  speaker: 'customer' | 'agent';
  text: string;
  isFinal: boolean;
  timestamp: number;
  interrupted?: boolean;
}

export interface IntegrationToast {
  id: string;
  service: 'hubspot' | 'calendar' | 'slack' | 'deal';
  title: string;
  detail: string;
  timestamp: number;
}

export interface PostCallDealMemo {
  conversation_id: string;
  customer: {
    name: string;
    company: string;
    email: string;
  };
  requirements_captured: {
    seat_count: number;
    tier_matched: string;
    use_case: string;
    must_haves: string[];
  };
  negotiation_summary: {
    list_price_per_seat: string;
    final_negotiated_price: string;
    discount_granted_pct: string;
    margin_floor_pct: string;
    margin_preserved: boolean;
    concessions_given: string[];
    trades_obtained: string[];
  };
  objections_audit: Array<{
    type: string;
    label: string;
    resolved: boolean;
    context: string;
  }>;
  financials: {
    monthly_value: number;
    annual_contract_value: number;
    currency: string;
  };
  outcome: string;
  escalated_to_human: boolean;
  crm_record: {
    crm_system: string;
    status: string;
    is_sandbox?: boolean;
  };
}

/**
 * Per-turn latency sample emitted by Agora's Conversational AI Engine over RTM
 * (AGENT_METRICS). `type` names the pipeline module — asr, llm, tts — and
 * `value` is the measured latency in milliseconds.
 */
export interface PipelineMetric {
  id: string;
  module: string;
  name: string;
  valueMs: number;
  timestamp: number;
}

/**
 * A tool invocation announced by the backend over the cockpit WebSocket.
 * `source` distinguishes calls Agora's engine made against our MCP server
 * from calls that ran inside the custom-LLM middleware.
 */
export interface ToolCallEvent {
  id: string;
  tool: string;
  source: 'mcp' | 'middleware';
  args: Record<string, unknown>;
  resultSummary: string;
  durationMs: number | null;
  timestamp: number;
}

/** A barge-in: the buyer cut the agent off mid-sentence. */
export interface InterruptionEvent {
  id: string;
  turnId: number;
  timestamp: number;
}

/**
 * A live "ring" for a human specialist: the buyer asked for a person, or the
 * agent hit a negotiation deadlock. Backed by GET /api/escalations (queue
 * hydration on load) and the HUMAN_HANDOFF_REQUESTED WebSocket broadcast
 * (live updates), shown on the Sales Team Console (/team).
 */
export interface EscalationRequest {
  conversation_id: string;
  customer_name: string;
  company: string;
  seat_count: number | null;
  tier_name: string;
  reason: string;
  urgency: 'low' | 'medium' | 'high';
  handoff_url: string;
  timestamp: number;
  resolved: boolean;
}
