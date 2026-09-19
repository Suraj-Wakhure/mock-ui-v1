import React from 'react';
import { useApp } from '../../context/AppContext';
import { useSimulation } from '../../context/SimulationContext';
import { Sliders, ShieldCheck, ChevronRight, Activity } from 'lucide-react';

export const AppTopBar: React.FC = () => {
  const { selectedMine, activeTab, setIsWhatIfOpen } = useApp();
  const { effectiveForecastKt, targetKt, shortfallRiskPct, riskStatus, simulationDeltaKt } = useSimulation();

  const tabTitles = {
    explore: 'Exploration GIS & Prospectivity Model',
    production: 'Production Forecasting & Multi-Horizon Uncertainty',
    actions: 'Corrective Action Decision Engine',
    overview: 'Operations Cockpit & Operational Health'
  };

  const riskBadgeStyles = {
    'On Track': 'bg-success/15 text-success border-success/30',
    'Watch': 'bg-warning/15 text-warning border-warning/30',
    'At Risk': 'bg-amber-600/15 text-amber-700 dark:text-amber-400 border-amber-600/30',
    'Shortfall': 'bg-danger/15 text-danger border-danger/30'
  };

  return (
    <header className="h-12 border-b border-border bg-surface px-4 flex items-center justify-between select-none z-20 flex-shrink-0">
      {/* Breadcrumb & Title */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs font-semibold text-text-secondary truncate">
          {selectedMine.name}
        </span>
        <ChevronRight className="w-3 h-3 text-text-muted flex-shrink-0" />
        <h1 className="text-xs font-bold text-text-primary truncate">
          {tabTitles[activeTab]}
        </h1>
      </div>

      {/* Real-Time Operational Telemetry Strip */}
      <div className="hidden lg:flex items-center gap-4 text-xs font-sans">
        <div className="flex items-center gap-1.5">
          <span className="text-text-muted">Target:</span>
          <span className="font-semibold text-text-primary">{targetKt} kt</span>
        </div>

        <span className="text-border">|</span>

        <div className="flex items-center gap-1.5">
          <span className="text-text-muted">Forecast:</span>
          <span className="font-semibold text-brand">{effectiveForecastKt.toFixed(1)} kt</span>
        </div>

        <span className="text-border">|</span>

        <div className="flex items-center gap-1.5">
          <span className="text-text-muted">Risk:</span>
          <span className={`px-2 py-0.5 text-[11px] rounded-full font-semibold border ${riskBadgeStyles[riskStatus]}`}>
            ● {shortfallRiskPct}% ({riskStatus})
          </span>
        </div>

        <span className="text-border">|</span>

        <button
          onClick={() => setIsWhatIfOpen(true)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-sans font-medium transition-colors ${
            Math.abs(simulationDeltaKt) > 0.1
              ? 'bg-warning/10 border-warning text-warning'
              : 'bg-subtle hover:bg-border/60 border-border text-text-primary'
          }`}
        >
          <Sliders className="w-3 h-3 text-copper" />
          <span>Simulate</span>
          {Math.abs(simulationDeltaKt) > 0.1 && (
            <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
          )}
        </button>
      </div>
    </header>
  );
};
