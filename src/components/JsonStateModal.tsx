"use client";

import { useState } from "react";
import { Copy, Check, X, Code2 } from "lucide-react";
import type { ConversationState } from "@/types";

interface JsonStateModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: ConversationState | null;
}

export default function JsonStateModal({ isOpen, onClose, state }: JsonStateModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !state) return null;

  const jsonString = JSON.stringify(state, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="flex-row items-center gap-2">
            <Code2 size={16} className="text-blue" />
            <h3>Live Conversation State Machine</h3>
          </div>
          <div className="flex-row items-center gap-2">
            <button className="btn-header" onClick={handleCopy}>
              {copied ? <Check size={12} className="text-emerald" /> : <Copy size={12} />}
              <span>{copied ? "Copied" : "Copy JSON"}</span>
            </button>
            <button className="btn-header" onClick={onClose}>
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="modal-content">
          <pre className="json-pre-box">
            <code>{jsonString}</code>
          </pre>
        </div>

        <div className="modal-foot">
          <button className="btn-modal-action" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
