import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { useApp } from '../../context/AppContext';

export const OverviewKpis: React.FC = () => {
  const { selectedMine } = useApp();
  const { effectiveForecastKt, targetKt, shortfallRiskPct, riskStatus } = useSimulation();

  const riskBadgeStyles = {
    'On Track': 'bg-success/15 text-success border-success/30',
    'Watch': 'bg-warning/15 text-warning border-warning/30',
    'At Risk': 'bg-amber-600/15 text-amber-700 dark:text-amber-400 border-amber-600/30',
    'Shortfall': 'bg-danger/15 text-danger border-danger/30'
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* KPI 1: Production MTD */}
      <div className="p-3.5 bg-surface border border-border rounded shadow-subtle flex flex-col justify-between">
        <div className="text-xs font-medium text-text-secondary">Production (MTD)</div>
        <div className="my-1.5 flex items-baseline gap-1.5">
          <span className="text-2xl font-semibold font-mono tracking-tight text-text-primary">92.4</span>
          <span className="text-xs font-mono text-text-muted">kt</span>
        </div>
        <div className="text-[11px] text-text-muted flex items-center justify-between">
          <span>Target: 95.0 kt</span>
          <span className="text-danger font-medium font-mono">-2.6 kt</span>
        </div>
      </div>

      {/* KPI 2: Forecast EOM */}
      <div className="p-3.5 bg-surface border border-border rounded shadow-subtle flex flex-col justify-between">
        <div className="text-xs font-medium text-text-secondary">Monthly Forecast (EOM)</div>
        <div className="my-1.5 flex items-baseline gap-1.5">
          <span className="text-2xl font-semibold font-mono tracking-tight text-brand dark:text-brand">
            {effectiveForecastKt.toFixed(1)}
          </span>
          <span className="text-xs font-mono text-text-muted">kt</span>
        </div>
        <div className="text-[11px] text-text-muted flex items-center justify-between">
          <span>Quarterly Plan: {targetKt} kt</span>
          <span className="font-mono font-medium text-text-secondary">
            Gap: <span className={effectiveForecastKt < targetKt ? 'text-danger font-semibold' : 'text-success'}>
              {(effectiveForecastKt - targetKt).toFixed(1)} kt
            </span>
          </span>
        </div>
      </div>

      {/* KPI 3: Shortfall Risk */}
      <div className="p-3.5 bg-surface border border-border rounded shadow-subtle flex flex-col justify-between">
        <div className="text-xs font-medium text-text-secondary">Shortfall Risk</div>
        <div className="my-1.5 flex items-baseline gap-2">
          <span className="text-2xl font-semibold font-mono tracking-tight text-danger">
            {shortfallRiskPct}%
          </span>
          <span className={`text-[11px] px-1.5 py-0.5 rounded font-medium border ${riskBadgeStyles[riskStatus]}`}>
            {riskStatus}
          </span>
        </div>
        <div className="text-[11px] text-text-muted">
          Constraint threshold &gt; 65%
        </div>
      </div>

      {/* KPI 4: Ore Available */}
      <div className="p-3.5 bg-surface border border-border rounded shadow-subtle flex flex-col justify-between">
        <div className="text-xs font-medium text-text-secondary">Accessible Ore In-Situ</div>
        <div className="my-1.5 flex items-baseline gap-1.5">
          <span className="text-2xl font-semibold font-mono tracking-tight text-text-primary">1.82</span>
          <span className="text-xs font-mono text-text-muted">Mt</span>
        </div>
        <div className="text-[11px] text-text-muted flex items-center justify-between">
          <span>Avg Grade: {selectedMine.gradeMnPct}% Mn</span>
          <span className="text-brand font-mono font-medium">Mansar Reef</span>
        </div>
      </div>
    </div>
  );
};
