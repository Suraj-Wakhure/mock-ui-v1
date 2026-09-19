import React from 'react';
import { ProspectivityTarget } from '../../types';
import { X, ExternalLink, Compass, ShieldCheck, MapPin } from 'lucide-react';

interface TargetDetailPanelProps {
  target: ProspectivityTarget | null;
  onClose: () => void;
  onSelectInPlan?: () => void;
}

export const TargetDetailPanel: React.FC<TargetDetailPanelProps> = ({
  target,
  onClose,
  onSelectInPlan
}) => {
  if (!target) {
    return (
      <div className="bg-surface border border-border rounded shadow-subtle p-6 text-center text-text-muted text-xs h-full flex flex-col items-center justify-center">
        <Compass className="w-8 h-8 text-text-muted/50 mb-2 stroke-[1.5]" />
        <div className="font-medium text-text-secondary">No Target Selected</div>
        <p className="text-[11px] mt-1 max-w-[200px]">
          Click any grid cell or target on the map to inspect its evidence drivers and drilling truth.
        </p>
      </div>
    );
  }

  const confidenceColors = {
    High: 'bg-[#163E63] text-white',
    Medium: 'bg-[#4E9CA0] text-white',
    Low: 'bg-[#DCE9ED] text-[#17201D]'
  };

  return (
    <div className="bg-surface border border-border rounded shadow-subtle p-3.5 space-y-3.5 text-xs flex flex-col justify-between h-full overflow-y-auto">
      <div>
        {/* Header with Close */}
        <div className="flex items-start justify-between pb-2 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-brand-dark dark:text-brand">
                Target {target.target_id}
              </span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-semibold ${confidenceColors[target.confidence]}`}>
                {target.confidence} Confidence
              </span>
            </div>
            <div className="text-[11px] text-text-secondary mt-0.5">{target.name}</div>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary p-1 rounded transition-colors"
            aria-label="Close detail panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 py-1 font-mono">
          <div className="p-2 bg-subtle rounded border border-border/60 text-center">
            <div className="text-[10px] text-text-muted uppercase">Prospectivity</div>
            <div className="text-base font-bold text-text-primary mt-0.5">
              {target.prospectivity.toFixed(2)}
            </div>
            <div className="text-[9px] text-text-secondary">P(mineralization)</div>
          </div>

          <div className="p-2 bg-subtle rounded border border-border/60 text-center">
            <div className="text-[10px] text-text-muted uppercase">Surface Area</div>
            <div className="text-base font-bold text-text-primary mt-0.5">
              {target.area_km2}
            </div>
            <div className="text-[9px] text-text-secondary">km² block</div>
          </div>

          <div className="p-2 bg-subtle rounded border border-border/60 text-center">
            <div className="text-[10px] text-text-muted uppercase">Nearby Mn %</div>
            <div className="text-base font-bold text-brand mt-0.5">
              {target.observed_or_assay_mn_pct ? `${target.observed_or_assay_mn_pct}%` : 'N/A'}
            </div>
            <div className="text-[9px] text-text-secondary">Lab Assay</div>
          </div>
        </div>

        {/* Evidence Drivers (3-5 strongest features with horizontal bars) */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
              Top Evidence Drivers
            </span>
            <span className="text-[10px] font-mono text-text-muted">SHAP / Feature Weight</span>
          </div>

          <div className="space-y-2.5">
            {target.evidence_drivers.map((driver, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-text-primary font-medium flex items-center gap-1">
                    <span className={driver.direction === '+' ? 'text-success font-mono font-bold' : 'text-danger font-mono font-bold'}>
                      {driver.direction}
                    </span>
                    {driver.name}
                  </span>
                  <span className="font-mono text-[10px] text-text-secondary font-medium">
                    {driver.score}%
                  </span>
                </div>
                {/* Horizontal progress bar */}
                <div className="h-1.5 w-full bg-subtle rounded-full overflow-hidden border border-border/40">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      driver.direction === '+' ? 'bg-brand' : 'bg-danger'
                    }`}
                    style={{ width: `${driver.score}%` }}
                  />
                </div>
                <div className="text-[10px] text-text-muted leading-tight">
                  {driver.detail}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ground Truth Drilling Association */}
        <div className="mt-3.5 pt-3 border-t border-border/70">
          <div className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-2">
            Ground-Truth Drilling Verification
          </div>
          <div className="p-2.5 bg-subtle rounded border border-border/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-text-primary flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-copper" />
                {target.nearby_borehole.borehole_id}
              </span>
              <span className="text-[10px] font-mono text-text-muted">
                {target.nearby_borehole.distance_m} m offset
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-border/40">
              <span className="text-text-secondary">Assay Interval:</span>
              <span className="font-mono text-text-primary font-medium">
                {target.nearby_borehole.depth_interval}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-text-secondary">Assayed Grade:</span>
              <span className="font-mono font-bold text-success">
                {target.nearby_borehole.mn_pct}% Mn (High Grade)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Model Provenance Footer & CTA */}
      <div className="pt-2 border-t border-border/70 space-y-2">
        <div className="flex items-center justify-between text-[10px] font-mono text-text-muted">
          <span>{target.model_version}</span>
          <span>{target.updated_at}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onSelectInPlan}
            className="w-full py-1.5 px-3 bg-brand hover:bg-brand-dark text-white font-medium rounded transition-colors text-xs flex items-center justify-center gap-1.5 shadow-subtle"
          >
            <span>Transfer to Mine Plan</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
