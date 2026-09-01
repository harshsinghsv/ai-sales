/**
 * EchoSphere Conversation State Engine
 * Maintains the live, structured JSON conversation state across turns.
 * The core architectural differentiator: LLM reasons against this active state
 * instead of following brittle branching scripts.
 */

import type { ConversationState, DealPhase, MeetingSlot } from "@/types";

export const INITIAL_CONVERSATION_STATE: ConversationState = {
  customer: {
    name: "Rahul Sharma",
    company: "TechCorp Solutions",
    role: "Chief Technology Officer (CTO)",
    team_size: 50,
    current_stack: "Manual Outbound SDR Team (Cold calling & generic email bots)",
    core_pain_point: "Scripted bots break during prospect interruptions; SDRs losing hot leads",
    target_deployment: "Q4 2026"
  },
  qualification: {
    budget: "Evaluating ROI for mid-to-high enterprise tier",
    authority: "High (Direct executive signatory)",
    need: "Replace brittle IVR/scripted bots with adaptive voice AI",
    timeline: "Seeking 30-day proof of concept",
    score: 48,
    bant_details: {
      budget_score: 12,
      authority_score: 25,
      need_score: 20,
      timeline_score: 15
    }
  },
  deal: {
    phase: "Discovery",
    phase_index: 0,
    phases_list: ["Discovery", "Needs Analysis", "Solution Fit", "Proposal", "Closing"],
    pricing_tier: "Standard SDR Tier",
    unit_price: "$14.00 / user / mo",
    monthly_total: "$700 / mo",
    annual_commitment: false,
    discount_rate: 0,
    pilot_offered: false,
    demo_booked: false,
    meeting_slot: null,
    escalated_to_human: false,
    next_best_action: "Uncover current SDR qualification workflow and pain points"
  },
  objections: {
    active: [],
    resolved: [],
    predictively_neutralized: [
      { id: "tech-sla", topic: "Agora SD-RTN Latency", note: "Sub-800ms end-to-end voice roundtrip guaranteed" }
    ]
  },
  sentiment: {
    current: "Neutral (Analytical)",
    tone: "Evaluative CTO",
    momentum_score: 52,
    trend: [50, 52]
  },
  conversation: {
    turn_count: 0,
    last_user_utterance: null,
    last_agent_response: null,
    interrupted_topic: null
  },
  reasoning_trace: [
    {
      turn: 0,
      timestamp: new Date().toLocaleTimeString(),
      action: "Session Initialized",
      detail: "Loaded customer profile: Rahul Sharma (TechCorp CTO). Base team size: 50 users."
    }
  ],
  tool_executions: []
};

type Listener = (state: ConversationState) => void;

export class ConversationStateEngine {
  private state: ConversationState;
  private listeners: Listener[] = [];

  constructor(initialState: ConversationState = INITIAL_CONVERSATION_STATE) {
    this.state = JSON.parse(JSON.stringify(initialState));
  }

  getState(): ConversationState {
    return JSON.parse(JSON.stringify(this.state));
  }

  subscribe(listener: Listener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    const cloned = this.getState();
    this.listeners.forEach((listener) => listener(cloned));
  }

  addReasoningStep(action: string, detail: string): void {
    const entry = {
      turn: this.state.conversation.turn_count,
      timestamp: new Date().toLocaleTimeString(),
      action,
      detail
    };
    this.state.reasoning_trace.unshift(entry);
    if (this.state.reasoning_trace.length > 25) {
      this.state.reasoning_trace.pop();
    }
  }

  addToolExecution(toolName: string, input: unknown, result: unknown): void {
    const entry = {
      id: "tool_" + Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      tool: toolName,
      input,
      result
    };
    this.state.tool_executions.unshift(entry);
    this.addReasoningStep(`Tool Call: ${toolName}`, `Params: ${JSON.stringify(input)} -> Result: ${JSON.stringify(result)}`);
  }

