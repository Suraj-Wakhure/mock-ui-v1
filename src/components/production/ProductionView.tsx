import React from 'react';
import { useApp } from '../../context/AppContext';
import { useSimulation } from '../../context/SimulationContext';
import { ProductionChart } from './ProductionChart';
import { RiskDriversCard } from './RiskDriversCard';
import { Sliders, ArrowRight, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

export const ProductionView: React.FC = () => {
  const { selectedMine, setActiveTab, setIsWhatIfOpen } = useApp();
  const {
    targetKt,
    effectiveForecastKt,
    netGapKt,
    shortfallRiskPct,
    riskStatus,
    simulationDeltaKt,
    mitigatedGainKt,
    actions
  } = useSimulation();

  const pendingActions = actions.filter(a => a.status === 'Pending');

  const riskBadgeStyles = {
    'On Track': 'bg-success/15 text-success border-success/30',
    'Watch': 'bg-warning/15 text-warning border-warning/30',
    'At Risk': 'bg-amber-600/15 text-amber-700 dark:text-amber-400 border-amber-600/30',
    'Shortfall': 'bg-danger/15 text-danger border-danger/30'
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-text-primary">
            Production Forecast & Shortfall Intelligence
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Planning Cycle: Q3 2026 · Facility: <span className="font-semibold text-text-primary">{selectedMine.name}</span> · Time-Aware Multi-Horizon Model
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsWhatIfOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-border hover:bg-subtle text-text-primary rounded text-xs font-medium transition-colors shadow-subtle"
          >
            <Sliders className="w-3.5 h-3.5 text-brand" />
            <span>Launch What-If Simulator</span>
            {Math.abs(simulationDeltaKt) > 0.1 && (
              <span className="w-2 h-2 rounded-full bg-warning" />
            )}
          </button>
        </div>
      </div>

      {/* 4 Core KPIs: Target, Forecast, Gap, Risk */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Target */}
        <div className="p-3.5 bg-surface border border-border rounded shadow-subtle">
          <div className="text-xs font-medium text-text-secondary">Planned Target</div>
          <div className="my-1 flex items-baseline gap-1">
            <span className="text-2xl font-semibold font-mono tracking-tight text-text-primary">
              {targetKt.toFixed(0)}
            </span>
            <span className="text-xs font-mono text-text-muted">kt</span>
          </div>
          <div className="text-[11px] text-text-muted">Quarterly plan commitment</div>
        </div>

        {/* Forecast */}
        <div className="p-3.5 bg-surface border border-border rounded shadow-subtle">
          <div className="text-xs font-medium text-text-secondary">ML Production Forecast</div>
          <div className="my-1 flex items-baseline gap-1">
            <span className="text-2xl font-semibold font-mono tracking-tight text-brand dark:text-brand">
              {effectiveForecastKt.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-text-muted">kt</span>
          </div>
          <div className="text-[11px] text-text-muted font-mono">
            {mitigatedGainKt > 0 ? (
              <span className="text-success font-medium">+{mitigatedGainKt.toFixed(1)} kt via approved actions</span>
            ) : (
              'Baseline P50 projection'
            )}
          </div>
        </div>

        {/* Gap */}
        <div className="p-3.5 bg-surface border border-border rounded shadow-subtle">
          <div className="text-xs font-medium text-text-secondary">Forecast Target Gap</div>
          <div className="my-1 flex items-baseline gap-1">
            <span
              className={`text-2xl font-semibold font-mono tracking-tight ${
                netGapKt < 0 ? 'text-danger' : 'text-success'
              }`}
            >
              {netGapKt > 0 ? `+${netGapKt}` : netGapKt}
            </span>
            <span className="text-xs font-mono text-text-muted">kt</span>
          </div>
          <div className="text-[11px] text-text-muted font-mono">
            {netGapKt < 0 ? 'Production deficit projected' : 'Production meeting plan'}
          </div>
        </div>

        {/* Risk */}
        <div className="p-3.5 bg-surface border border-border rounded shadow-subtle">
          <div className="text-xs font-medium text-text-secondary">Shortfall Risk Probability</div>
          <div className="my-1 flex items-baseline gap-2">
            <span className="text-2xl font-semibold font-mono tracking-tight text-danger">
              {shortfallRiskPct}%
            </span>
            <span className={`text-[11px] px-1.5 py-0.5 rounded font-medium border font-mono ${riskBadgeStyles[riskStatus]}`}>
              {riskStatus}
            </span>
          </div>
          <div className="text-[11px] text-text-muted">
            Calibrated against historical outcomes
          </div>
        </div>
      </div>

      {/* Primary Chart: Production vs Plan with P10/P50/P90 Fan Band */}
      <div className="bg-surface border border-border rounded shadow-subtle p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-2 border-b border-border/70">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">
              Daily Production & 14-Day Forward Forecast
            </h2>
            <p className="text-xs text-text-muted">
              Historical actuals (solid dark) vs Forward ML forecast with P10–P90 uncertainty fan (dashed teal)
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono mt-2 sm:mt-0">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-text-primary" />
              <span className="text-text-secondary">Observed Actual</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-brand border-t border-dashed" />
              <span className="text-text-secondary">Forecast P50</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-2 bg-brand/15 border border-brand/40 rounded-sm" />
              <span className="text-text-secondary">Uncertainty (P10–P90)</span>
            </div>
          </div>
        </div>

        <ProductionChart simulationOffsetKt={simulationDeltaKt + mitigatedGainKt} />
      </div>

      {/* Bottom Grid: Forecast Range Breakdown & Risk Constraints */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Forecast Range Summary */}
        <div className="bg-surface border border-border rounded shadow-subtle p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-border/70">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Probabilistic Forecast Intervals
                </h3>
              </div>
              <span className="text-[10px] font-mono text-text-muted">30-Day Multi-Horizon</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 font-mono text-center">
              <div className="p-3 bg-subtle rounded border border-border/60">
                <div className="text-[10px] text-text-muted uppercase">P10 (Pessimistic)</div>
                <div className="text-lg font-bold text-danger mt-1">
                  {(effectiveForecastKt * 0.92).toFixed(1)} kt
                </div>
                <div className="text-[10px] text-text-secondary mt-0.5">High rain + delays</div>
              </div>

              <div className="p-3 bg-brand/5 rounded border border-brand/30">
                <div className="text-[10px] text-brand uppercase font-bold">P50 (Expected)</div>
                <div className="text-lg font-bold text-brand mt-1">
                  {effectiveForecastKt.toFixed(1)} kt
                </div>
                <div className="text-[10px] text-text-secondary mt-0.5">Standard baseline</div>
              </div>

              <div className="p-3 bg-subtle rounded border border-border/60">
                <div className="text-[10px] text-text-muted uppercase">P90 (Optimistic)</div>
                <div className="text-lg font-bold text-success mt-1">
                  {(effectiveForecastKt * 1.08).toFixed(1)} kt
                </div>
                <div className="text-[10px] text-text-secondary mt-0.5">Actions executed</div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-subtle rounded border border-border/60 text-xs text-text-secondary leading-relaxed">
              <span className="font-semibold text-text-primary">Modeling note:</span> Time-aware historical split validates test MAE at <span className="font-mono font-medium">185 tonnes/day</span> and Shortfall Classification ROC-AUC at <span className="font-mono font-medium">0.892</span>.
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-xs text-text-muted">
              {pendingActions.length} recommendations available
            </span>
            <button
              onClick={() => setActiveTab('actions')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-brand hover:bg-brand-dark rounded transition-colors shadow-subtle"
            >
              <span>Review Corrective Actions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Risk Constraints Breakdown */}
        <RiskDriversCard />
      </div>
    </div>
  );
};
