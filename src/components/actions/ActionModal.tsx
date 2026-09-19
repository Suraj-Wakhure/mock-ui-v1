import React, { useState } from 'react';
import { CorrectiveAction } from '../../types';
import { X, Sliders, CheckSquare, AlertCircle } from 'lucide-react';

interface ActionModalProps {
  action: CorrectiveAction | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmModify: (id: string, notes: string, adjustedImpactKt: number) => void;
}

export const ActionModal: React.FC<ActionModalProps> = ({
  action,
  isOpen,
  onClose,
  onConfirmModify
}) => {
  if (!isOpen || !action) return null;

  const [notes, setNotes] = useState(
    `Approved with modification: Shift allocation changed to 2 haulers (TRK-12 & TRK-14) during day shift only.`
  );
  const [adjustedImpact, setAdjustedImpact] = useState<number>(action.impact_val_kt);

  const handleSave = () => {
    onConfirmModify(action.id, notes, adjustedImpact);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-surface border border-border rounded shadow-popover w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-subtle/60">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-brand" />
            <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
              Modify Operational Action {action.id}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div>
            <div className="text-[11px] font-semibold text-text-secondary uppercase">
              Action Recommendation
            </div>
            <div className="font-semibold text-text-primary text-sm mt-0.5">
              {action.title}
            </div>
            <p className="text-text-secondary mt-1">{action.recommended_action}</p>
          </div>

          <div className="p-3 bg-subtle rounded border border-border/80 space-y-1">
            <div className="flex justify-between">
              <span className="text-text-secondary">AI Model Recommendation:</span>
              <span className="font-mono font-medium text-text-primary">{action.model_version}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Nominal Impact:</span>
              <span className="font-mono font-bold text-success">{action.estimated_impact_tonnes}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-medium text-text-primary flex justify-between">
              <span>Adjust Expected Production Impact (kt):</span>
              <span className="font-mono font-bold text-brand">+{adjustedImpact.toFixed(1)} kt</span>
            </label>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={adjustedImpact}
              onChange={e => setAdjustedImpact(Number(e.target.value))}
              className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-brand"
            />
            <div className="flex justify-between text-[10px] font-mono text-text-muted">
              <span>+1.0 kt (Conservative)</span>
              <span>+{action.impact_val_kt} kt (AI Nominal)</span>
              <span>+20.0 kt (Aggressive)</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-medium text-text-primary">
              Operational Modification Notes & Dispatch Justification:
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full p-2.5 bg-surface border border-border rounded text-xs text-text-primary focus:outline-none focus:border-brand"
              placeholder="Specify machine numbers, shift changes, or stope reallocations..."
            />
          </div>

          <div className="p-2.5 bg-warning/10 border border-warning/30 rounded text-[11px] text-text-primary flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
            <span>
              This decision will be permanently committed to the immutable <b>Audit Trail</b> with your credentials and timestamp.
            </span>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-border bg-subtle/40 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 border border-border hover:bg-subtle text-text-secondary rounded text-xs font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 bg-brand hover:bg-brand-dark text-white rounded text-xs font-medium transition-colors shadow-subtle flex items-center gap-1.5"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Approve with Modifications</span>
          </button>
        </div>
      </div>
    </div>
  );
};
