import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useSimulation } from '../../context/SimulationContext';
import { ActionCard } from './ActionCard';
import { ActionModal } from './ActionModal';
import { ActionAuditLog } from './ActionAuditLog';
import { CorrectiveAction } from '../../types';
import { ShieldCheck, ArrowRight, Sliders, CheckCircle2, History, Filter } from 'lucide-react';

export const ActionsView: React.FC = () => {
  const { selectedMine, setActiveTab, setIsWhatIfOpen } = useApp();
  const {
    actions,
    acceptAction,
    modifyAction,
    rejectAction,
    targetKt,
    effectiveForecastKt,
    netGapKt,
    shortfallRiskPct,
    riskStatus,
    mitigatedGainKt
  } = useSimulation();

  const [selectedActionToModify, setSelectedActionToModify] = useState<CorrectiveAction | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'resolved'>('pending');

  const pendingActions = actions.filter(a => a.status === 'Pending');
  const resolvedActions = actions.filter(a => a.status !== 'Pending');

  const displayedActions = 
    activeFilter === 'pending' ? pendingActions :
    activeFilter === 'resolved' ? resolvedActions : actions;

  const riskBadgeStyles = {
    'On Track': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    'Watch': 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    'At Risk': 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    'Shortfall': 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800'
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-10 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
            Corrective Action Decision Engine
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Operational Decision-Support for <span className="font-semibold text-text-primary">{selectedMine.name}</span> · Human-In-The-Loop Approval Required
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-text-muted">Human Approver:</span>
          <span className="font-semibold text-text-primary bg-subtle px-2.5 py-1 rounded-md border border-border">
            S. K. Mukherjee (Mine Manager)
          </span>
        </div>
      </div>

      {/* Top Shortfall & Production KPI Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Shortfall Risk */}
        <div className="p-4 bg-surface rounded-lg border border-border shadow-sm space-y-1">
          <div className="text-xs font-medium text-text-secondary">
            Shortfall Risk
          </div>
          <div className="text-2xl font-extrabold text-danger">
            {shortfallRiskPct}%
          </div>
          <div className="pt-0.5">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded-full font-semibold border ${riskBadgeStyles[riskStatus]}`}>
              <span>●</span> <span>{riskStatus}</span>
            </span>
          </div>
        </div>

        {/* Adjusted Forecast */}
        <div className="p-4 bg-surface rounded-lg border border-border shadow-sm space-y-1">
          <div className="text-xs font-medium text-text-secondary">
            Adjusted Forecast
          </div>
          <div className="text-2xl font-extrabold text-brand">
            {effectiveForecastKt.toFixed(1)} <span className="text-sm font-normal text-text-muted">kt</span>
          </div>
          <div className="text-[11px] text-text-muted pt-0.5">
            {mitigatedGainKt > 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">+{mitigatedGainKt.toFixed(1)} kt via approved actions</span>
            ) : (
              'No mitigations approved yet'
            )}
          </div>
        </div>

        {/* Quarterly Target */}
        <div className="p-4 bg-surface rounded-lg border border-border shadow-sm space-y-1">
          <div className="text-xs font-medium text-text-secondary">
            Quarterly Commitment
          </div>
          <div className="text-2xl font-extrabold text-text-primary">
            {targetKt.toFixed(0)} <span className="text-sm font-normal text-text-muted">kt</span>
          </div>
          <div className="text-[11px] text-text-muted pt-0.5">
            MOIL Balaghat Q3 Target
          </div>
        </div>

        {/* Projected Gap */}
        <div className="p-4 bg-surface rounded-lg border border-border shadow-sm space-y-1">
          <div className="text-xs font-medium text-text-secondary">
            Projected Gap to Target
          </div>
          <div className={`text-2xl font-extrabold ${netGapKt < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {netGapKt > 0 ? `+${netGapKt}` : netGapKt} <span className="text-sm font-normal text-text-muted">kt</span>
          </div>
          <div className="text-[11px] text-text-muted pt-0.5">
            {netGapKt < 0 ? 'Action required to close gap' : 'Target achieved'}
          </div>
        </div>
      </div>

      {/* Governance & Safety Guidance Note */}
      <div className="p-3 bg-subtle/70 border border-border/80 rounded-lg text-xs flex items-center justify-between gap-3 text-text-secondary">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand flex-shrink-0" />
          <span>
            <b className="text-text-primary">Decision-Support Governance Rule:</b> AI recommendations are strictly advisory and require human sign-off prior to dispatch.
          </span>
        </div>
        <button
          onClick={() => setIsWhatIfOpen(true)}
          className="text-xs font-semibold text-brand hover:underline flex items-center gap-1 flex-shrink-0"
        >
          <Sliders className="w-3 h-3" />
          <span>Open What-If Simulator</span>
        </button>
      </div>

      {/* Advisory Recommendations Section */}
      <div className="space-y-3 pt-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Segmented Filter Pills */}
          <div className="flex items-center gap-1 bg-subtle p-1 rounded-lg border border-border">
            <button
              onClick={() => setActiveFilter('pending')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                activeFilter === 'pending'
                  ? 'bg-surface text-brand font-semibold shadow-sm border border-border/80'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Pending Approval ({pendingActions.length})
            </button>
            <button
              onClick={() => setActiveFilter('resolved')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                activeFilter === 'resolved'
                  ? 'bg-surface text-brand font-semibold shadow-sm border border-border/80'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Resolved / Decided ({resolvedActions.length})
            </button>
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                activeFilter === 'all'
                  ? 'bg-surface text-brand font-semibold shadow-sm border border-border/80'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              All ({actions.length})
            </button>
          </div>

          <div className="text-xs text-text-muted flex items-center gap-2">
            <span>Model: GeoProd-Prescriptive v1.2</span>
            <span>·</span>
            <span className="text-emerald-600 font-medium">Confidence: 94.2%</span>
          </div>
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {displayedActions.map(action => (
            <ActionCard
              key={action.id}
              action={action}
              onAccept={id => acceptAction(id)}
              onModify={act => setSelectedActionToModify(act)}
              onReject={(id, reason) => rejectAction(id, reason)}
            />
          ))}

          {displayedActions.length === 0 && (
            <div className="col-span-2 p-10 bg-surface rounded-lg border border-border text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <div className="text-sm font-semibold text-text-primary">
                All Recommended Actions Have Been Processed
              </div>
              <p className="text-xs text-text-secondary max-w-md mx-auto">
                No actions currently pending human review. Production forecast reflects approved operational adjustments.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Decision Audit Trail Ledger */}
      <div className="pt-2">
        <ActionAuditLog />
      </div>

      {/* Modal for Modifying Action Parameters */}
      <ActionModal
        action={selectedActionToModify}
        isOpen={!!selectedActionToModify}
        onClose={() => setSelectedActionToModify(null)}
        onSave={(id, updated) => {
          modifyAction(id, updated);
          setSelectedActionToModify(null);
        }}
      />
    </div>
  );
};