  updateTeamSize(newSize: number): void {
    const oldSize = this.state.customer.team_size;
    this.state.customer.team_size = newSize;

    let newTier = "Standard SDR Tier";
    let unitRate = 14;
    if (newSize > 150) {
      newTier = "Enterprise Volume Tier";
      unitRate = 8.5;
    } else if (newSize > 50) {
      newTier = "Growth Tier";
      unitRate = 11;
    }

    const effectiveRate = this.state.deal.annual_commitment ? unitRate * 0.85 : unitRate;
    const monthlyTotal = Math.round(newSize * effectiveRate);

    this.state.deal.pricing_tier = newTier;
    this.state.deal.unit_price = `$${effectiveRate.toFixed(2)} / user / mo`;
    this.state.deal.monthly_total = `$${monthlyTotal.toLocaleString()} / mo`;

    this.state.qualification.bant_details.budget_score = Math.min(25, this.state.qualification.bant_details.budget_score + 6);
    this.state.qualification.score = this.calcBantScore();

    this.addReasoningStep(
      "Dynamic Requirement Mutation",
      `Customer changed team size from ${oldSize} to ${newSize}. Auto-recalculated tier to "${newTier}" ($${effectiveRate.toFixed(2)}/user/mo). Total contract value: $${monthlyTotal * 12}/yr.`
    );

    this.addToolExecution("ProductCatalogPricingAPI", { team_size: newSize }, { tier: newTier, rate_per_user: effectiveRate, monthly_mrr: monthlyTotal });
    this.adjustMomentum(12, "Enterprise seat expansion signal detected");
    this.state.deal.next_best_action = "Confirm SOC-2 deployment scope, then walk through volume tier economics";
    this.notify();
  }

  raiseObjection(objectionId: string, label: string, details: string): void {
    const existing = this.state.objections.active.find((o) => o.id === objectionId);
    if (!existing) {
      this.state.objections.active.push({ id: objectionId, label, details, raisedAt: new Date().toLocaleTimeString() });
      this.adjustMomentum(-10, `Objection raised: ${label}`);
      this.addReasoningStep("Objection Logged", `Customer voiced objection: "${label}". Activating negotiation heuristics.`);
      this.notify();
    }
  }

  resolveObjection(objectionId: string, resolutionNote: string): void {
    const index = this.state.objections.active.findIndex((o) => o.id === objectionId);
    if (index !== -1) {
      const [removed] = this.state.objections.active.splice(index, 1);
      const resolved = {
        ...removed,
        resolutionNote,
        resolvedAt: new Date().toLocaleTimeString()
      };
      this.state.objections.resolved.push(resolved);

      this.adjustMomentum(14, `Objection resolved: ${removed.label}`);
      this.addReasoningStep("Objection Neutralized", `Successfully addressed "${removed.label}" with concession: ${resolutionNote}`);
      this.notify();
    }
  }

  addPredictiveNeutralization(topic: string, note: string): void {
    this.state.objections.predictively_neutralized.push({
      id: "pred_" + Date.now(),
      topic,
      note,
      timestamp: new Date().toLocaleTimeString()
    });
    this.addReasoningStep("Predictive Neutralization", `Anticipated and answered prospect concern before ask: "${topic}" (${note})`);
    this.notify();
  }

  advanceDealPhase(phaseName: DealPhase): void {
    const index = this.state.deal.phases_list.indexOf(phaseName);
    if (index !== -1 && index >= this.state.deal.phase_index) {
      this.state.deal.phase = phaseName;
      this.state.deal.phase_index = index;

      this.adjustMomentum(10, `Advanced deal stage to ${phaseName}`);
      this.addReasoningStep("Deal Stage Transition", `Advancing sales pipeline to "${phaseName}".`);
      this.notify();
    }
  }

  applyAnnualDiscount(discountPercent = 15): void {
    this.state.deal.annual_commitment = true;
    this.state.deal.discount_rate = discountPercent;

    const baseUnitRate = this.state.customer.team_size > 150 ? 8.5 : this.state.customer.team_size > 50 ? 11 : 14;
    const discountedUnit = baseUnitRate * (1 - discountPercent / 100);
    const monthlyTotal = Math.round(this.state.customer.team_size * discountedUnit);

    this.state.deal.unit_price = `$${discountedUnit.toFixed(2)} / user / mo (15% Annual Disc)`;
    this.state.deal.monthly_total = `$${monthlyTotal.toLocaleString()} / mo`;

    this.resolveObjection("pricing_concern", "Applied 15% Annual Commitment Incentive");
    this.addReasoningStep("Negotiation Concession Executed", `Granted ${discountPercent}% annual discount concession. New unit rate: $${discountedUnit.toFixed(2)}/user/mo.`);
    this.state.deal.next_best_action = "Confirm Q4 budget alignment, then move to close on annual terms";
    this.notify();
  }

