import React, { useState } from 'react';
import { CorrectiveAction } from '../../types';
import { Check, Edit3, X, Clock, AlertCircle, ArrowUpRight } from 'lucide-react';

interface ActionCardProps {
  action: CorrectiveAction;
  onAccept: (id: string) => void;
  onModify: (action: CorrectiveAction) => void;
  onReject: (id: string, reason: string) => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  action,
  onAccept,
  onModify,
  onReject
}) => {
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState('Safety clearance limitation');

  const urgencyStyles = {
    Immediate: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-900',
    High: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-900',
    Medium: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border-sky-200 dark:border-sky-900'
  };

  const handleRejectConfirm = () => {
    onReject(action.id, rejectReason);
    setRejectMode(false);
  };

  return (
    <div className="bg-surface border border-border rounded-lg shadow-sm p-4 space-y-3.5 transition-all hover:border-brand/40 font-sans">
      {/* Card Header: Tags & Time */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-border/60">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-text-primary px-2 py-0.5 rounded bg-subtle border border-border">
            {action.id}
          </span>
          <span className="text-xs font-medium text-text-secondary px-2 py-0.5 rounded bg-subtle">
            {action.category}
          </span>
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${urgencyStyles[action.urgency]}`}>
            {action.urgency} Urgency
          </span>
        </div>
        <div className="text-xs text-text-muted flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>{action.created_at}</span>
        </div>
      </div>

      {/* Action Title */}
      <div>
        <h3 className="text-sm font-semibold text-text-primary leading-snug">
          {action.title}
        </h3>
      </div>

      {/* Main Solution Box */}
      <div className="space-y-2">
        {/* Recommended Action Box */}
        <div className="p-3 bg-brand/5 dark:bg-brand/10 rounded-md border border-brand/20 text-xs">
          <div className="font-semibold text-brand text-xs mb-1 flex items-center gap-1.5">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Recommended Intervention:</span>
          </div>
          <p className="text-text-primary leading-relaxed">
            {action.recommended_action}
          </p>
        </div>

        {/* Diagnosis & Operational Context */}
        <div className="p-3 bg-subtle/70 rounded-md border border-border/60 text-xs space-y-1.5">
          <div className="flex items-start gap-1.5">
            <span className="text-text-muted font-medium min-w-[72px]">Detected:</span>
            <span className="text-text-primary">{action.constraint_detected}</span>
          </div>
          <div className="flex items-start gap-1.5 pt-1 border-t border-border/40">
            <span className="text-text-muted font-medium min-w-[72px]">Root Cause:</span>
            <span className="text-text-secondary">{action.root_cause}</span>
          </div>
        </div>
      </div>

      {/* Impact & KPI Metric Strip */}
      <div className="flex items-center justify-between p-2.5 bg-subtle/50 rounded-md border border-border/60 text-xs">
        <span className="text-text-secondary font-medium">Estimated Production Recovery:</span>
        <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
          {action.estimated_impact_tonnes}
        </span>
      </div>

      {/* Rejection input mode */}
      {rejectMode && (
        <div className="p-3 bg-danger/5 border border-danger/20 rounded-md text-xs space-y-2">
          <div className="font-semibold text-danger flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Specify Rejection Justification:</span>
          </div>
          <input
            type="text"
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
            className="w-full p-2 bg-surface border border-border rounded text-xs text-text-primary focus:outline-none focus:border-danger"
            placeholder="Reason for rejecting advisory recommendation..."
          />
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => setRejectMode(false)}
              className="px-2.5 py-1 text-xs border border-border rounded hover:bg-subtle"
            >
              Cancel
            </button>
            <button
              onClick={handleRejectConfirm}
              className="px-3 py-1 text-xs bg-danger text-white rounded font-medium hover:bg-danger/90 transition-colors"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      )}

      {/* Decision Buttons (Human-in-the-loop) */}
      <div className="pt-2 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="text-[11px] text-text-muted">
          {action.model_version} · Advisory Only
        </div>

        {action.status === 'Pending' && !rejectMode && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRejectMode(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-danger bg-subtle hover:bg-danger/10 border border-border rounded-md transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reject</span>
            </button>
            <button
              onClick={() => onModify(action)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-text-primary hover:text-brand bg-subtle hover:bg-brand/10 border border-border rounded-md transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Modify</span>
            </button>
            <button
              onClick={() => onAccept(action.id)}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-brand hover:bg-brand-dark rounded-md transition-colors shadow-sm"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Approve & Dispatch</span>
            </button>
          </div>
        )}

        {action.status === 'Accepted' && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
            <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
            <span>Approved & Scheduled for Dispatch</span>
          </div>
        )}

        {action.status === 'Modified' && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-md border border-amber-200 dark:border-amber-800">
            <Edit3 className="w-3.5 h-3.5 text-amber-600" />
            <span>Modified & Approved</span>
          </div>
        )}

        {action.status === 'Rejected' && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md border border-slate-200 dark:border-slate-700">
            <X className="w-3.5 h-3.5 text-slate-500" />
            <span>Rejected by Manager</span>
          </div>
        )}
      </div>
    </div>
  );
};
