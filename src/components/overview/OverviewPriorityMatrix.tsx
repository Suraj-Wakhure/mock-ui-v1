import React from 'react';
import { useApp } from '../../context/AppContext';
import { useSimulation } from '../../context/SimulationContext';
import { AlertTriangle, ArrowRight, Wrench, CloudRain, Clock, ShieldAlert } from 'lucide-react';

export const OverviewPriorityMatrix: React.FC = () => {
  const { setActiveTab, setIsWhatIfOpen } = useApp();
  const { actions } = useSimulation();

  const pendingActions = actions.filter(a => a.status === 'Pending');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Priority Constraints & Action Box */}
      <div className="bg-surface border border-border rounded shadow-subtle p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-border/70">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Active Risk Constraints
              </h3>
            </div>
            <span className="text-[11px] font-mono font-medium text-danger bg-danger/10 px-1.5 py-0.5 rounded">
              3 Constraining Factors
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="p-2.5 bg-subtle rounded border border-border/60 flex items-start justify-between">
              <div className="flex items-start gap-2.5">
                <Wrench className="w-4 h-4 text-copper mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs font-medium text-text-primary">Equipment Downtime Escalation</div>
                  <div className="text-[11px] text-text-secondary">
                    EXC-01 hydraulic line leak (8.5h) & TRK-07 retarder overheat (10h)
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-mono text-danger font-medium">High</span>
            </div>

            <div className="p-2.5 bg-subtle rounded border border-border/60 flex items-start justify-between">
              <div className="flex items-start gap-2.5">
                <CloudRain className="w-4 h-4 text-info mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs font-medium text-text-primary">IMD Rainfall Inflow Risk</div>
                  <div className="text-[11px] text-text-secondary">
                    16.5 mm precipitation today; forecast 35 mm depression in 48h
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-mono text-warning font-medium">Medium</span>
            </div>

            <div className="p-2.5 bg-subtle rounded border border-border/60 flex items-start justify-between">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-text-secondary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs font-medium text-text-primary">Blasting Cycle Bottleneck</div>
                  <div className="text-[11px] text-text-secondary">
                    Panel 4B blast delayed 4.5h due to misfire inspection protocol
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-mono text-warning font-medium">Medium</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
          <span className="text-xs text-text-muted">
            {pendingActions.length} advisory recommendations pending review
          </span>
          <button
            onClick={() => setActiveTab('actions')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-brand hover:bg-brand-dark rounded transition-colors shadow-subtle"
          >
            <span>Review Actions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mine Status Indicators */}
      <div className="bg-surface border border-border rounded shadow-subtle p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-border/70">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-brand" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Mine Operational Health
              </h3>
            </div>
            <span className="text-[11px] font-mono text-text-muted">
              Updated: 19 Sep 2026, 08:30 IST
            </span>
          </div>

          <div className="divide-y divide-border/60 text-xs">
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-text-secondary">Equipment Availability Fleet Index</span>
              <div className="flex items-center gap-2 font-mono">
                <span className="w-2 h-2 rounded-full bg-warning" />
                <span className="font-semibold text-text-primary">82.0%</span>
                <span className="text-text-muted text-[11px]">(Target: 92%)</span>
              </div>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-text-secondary">Weather Disruption Threat</span>
              <div className="flex items-center gap-2 font-mono">
                <span className="w-2 h-2 rounded-full bg-warning" />
                <span className="font-semibold text-text-primary">Moderate Inflow</span>
                <span className="text-text-muted text-[11px]">(16.5 mm)</span>
              </div>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-text-secondary">Ore Access & Stope Head Grade</span>
              <div className="flex items-center gap-2 font-mono">
                <span className="w-2 h-2 rounded-full bg-warning" />
                <span className="font-semibold text-text-primary">Watch</span>
                <span className="text-text-muted text-[11px]">(42.6% Mn vs 44.5%)</span>
              </div>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-text-secondary">Haul Cycle Efficiency</span>
              <div className="flex items-center gap-2 font-mono">
                <span className="w-2 h-2 rounded-full bg-danger" />
                <span className="font-semibold text-danger">Constrained</span>
                <span className="text-text-muted text-[11px]">(TRK-07 Retarder)</span>
              </div>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-text-secondary">Primary Crusher CRU-01 Feed</span>
              <div className="flex items-center gap-2 font-mono">
                <span className="w-2 h-2 rounded-full bg-success" />
                <span className="font-semibold text-success">Normal</span>
                <span className="text-text-muted text-[11px]">(320 t/h)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
          <button
            onClick={() => setIsWhatIfOpen(true)}
            className="text-xs text-brand font-medium hover:underline flex items-center gap-1"
          >
            Simulate operational scenarios →
          </button>
          <button
            onClick={() => setActiveTab('explore')}
            className="text-xs text-text-secondary font-medium hover:text-text-primary flex items-center gap-1"
          >
            Inspect exploration map →
          </button>
        </div>
      </div>
    </div>
  );
};
