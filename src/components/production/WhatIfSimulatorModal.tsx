import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Sliders, RotateCcw, X, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface WhatIfSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatIfSimulatorModal: React.FC<WhatIfSimulatorModalProps> = ({ isOpen, onClose }) => {
  const {
    params,
    updateParams,
    resetParams,
    targetKt,
    baseForecastKt,
    effectiveForecastKt,
    netGapKt,
    shortfallRiskPct,
    riskStatus,
    mitigatedGainKt
  } = useSimulation();

  if (!isOpen) return null;

  const riskBadgeStyles = {
    'On Track': 'bg-success/15 text-success border-success/30',
    'Watch': 'bg-warning/15 text-warning border-warning/30',
    'At Risk': 'bg-amber-600/15 text-amber-700 dark:text-amber-400 border-amber-600/30',
    'Shortfall': 'bg-danger/15 text-danger border-danger/30'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-surface border border-border rounded shadow-popover w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-subtle/50">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-brand" />
            <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
              Operational What-If Simulator
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetParams}
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-text-secondary hover:text-text-primary bg-surface border border-border rounded transition-colors font-mono"
              title="Reset parameters to observed state"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-primary p-1 rounded transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5 text-xs">
          {/* Real-Time Recalibration Scoreboard */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-subtle rounded border border-border">
            <div className="text-center border-r border-border/80 pr-2">
              <div className="text-[10px] uppercase font-semibold text-text-muted">Simulated Forecast</div>
              <div className="text-2xl font-bold font-mono text-brand dark:text-brand mt-1">
                {effectiveForecastKt.toFixed(1)} <span className="text-xs font-normal">kt</span>
              </div>
              <div className="text-[10px] text-text-secondary mt-0.5">
                Baseline: {baseForecastKt} kt {mitigatedGainKt > 0 && `(+${mitigatedGainKt.toFixed(1)}kt actions)`}
              </div>
            </div>

            <div className="text-center border-r border-border/80 px-2">
              <div className="text-[10px] uppercase font-semibold text-text-muted">Target Plan Gap</div>
              <div className={`text-2xl font-bold font-mono mt-1 ${netGapKt < 0 ? 'text-danger' : 'text-success'}`}>
                {netGapKt > 0 ? `+${netGapKt}` : netGapKt} <span className="text-xs font-normal">kt</span>
              </div>
              <div className="text-[10px] text-text-secondary mt-0.5">
                Target: {targetKt} kt
              </div>
            </div>

            <div className="text-center pl-2">
              <div className="text-[10px] uppercase font-semibold text-text-muted">Shortfall Probability</div>
              <div className="text-2xl font-bold font-mono text-danger mt-1">
                {shortfallRiskPct}%
              </div>
              <div className="mt-0.5">
                <span className={`px-1.5 py-0.2 text-[10px] rounded font-mono font-medium border ${riskBadgeStyles[riskStatus]}`}>
                  ● {riskStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Simulation Sliders */}
          <div className="space-y-4">
            <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Adjust Mine Operating Variables
            </div>

            {/* Variable 1: Rainfall (mm) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-text-primary">
                  1. Forecast IMD Rainfall (Next 48 Hours)
                </span>
                <span className="font-mono font-bold text-text-primary bg-subtle px-2 py-0.5 rounded border border-border">
                  {params.rainfall_mm.toFixed(1)} mm
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="0.5"
                value={params.rainfall_mm}
                onChange={e => updateParams({ rainfall_mm: Number(e.target.value) })}
                className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-brand"
              />
              <div className="flex justify-between text-[10px] font-mono text-text-muted">
                <span>0 mm (Dry Pit)</span>
                <span>16.5 mm (Current)</span>
                <span>60 mm (Severe Flood Inundation)</span>
              </div>
            </div>

            {/* Variable 2: Equipment Downtime Delta (hrs) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-text-primary">
                  2. Fleet Unplanned Downtime Delta
                </span>
                <span className="font-mono font-bold text-text-primary bg-subtle px-2 py-0.5 rounded border border-border">
                  {params.downtime_hours_delta > 0 ? `+${params.downtime_hours_delta}` : params.downtime_hours_delta} hrs
                </span>
              </div>
              <input
                type="range"
                min="-15"
                max="35"
                step="1"
                value={params.downtime_hours_delta}
                onChange={e => updateParams({ downtime_hours_delta: Number(e.target.value) })}
                className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-brand"
              />
              <div className="flex justify-between text-[10px] font-mono text-text-muted">
                <span>-15 h (Preemptive Overhaul)</span>
                <span>0 h (Current Baseline)</span>
                <span>+35 h (Multiple Failures)</span>
              </div>
            </div>

            {/* Variable 3: Blasting Delay (hrs) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-text-primary">
                  3. Blasting Clearance Delay
                </span>
                <span className="font-mono font-bold text-text-primary bg-subtle px-2 py-0.5 rounded border border-border">
                  {params.blasting_delay_hours.toFixed(1)} hrs
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={params.blasting_delay_hours}
                onChange={e => updateParams({ blasting_delay_hours: Number(e.target.value) })}
                className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-brand"
              />
              <div className="flex justify-between text-[10px] font-mono text-text-muted">
                <span>0 h (On Schedule)</span>
                <span>4.5 h (Current Delay)</span>
                <span>12 h (Extended Suspension)</span>
              </div>
            </div>

            {/* Variable 4: Fleet Availability (%) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-text-primary">
                  4. Haul Truck Fleet Availability
                </span>
                <span className="font-mono font-bold text-text-primary bg-subtle px-2 py-0.5 rounded border border-border">
                  {params.fleet_availability_pct.toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="70"
                max="98"
                step="1"
                value={params.fleet_availability_pct}
                onChange={e => updateParams({ fleet_availability_pct: Number(e.target.value) })}
                className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-brand"
              />
              <div className="flex justify-between text-[10px] font-mono text-text-muted">
                <span>70% (Degraded)</span>
                <span>82% (Current)</span>
                <span>98% (Optimized Deployment)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border bg-subtle/40 flex items-center justify-between">
          <span className="text-[11px] text-text-muted font-mono">
            Model: GeoProd-XGB v1.2 · Real-time inference
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-brand hover:bg-brand-dark text-white rounded text-xs font-medium transition-colors"
          >
            Apply Scenario to View
          </button>
        </div>
      </div>
    </div>
  );
};
