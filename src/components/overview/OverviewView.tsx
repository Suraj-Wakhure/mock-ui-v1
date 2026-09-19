import React from 'react';
import { useApp } from '../../context/AppContext';
import { useSimulation } from '../../context/SimulationContext';
import { OverviewKpis } from './OverviewKpis';
import { OverviewChart } from './OverviewChart';
import { OverviewPriorityMatrix } from './OverviewPriorityMatrix';

export const OverviewView: React.FC = () => {
  const { selectedMine } = useApp();
  const { shortfallRiskPct, riskStatus } = useSimulation();

  const riskBadgeStyles = {
    'On Track': 'bg-success/15 text-success border-success/30',
    'Watch': 'bg-warning/15 text-warning border-warning/30',
    'At Risk': 'bg-amber-600/15 text-amber-700 dark:text-amber-400 border-amber-600/30',
    'Shortfall': 'bg-danger/15 text-danger border-danger/30'
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-10">
      {/* Title & Metadata Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-text-primary">
            Operations & Reserve Overview
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Active Property: <span className="font-medium text-text-primary">{selectedMine.name}</span> ({selectedMine.type}) · {selectedMine.location} · Today: <span className="font-mono font-medium text-text-primary">19 Sep 2026</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary">Current Operating State:</span>
          <span className={`px-2 py-0.5 text-xs font-medium rounded border font-mono ${riskBadgeStyles[riskStatus]}`}>
            ● {riskStatus.toUpperCase()} ({shortfallRiskPct}% SHORTFALL RISK)
          </span>
        </div>
      </div>

      {/* 4 Core KPIs Strip */}
      <OverviewKpis />

      {/* Primary Chart: Production vs Target (Last 30 Days) */}
      <OverviewChart />

      {/* Bottom Grid: Operational Priorities & Mine Status */}
      <OverviewPriorityMatrix />
    </div>
  );
};
