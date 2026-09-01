"use client";

import { useState } from "react";
import { Brain, Layers, Database, Calendar, UserCheck, CheckCircle2, TrendingUp, Zap, Activity } from "lucide-react";
import MomentumChart from "./MomentumChart";
import type { ConversationState, CrmContact } from "@/types";

interface StateCockpitProps {
  state: ConversationState;
  crm: CrmContact;
  onOpenCalendarModal: () => void;
  onOpenHandoffModal: () => void;
}

export default function StateCockpit({ state, crm, onOpenCalendarModal, onOpenHandoffModal }: StateCockpitProps) {
  const [activeTab, setActiveTab] = useState<"cockpit" | "crm">("cockpit");

  const { customer, qualification, deal, objections, sentiment } = state;

  const requirementsCount = customer.team_size > 50 ? "4 / 5" : "3 / 5";

  return (
    <div className="state-studio-layout">
      <div className="studio-tabs-bar">
        <div className="tab-pill-group">
          <button
            className={`studio-tab-btn ${activeTab === "cockpit" ? "active" : ""}`}
            onClick={() => setActiveTab("cockpit")}
          >
            <Layers size={13} />
            <span>State Machine &amp; Reasoning</span>
          </button>

          <button className={`studio-tab-btn ${activeTab === "crm" ? "active" : ""}`} onClick={() => setActiveTab("crm")}>
            <Database size={13} />
            <span>HubSpot CRM Sync</span>
          </button>
        </div>

        <div className="action-pill-group">
          {deal.demo_booked && (
            <button className="action-badge-btn success" onClick={onOpenCalendarModal}>
              <Calendar size={12} />
              <span>GCal Demo Booked</span>
            </button>
          )}

          {deal.escalated_to_human && (
            <button className="action-badge-btn warning" onClick={onOpenHandoffModal}>
              <UserCheck size={12} />
              <span>Warm Human Handoff</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === "cockpit" ? (
        <div className="studio-scrollable-deck">
          {/* Conversation State */}
          <div className="studio-card">
            <div className="card-top-row">
              <div className="flex-row items-center gap-2">
                <Activity size={14} className="text-lime" />
                <h4 className="card-heading">Conversation State Machine</h4>
              </div>
              <span className="badge-live-tag">MUTATING IN MEMORY</span>
            </div>

            <div className="state-five-grid">
              <div className="state-cell">
                <span className="cell-k">Requirements</span>
                <span className="cell-v text-lime">{requirementsCount}</span>
                <span className="cell-sub">{customer.team_size} Seats Target</span>
              </div>

              <div className="state-cell">
                <span className="cell-k">Objections</span>
                <span className={`cell-v ${objections.active.length > 0 ? "text-amber" : "text-emerald"}`}>
                  {objections.active.length} Active
                </span>
                <span className="cell-sub">{objections.resolved.length} Resolved</span>
              </div>

              <div className="state-cell">
                <span className="cell-k">Qualification</span>
                <span className="cell-v text-lime">{qualification.score}%</span>
                <span className="cell-sub">BANT Score</span>
              </div>

              <div className="state-cell">
                <span className="cell-k">Deal Phase</span>
                <span className="cell-v text-blue" style={{ fontSize: "13px" }}>
                  {deal.phase}
                </span>
                <span className="cell-sub">Step {deal.phase_index + 1} of 5</span>
              </div>

              <div className="state-cell">
                <span className="cell-k">Sentiment</span>
                <span className="cell-v text-title" style={{ fontSize: "13px" }}>
                  {sentiment.current}
                </span>
                <span className="cell-sub">Acoustic Tone</span>
              </div>
            </div>

            <div className="commercials-unified-card">
              <div className="comm-col-left">
                <span className="comm-label">Live Commercial Terms</span>
                <div className="comm-price-display">
                  <span className="comm-price text-lime">{deal.unit_price}</span>
                </div>
                <span className="comm-mrr-text">
                  Monthly Total: <strong>{deal.monthly_total}</strong> ({deal.pricing_tier})
                </span>
              </div>

              <div className="comm-col-right">
                <span className="comm-label">Active Incentives &amp; Concessions</span>
                <div className="chips-flex-wrap">
                  {deal.annual_commitment && <span className="concession-pill">15% Volume Incentive Granted</span>}
                  {deal.pilot_offered && <span className="concession-pill pilot">30-Day Risk-Free Enterprise Pilot</span>}
                  {customer.team_size > 50 && <span className="concession-pill scale">Scaled 50 &rarr; 200 Seats</span>}
                  {!deal.annual_commitment && !deal.pilot_offered && (
                    <span className="concession-pill neutral">Standard Terms Active</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Reasoning Engine */}
          <div className="studio-card">
            <div className="card-top-row">
              <div className="flex-row items-center gap-2">
                <Brain size={15} className="text-lime" />
                <h4 className="card-heading">Reasoning Engine</h4>
              </div>
              <span className="font-mono text-muted" style={{ fontSize: "10px" }}>
                LLM State Reasoner
              </span>
            </div>

            <div className="brain-trace-container">
              <div className="brain-avatar-icon">
                <Brain size={22} />
              </div>

              <div className="brain-steps-list">
                <div className="trace-step-item active">
                  <CheckCircle2 size={12} className="text-lime" />
                  <span>Real-time speech intent analysis &amp; objection detection</span>
                </div>
                <div className="trace-step-item active">
                  <CheckCircle2 size={12} className="text-lime" />
                  <span>Mutating state: BANT score updated, capacity scale applied</span>
                </div>
                <div className="trace-step-item active">
                  <CheckCircle2 size={12} className="text-lime" />
                  <span>Evaluating strategic concession ladder from negotiation playbook</span>
                </div>
              </div>
            </div>

            <div className="next-best-action-banner">
              <span className="nba-tag">Strategic Next Best Action</span>
              <div className="nba-message">
                <Zap size={14} className="text-lime" />
                <span>{deal.next_best_action}</span>
              </div>
            </div>
          </div>

          {/* Deal Pipeline */}
          <div className="studio-card">
            <div className="card-top-row">
              <h4 className="card-heading">Deal Pipeline Progress</h4>
              <span className="font-mono text-lime" style={{ fontSize: "11px" }}>
                Current: {deal.phase}
              </span>
            </div>

            <div className="horizontal-pipeline-track">
              {deal.phases_list.map((phaseName, index) => {
                const isPassed = index < deal.phase_index;
                const isCurrent = index === deal.phase_index;
                return (
                  <div key={phaseName} className={`pipeline-node ${isPassed ? "passed" : ""} ${isCurrent ? "current" : ""}`}>
                    <div className="node-marker">{index + 1}</div>
                    <span className="node-label">{phaseName}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Momentum */}
          <div className="studio-card">
            <div className="card-top-row">
              <div className="flex-row items-center gap-2">
                <TrendingUp size={14} className="text-lime" />
                <h4 className="card-heading">Deal Momentum Curve</h4>
              </div>
              <span className="font-mono text-lime" style={{ fontSize: "12px", fontWeight: 700 }}>
                {sentiment.momentum_score}% Momentum
              </span>
            </div>

            <MomentumChart trend={sentiment.trend} currentScore={sentiment.momentum_score} />
          </div>
        </div>
      ) : (
        <div className="studio-scrollable-deck">
          <div className="studio-card">
            <div className="card-top-row">
              <h4 className="card-heading">HubSpot CRM Deal Sync</h4>
              <span className="badge-live-tag">{crm.deal_stage}</span>
            </div>

            <div className="state-five-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div className="state-cell">
                <span className="cell-k">Contact Name</span>
                <span className="cell-v" style={{ fontSize: "13px" }}>
                  {crm.name}
                </span>
                <span className="cell-sub font-mono">{crm.email}</span>
              </div>

              <div className="state-cell">
                <span className="cell-k">Contract Value</span>
                <span className="cell-v text-lime" style={{ fontSize: "13px" }}>
                  {crm.deal_amount}
                </span>
                <span className="cell-sub">{crm.company}</span>
              </div>
            </div>

            <span className="card-heading" style={{ marginTop: "4px" }}>
              Real-Time Activity Log
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {crm.activities.map((act) => (
                <div key={act.id} className="crm-activity-row">
                  <div className="crm-activity-row-top">
                    <span className="crm-activity-text">{act.text}</span>
                    <span className="crm-activity-time">{act.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
