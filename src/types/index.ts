export interface CustomerProfile {
  name: string;
  company: string;
  role: string;
  team_size: number;
  current_stack: string;
  core_pain_point: string;
  target_deployment: string;
}

export interface BantDetails {
  budget_score: number;
  authority_score: number;
  need_score: number;
  timeline_score: number;
}

export interface Qualification {
  budget: string;
  authority: string;
  need: string;
  timeline: string;
  score: number;
  bant_details: BantDetails;
}

export type DealPhase = "Discovery" | "Needs Analysis" | "Solution Fit" | "Proposal" | "Closing";

export interface MeetingSlot {
  date: string;
  time: string;
  host: string;
}

export interface Deal {
  phase: DealPhase;
  phase_index: number;
  phases_list: DealPhase[];
  pricing_tier: string;
  unit_price: string;
  monthly_total: string;
  annual_commitment: boolean;
  discount_rate: number;
  pilot_offered: boolean;
  demo_booked: boolean;
  meeting_slot: MeetingSlot | null;
  escalated_to_human: boolean;
  next_best_action?: string;
}

export interface ActiveObjection {
  id: string;
  label: string;
  details: string;
  raisedAt: string;
}

export interface ResolvedObjection extends ActiveObjection {
  resolutionNote: string;
  resolvedAt: string;
}

export interface PredictiveNeutralization {
  id: string;
  topic: string;
  note: string;
  timestamp?: string;
}

export interface Objections {
  active: ActiveObjection[];
  resolved: ResolvedObjection[];
  predictively_neutralized: PredictiveNeutralization[];
}

export interface Sentiment {
  current: string;
  tone: string;
  momentum_score: number;
  trend: number[];
}

export interface ConversationMeta {
  turn_count: number;
  last_user_utterance: string | null;
  last_agent_response: string | null;
  interrupted_topic: string | null;
}

export interface ReasoningStep {
  turn: number;
  timestamp: string;
  action: string;
  detail: string;
}

export interface ToolExecution {
  id: string;
  timestamp: string;
  tool: string;
  input: unknown;
  result: unknown;
}

export interface ConversationState {
  customer: CustomerProfile;
  qualification: Qualification;
  deal: Deal;
  objections: Objections;
  sentiment: Sentiment;
  conversation: ConversationMeta;
  reasoning_trace: ReasoningStep[];
  tool_executions: ToolExecution[];
}

export interface TranscriptMessage {
  sender: "agent" | "user";
  text: string;
  time: string;
  intent?: string;
}

export type Intent =
  | "GREETING & DISCOVERY"
  | "TEAM_SIZE_EXPANSION"
  | "COMPETITOR_COMPARISON"
  | "PRICE_OBJECTION_STAGE_1_ROI"
  | "PRICE_OBJECTION_STAGE_2_ANNUAL"
  | "PRICE_OBJECTION_STAGE_3_PILOT"
  | "BOOK_ENTERPRISE_DEMO"
  | "HUMAN_ESCALATION"
  | "INITIAL_PRICING_INQUIRY"
  | "NATURAL_CONVERSATION";

export interface PlaybookTurnResult {
  intent: Intent;
  spokenResponse: string;
  stateAction: string;
  meetingDetails?: MeetingSlot;
  predictiveNote?: string;
}

export interface CrmActivity {
  id: string;
  timestamp: string;
  type: string;
  text: string;
}

export interface CrmContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  lifecycle_stage: string;
  deal_name: string;
  deal_amount: string;
  deal_stage: string;
  activities: CrmActivity[];
}

export interface CalendarSlot {
  id: string;
  date: string;
  time: string;
  host: string;
}

export interface BookedEvent {
  id: string;
  title: string;
  slot: MeetingSlot;
  attendee: string;
  host: string;
  meetingUrl: string;
  agoraChannel: string;
  status: string;
}

export interface ChannelStats {
  channel: string;
  uid: number;
  latency: string;
  packetLoss: string;
  transport: string;
  mode: string;
}

export type ConnectionState = "CONNECTED" | "DISCONNECTED" | string;

export interface ConnectionChangeEvent {
  current: ConnectionState;
  previous?: string;
  mode?: string;
}

export interface AudioVolumeEvent {
  type?: "local" | "remote";
  level: number;
}