  offerPilotProgram(): void {
    this.state.deal.pilot_offered = true;
    this.resolveObjection("pricing_concern", "Structured 30-Day Risk-Free Enterprise Pilot");
    this.addReasoningStep("Negotiation Concession Executed", "Offered 30-Day Risk-Free Enterprise Pilot Program with white-glove onboarding and full money-back guarantee.");
    this.adjustMomentum(15, "Pilot proposal accepted");
    this.state.deal.next_best_action = "Lock the pilot start date and route to onboarding";
    this.notify();
  }

  bookMeeting(meetingDetails: MeetingSlot): void {
    this.state.deal.demo_booked = true;
    this.state.deal.meeting_slot = meetingDetails;
    this.advanceDealPhase("Closing");
    this.state.qualification.score = 94;
    this.state.sentiment.current = "Highly Interested & Committed";

    this.addToolExecution(
      "GoogleCalendarAPI",
      { slot: meetingDetails.time, attendee: this.state.customer.name },
      { status: "CONFIRMED", event_id: "evt_echosphere_" + Date.now(), gmeet_link: "https://meet.google.com/ech-sale-vip" }
    );
    this.addToolExecution(
      "HubSpotCRM",
      { lead: this.state.customer.name, stage: "Demo Scheduled", deal_value: "$20,400" },
      { updated: true, crm_id: "hs_deal_9921" }
    );

    this.adjustMomentum(20, "Demo meeting booked on Google Calendar");
    this.addReasoningStep("Conversion Milestone", `Successfully scheduled Executive Enterprise Demo for ${meetingDetails.time}. Synced to HubSpot CRM & Google Calendar.`);
    this.state.deal.next_best_action = "Prep the executive demo agenda and confirm attendee list";
    this.notify();
  }

  escalateToHuman(reason = "Complex Enterprise Custom Terms & SLA"): void {
    this.state.deal.escalated_to_human = true;
    this.state.sentiment.current = "Elevated to Executive Sales Director";
    this.addReasoningStep(
      "Warm Human Handoff Triggered",
      `Escalating call to Enterprise Account Director (Ananya Deshmukh). Reason: ${reason}. Passing full state payload and transcript context.`
    );
    this.addToolExecution(
      "AgoraWarmHandoffGateway",
      { channel: "echosphere-sales-room", assignee: "Ananya Deshmukh (VP Sales)" },
      { status: "REP_JOINED_CHANNEL", context_packet_bytes: 4280 }
    );
    this.state.deal.next_best_action = "Hand full context to Ananya Deshmukh and stay on the line for warm intro";
    this.notify();
  }

  adjustMomentum(delta: number, _reason: string): void {
    const newScore = Math.max(10, Math.min(100, this.state.sentiment.momentum_score + delta));
    this.state.sentiment.momentum_score = newScore;
    this.state.sentiment.trend.push(newScore);
    if (this.state.sentiment.trend.length > 15) {
      this.state.sentiment.trend.shift();
    }

    if (newScore > 75) {
      this.state.sentiment.current = "High Buying Intent (Bullish)";
      this.state.sentiment.tone = "Eager / Solution Oriented";
    } else if (newScore > 50) {
      this.state.sentiment.current = "Engaged (Analytical)";
      this.state.sentiment.tone = "Collaborative / Diligent";
    } else {
      this.state.sentiment.current = "Hesitant / Skeptical";
      this.state.sentiment.tone = "Cautious / Budget Guarded";
    }
  }

  private calcBantScore(): number {
    const { budget_score, authority_score, need_score, timeline_score } = this.state.qualification.bant_details;
    return budget_score + authority_score + need_score + timeline_score;
  }

  recordTurn(userText: string, agentText: string): void {
    this.state.conversation.turn_count += 1;
    this.state.conversation.last_user_utterance = userText;
    this.state.conversation.last_agent_response = agentText;
    this.notify();
  }

  reset(): void {
    this.state = JSON.parse(JSON.stringify(INITIAL_CONVERSATION_STATE));
    this.notify();
  }
}
