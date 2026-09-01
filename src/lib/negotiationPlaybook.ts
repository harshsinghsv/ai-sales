/**
 * EchoSphere Negotiation Playbook & Decision Framework
 * Encodes adaptive heuristics, objection handling trees, predictive neutralization,
 * and concession ladders (ROI reframe -> 15% Annual -> 30-day Pilot -> Human Escalation).
 */

import type { PlaybookTurnResult } from "@/types";
import type { ConversationStateEngine } from "./stateEngine";

export const NEGOTIATION_STAGES = {
  ROI_REFRAME: 1,
  ANNUAL_DISCOUNT: 2,
  RISK_FREE_PILOT: 3,
  HUMAN_ESCALATION: 4
} as const;

export const COMPETITOR_BATTLECARDS = {
  vapi: {
    name: "Vapi / Retell AI",
    summary: "Brittle Script Trees vs Active State Machine",
    pitch: "While platforms like Vapi or Retell offer low-latency APIs, they still run on pre-mapped branching logic. When a CTO suddenly changes their team size from 50 to 200 users or combines two objections, their flows stall or restart. EchoSphere maintains an active JSON state machine with Agora SD-RTN, dynamically recalculating pricing and anticipating objections before they're voiced."
  },
  traditional_ivr: {
    name: "Legacy Telephony Bots",
    summary: "Unnatural Barge-in vs Sub-second Agora VAD",
    pitch: "Traditional bots talk over prospects or abruptly terminate thoughts. EchoSphere leverages Agora's conversational engine with native voice activity detection (VAD), enabling natural barge-in interruptions and conversational memory across the entire call."
  }
} as const;

export class NegotiationPlaybook {
  private stateEngine: ConversationStateEngine;
  private currentNegotiationStage = 0;

  constructor(stateEngine: ConversationStateEngine) {
    this.stateEngine = stateEngine;
  }

