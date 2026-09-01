"use client";

import { CheckCircle2, Clock, X } from "lucide-react";
import type { MeetingSlot } from "@/types";

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingDetails: MeetingSlot | null;
}

export default function CalendarModal({ isOpen, onClose, meetingDetails }: CalendarModalProps) {
  if (!isOpen || !meetingDetails) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="flex-row items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald" />
            <h3>Executive Enterprise Demo Scheduled</h3>
          </div>
          <button className="btn-header" onClick={onClose}>
            <X size={14} />
          </button>
        </div>

        <div className="modal-content">
          <div className="modal-panel">
            <div className="modal-kv-row">
              <span className="modal-kv-label">Date &amp; Time</span>
              <span className="modal-kv-value font-mono">
                {meetingDetails.date} at {meetingDetails.time}
              </span>
            </div>

            <div className="modal-kv-row">
              <span className="modal-kv-label">Executive Host</span>
              <span className="modal-kv-value">{meetingDetails.host}</span>
            </div>

            <div className="modal-kv-row">
              <span className="modal-kv-label">Agora Channel Link</span>
              <span className="modal-kv-value font-mono text-blue" style={{ fontSize: "11px" }}>
                agora.io/channel/echosphere-sales-room
              </span>
            </div>

            <div className="modal-kv-row">
              <span className="modal-kv-label">Scope</span>
              <span className="modal-kv-value" style={{ fontWeight: 400, color: "var(--text-secondary)" }}>
                200-Seat SOC-2 Deployment, SLA &amp; Pilot Setup
              </span>
            </div>
          </div>

          <div className="modal-banner info">
            <Clock size={14} className="text-blue" />
            <span>
              Calendar invite and Agora dial-in dispatched to <strong>rahul.sharma@techcorp.io</strong>
            </span>
          </div>
        </div>

        <div className="modal-foot">
          <button className="btn-modal-action" onClick={onClose}>
            Done &amp; Return to Cockpit
          </button>
        </div>
      </div>
    </div>
  );
}
