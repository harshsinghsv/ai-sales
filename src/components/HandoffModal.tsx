"use client";

import { UserCheck, Radio, X, ArrowRight } from "lucide-react";
import type { ConversationState } from "@/types";

interface HandoffModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: ConversationState | null;
}

export default function HandoffModal({ isOpen, onClose, state }: HandoffModalProps) {
  if (!isOpen || !state) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="flex-row items-center gap-2">
            <UserCheck size={16} className="text-amber" />
            <h3>Warm Human Handoff Dispatcher</h3>
          </div>
          <button className="btn-header" onClick={onClose}>
            <X size={14} />
          </button>
        </div>

        <div className="modal-content">
          <div className="modal-banner success" style={{ justifyContent: "space-between" }}>
            <div className="flex-row items-center gap-2">
              <Radio size={12} />
              <span>
                Agora Channel <strong>echosphere-sales-room</strong> connected
              </span>
            </div>
            <span className="font-mono text-secondary" style={{ fontSize: "10.5px" }}>
              Assignee: Ananya Deshmukh (VP Sales)
            </span>
          </div>

          <div className="modal-panel-grid">
            <div className="modal-panel">
              <span className="modal-section-label">Prospect Profile</span>
              <div className="modal-kv-row">
                <span className="modal-kv-label">Contact</span>
                <span className="modal-kv-value">
                  {state.customer.name} ({state.customer.role})
                </span>
              </div>
              <div className="modal-kv-row">
                <span className="modal-kv-label">Company</span>
                <span className="modal-kv-value">{state.customer.company}</span>
              </div>
              <div className="modal-kv-row">
                <span className="modal-kv-label">Team Scope</span>
                <span className="modal-kv-value font-mono text-blue">{state.customer.team_size} Seats</span>
              </div>
              <div className="modal-kv-row">
                <span className="modal-kv-label">BANT Score</span>
                <span className="modal-kv-value font-mono text-emerald">{state.qualification.score}% Qualified</span>
              </div>
            </div>

            <div className="modal-panel">
              <span className="modal-section-label">Commercial Context</span>
              <div className="modal-kv-row">
                <span className="modal-kv-label">Pricing Tier</span>
                <span className="modal-kv-value">{state.deal.pricing_tier}</span>
              </div>
              <div className="modal-kv-row">
                <span className="modal-kv-label">Quoted Rate</span>
                <span className="modal-kv-value font-mono text-emerald">{state.deal.unit_price}</span>
              </div>
              <div className="modal-kv-row">
                <span className="modal-kv-label">Monthly MRR</span>
                <span className="modal-kv-value font-mono text-emerald">{state.deal.monthly_total}</span>
              </div>
              <div className="modal-kv-row">
                <span className="modal-kv-label">Pilot Concession</span>
                <span className="modal-kv-value">{state.deal.pilot_offered ? "30-Day Risk-Free Granted" : "Standard"}</span>
              </div>
            </div>
          </div>

          <div className="modal-panel">
            <span className="modal-section-label">Resolved Objections Log</span>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {state.objections.resolved.length === 0 && (
                <span className="modal-objection-line" style={{ color: "var(--text-muted)" }}>
                  No objections raised yet this call.
                </span>
              )}
              {state.objections.resolved.map((res, i) => (
                <div key={i} className="modal-objection-line">
                  &bull; <strong>{res.label}:</strong> {res.resolutionNote}
                </div>
              ))}
            </div>
          </div>

          <div className="modal-banner note">
            <ArrowRight size={14} className="text-blue" style={{ flexShrink: 0, marginTop: "2px" }} />
            <span>
              Recommended rep action: Validate custom MSA enterprise SLA terms, confirm {state.customer.team_size}-seat SOC-2
              VPC tenant deployment, and finalize pilot paperwork without repeating preliminary discovery.
            </span>
          </div>
        </div>

        <div className="modal-foot">
          <button className="btn-modal-action" onClick={onClose}>
            Resume Active Call
          </button>
        </div>
      </div>
    </div>
  );
}