  handleTurn(userUtterance: string): PlaybookTurnResult {
    const text = userUtterance.toLowerCase();

    // 1. Team size change (e.g. "actually 200 users, not 50", "team of 200", "we scaled to 200")
    if (text.includes("200") || (text.includes("user") && text.includes("scaled")) || text.includes("increase")) {
      this.stateEngine.updateTeamSize(200);
      this.stateEngine.advanceDealPhase("Needs Analysis");

      return {
        intent: "TEAM_SIZE_EXPANSION",
        spokenResponse:
          "Got it, Rahul. Scaling up from 50 to 200 users actually triggers our Enterprise Volume Tier. That automatically drops your per-seat rate from $14 down to $8.50 per user per month, giving you significantly better unit economics plus dedicated SOC-2 VPC deployment.",
        stateAction: "UPDATE_TEAM_SIZE_200",
        predictiveNote: "Anticipated enterprise onboarding SLA inquiry"
      };
    }

    // 2. Competitor comparison / interruption
    if (text.includes("compare") || text.includes("competitor") || text.includes("vapi") || text.includes("retell") || text.includes("different")) {
      this.stateEngine.raiseObjection("competitor_differentiation", "Competitor Comparison (Vapi/Retell)", "Prospect inquiring about state engine vs branching trees");
      this.stateEngine.resolveObjection("competitor_differentiation", "Highlighted Agora SD-RTN + Live State Machine memory");
      this.stateEngine.advanceDealPhase("Solution Fit");

      return {
        intent: "COMPETITOR_COMPARISON",
        spokenResponse:
          "That's a fair question. Most tools like Vapi or Retell rely on rigid branching trees. The moment a customer interrupts or changes requirements mid-call, those bots break or loop. EchoSphere is fundamentally different: we maintain a live conversation state engine on Agora's SD-RTN network, so our agent reasons against your requirements in real-time. Coming back to your deployment...",
        stateAction: "RESOLVE_COMPETITOR_OBJECTION",
        predictiveNote: "Preemptively resolved turn-taking latency concern (<800ms Agora SD-RTN guarantee)"
      };
    }

    // 3. Price / budget objection
    if (text.includes("expensive") || text.includes("budget") || text.includes("cost") || text.includes("price") || text.includes("discount")) {
      this.currentNegotiationStage += 1;
      this.stateEngine.raiseObjection("pricing_concern", "Budget & Pricing Pushback", "Prospect seeking commercial concessions");

      if (this.currentNegotiationStage === 1) {
        this.stateEngine.adjustMomentum(4, "ROI Reframe delivered");
        return {
          intent: "PRICE_OBJECTION_STAGE_1_ROI",
          spokenResponse:
            "I completely understand budget scrutiny, Rahul. When our enterprise clients look at the ROI, our agents typically save 28 hours per SDR each month while driving a 3.4x lift in qualified meetings. In fact, most teams recoup their entire investment within the first 14 days of live inbound calls.",
          stateAction: "CONCESSION_ROI_REFRAME"
        };
      } else if (this.currentNegotiationStage === 2) {
        this.stateEngine.applyAnnualDiscount(15);
        return {
          intent: "PRICE_OBJECTION_STAGE_2_ANNUAL",
          spokenResponse:
            "Tell you what, if TechCorp is open to an annual commitment, I can immediately apply our 15% Executive Partner discount. For your 200 users, that brings your rate down to just $7.22 per seat per month. Would that align with your Q4 numbers?",
          stateAction: "CONCESSION_ANNUAL_DISCOUNT_15"
        };
      } else {
        this.stateEngine.offerPilotProgram();
        return {
          intent: "PRICE_OBJECTION_STAGE_3_PILOT",
          spokenResponse:
            "I hear you. Let's remove the risk entirely. We can set up a 30-day Risk-Free Enterprise Pilot for 50 of your seats first. We'll provide white-glove onboarding and if your team doesn't see at least a 2x pipeline lift, you pay zero. How does that sound?",
          stateAction: "CONCESSION_RISK_FREE_PILOT"
        };
      }
    }

    // 4. Demo / calendar booking
    if (text.includes("demo") || text.includes("schedule") || text.includes("calendar") || text.includes("meeting") || text.includes("book")) {
      const slot = {
        date: "Thursday, Sep 4, 2026",
        time: "3:00 PM EST",
        host: "Ananya Deshmukh (VP Enterprise Solutions)"
      };
      this.stateEngine.bookMeeting(slot);

      return {
        intent: "BOOK_ENTERPRISE_DEMO",
        spokenResponse:
          "Fantastic! I've just pulled up our executive calendar. I have Thursday at 3:00 PM EST open with Ananya Deshmukh, our VP of Enterprise Solutions. I've locked that slot for you and sent a Google Calendar invite with the Agora meeting link to your email. You're all confirmed!",
        stateAction: "BOOK_CALENDAR_SLOT",
        meetingDetails: slot
      };
    }

    // 5. Human escalation
    if (text.includes("human") || text.includes("rep") || text.includes("manager") || text.includes("executive") || text.includes("director")) {
      this.stateEngine.escalateToHuman("Prospect requested executive discussion regarding custom enterprise terms");

      return {
        intent: "HUMAN_ESCALATION",
        spokenResponse:
          "Absolutely, Rahul. I'm initiating a warm handoff right now. I've packaged our entire conversation history, your 200-seat requirements, and pricing terms so you won't have to repeat anything. Ananya from our executive team is joining our Agora voice channel right now.",
        stateAction: "WARM_HUMAN_HANDOFF"
      };
    }

    // 6. General pricing inquiry at start (50 users)
    if (text.includes("price") || text.includes("how much") || text.includes("cost") || text.includes("50")) {
      this.stateEngine.advanceDealPhase("Needs Analysis");
      return {
        intent: "INITIAL_PRICING_INQUIRY",
        spokenResponse:
          "For a 50-seat SDR deployment on our Standard Tier, pricing is $14 per user per month. That includes unlimited real-time voice minutes, full Agora SD-RTN audio transport, and direct CRM sync. How is your team currently handling inbound qualification calls?",
        stateAction: "QUOTE_STANDARD_50_SEATS"
      };
    }

    // Default fallback: conversational reasoning
    this.stateEngine.adjustMomentum(3, "Natural dialogue progression");
    return {
      intent: "NATURAL_CONVERSATION",
      spokenResponse:
        "I understand, Rahul. Building on your goal to eliminate dropped leads at TechCorp, our adaptive voice agent ensures every caller receives immediate, intelligent qualification without rigid scripts. Where would you like to focus next: technical integrations or our pilot rollout?",
      stateAction: "EXPLORE_NEXT_STEP"
    };
  }
}
