/**
 * EchoSphere External Integrations & Tool Calling Layer
 * Simulates HubSpot CRM, Google Calendar, and Product Catalog APIs with real-time state sync.
 */

import type { BookedEvent, CrmContact, MeetingSlot } from "@/types";
import type { ConversationStateEngine } from "./stateEngine";

export const MOCK_HUBSPOT_CONTACT: CrmContact = {
  id: "hs_cont_98412",
  name: "Rahul Sharma",
  email: "rahul.sharma@techcorp.io",
  phone: "+1 (415) 890-2341",
  company: "TechCorp Solutions Inc.",
  lifecycle_stage: "Sales Qualified Lead (SQL)",
  deal_name: "TechCorp Enterprise Voice AI Expansion",
  deal_amount: "$20,400 ARR",
  deal_stage: "Needs Analysis",
  activities: [
    {
      id: "act_1",
      timestamp: "Today, 10:14 AM",
      type: "INBOUND_CALL",
      text: "Customer joined Agora Voice Channel (Agora SD-RTN Room: echosphere-sales-room)"
    },
    {
      id: "act_2",
      timestamp: "Today, 10:15 AM",
      type: "REQUIREMENT_UPDATE",
      text: "Initial scope: 50 seats. Pain point: Scripted bots failing on interruptions."
    }
  ]
};

export const MOCK_CALENDAR_SLOTS = [
  { id: "slot_1", date: "Thursday, Sep 4, 2026", time: "11:00 AM EST", host: "Ananya Deshmukh" },
  { id: "slot_2", date: "Thursday, Sep 4, 2026", time: "3:00 PM EST", host: "Ananya Deshmukh (Recommended)" },
  { id: "slot_3", date: "Friday, Sep 5, 2026", time: "2:00 PM EST", host: "Karan Patel (Head of Solutions)" }
];

export class MockIntegrationService {
  crm: CrmContact;
  bookedEvent: BookedEvent | null = null;

  constructor() {
    this.crm = JSON.parse(JSON.stringify(MOCK_HUBSPOT_CONTACT));
  }

  logCRMActivity(type: string, text: string) {
    const activity = {
      id: "act_" + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type,
      text
    };
    this.crm.activities.unshift(activity);
    return activity;
  }

  updateCRMDealStage(stage: string, amount?: string) {
    this.crm.deal_stage = stage;
    if (amount) this.crm.deal_amount = amount;
    this.logCRMActivity("STAGE_CHANGE", `Deal stage moved to "${stage}". Valued at ${this.crm.deal_amount}.`);
  }

  bookCalendarSlot(slot: MeetingSlot): BookedEvent {
    this.bookedEvent = {
      id: "gcal_evt_" + Date.now(),
      title: "TechCorp x EchoSphere Enterprise Demo & Technical Deep Dive",
      slot,
      attendee: this.crm.email,
      host: slot.host,
      meetingUrl: "https://meet.google.com/ech-sale-vip",
      agoraChannel: "echosphere-sales-room",
      status: "Confirmed (Invite Dispatched)"
    };
    this.logCRMActivity("CALENDAR_BOOKED", `Executive Demo scheduled for ${slot.date} at ${slot.time} with ${slot.host}.`);
    return this.bookedEvent;
  }

  generateWarmHandoffPayload(stateEngine: ConversationStateEngine) {
    const state = stateEngine.getState();
    return {
      timestamp: new Date().toISOString(),
      customer: state.customer,
      qualification_score: state.qualification.score + "%",
      deal_phase: state.deal.phase,
      current_commercial_offer: {
        seats: state.customer.team_size,
        tier: state.deal.pricing_tier,
        unit_rate: state.deal.unit_price,
        monthly_mrr: state.deal.monthly_total,
        pilot_offered: state.deal.pilot_offered,
        annual_discount_applied: state.deal.annual_commitment
      },
      objections_summary: {
        active: state.objections.active.map((o) => o.label),
        resolved: state.objections.resolved.map((o) => `${o.label}: ${o.resolutionNote}`),
        predictively_neutralized: state.objections.predictively_neutralized.map((p) => p.topic)
      },
      sentiment: state.sentiment.current,
      recommended_rep_action: "Validate 200-seat SOC-2 security requirements, confirm 30-day pilot scope, and finalize MSA signature."
    };
  }
}
