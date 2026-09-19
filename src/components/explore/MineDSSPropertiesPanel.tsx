import React from 'react';
import { TargetZone } from '../../data/rasterGridData';
import { useApp } from '../../context/AppContext';
import { FileText, ChevronRight, MapPin, CheckCircle2, ShieldCheck, X } from 'lucide-react';

interface MineDSSPropertiesPanelProps {
  selectedZone: TargetZone | null;
  onClearZone: () => void;
  onViewReport: () => void;
}

export const MineDSSPropertiesPanel: React.FC<MineDSSPropertiesPanelProps> = ({
  selectedZone,
  onClearZone,
  onViewReport
}) => {
  const { selectedMine } = useApp();

  return (
    <div className="bg-surface border-l border-border w-80 flex-shrink-0 flex flex-col h-full text-xs select-none overflow-y-auto">
      {/* Header */}
      <div className="p-3 border-b border-border bg-subtle/30 flex items-center justify-between">
        <span className="font-semibold text-text-primary text-xs">Properties</span>
        {selectedZone && (
          <button
            onClick={onClearZone}
            className="text-text-muted hover:text-text-primary p-0.5 rounded transition-colors"
            title="Clear zone selection"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="p-4 space-y-4 flex-1">
        {/* Title & Subtitle */}
        <div>
          <h2 className="text-sm font-bold text-text-primary">
            {selectedZone ? `${selectedZone.label} ${selectedZone.name}` : `${selectedMine.name}, ${selectedMine.state}`}
          </h2>
          <div className="text-[11px] text-text-muted mt-0.5">
            {selectedZone ? 'drilling-target zone · high priority' : 'manganese · pre-computed demo'}
          </div>
        </div>

        {/* Global AOI Stats matching reference */}
        {!selectedZone ? (
          <div className="space-y-3">
            <div className="divide-y divide-border/60 font-mono text-[11px]">
              <div className="py-2 flex justify-between">
                <span className="text-text-secondary">AOI pixels (85 m)</span>
                <span className="font-bold text-text-primary">16,317</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-text-secondary">Ranked zones</span>
                <span className="font-bold text-brand">8</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-text-secondary">Deposit model</span>
                <span className="text-text-primary">Syngenetic Gondite</span>
              </div>
            </div>

            <p className="text-[11px] text-text-secondary leading-relaxed pt-1">
              Frontier AOI — the model ranks it based on regional geophysical signatures and satellite proxies. Laboratory assays and core drilling support local calibration.
            </p>

            {/* Primary Action Button matching reference */}
            <button
              onClick={onViewReport}
              className="w-full py-2 px-3 bg-brand hover:bg-brand-dark text-white rounded font-medium text-xs flex items-center justify-center gap-1.5 shadow-subtle transition-colors"
            >
              <span>View full prospectivity report</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <div className="text-[10px] text-text-muted text-center pt-1 italic">
              Click any colored pixel or a purple zone on the map for its full reasoning chain here.
            </div>
          </div>
        ) : (
          /* Selected Zone Detailed Properties */
          <div className="space-y-3.5 animate-in fade-in duration-100">
            {/* Zone Metrics Scorecard */}
            <div className="grid grid-cols-2 gap-2 font-mono">
              <div className="p-2.5 bg-subtle rounded border border-border/80 text-center">
                <div className="text-[10px] text-text-muted uppercase">Avg Prospectivity</div>
                <div className="text-base font-bold text-brand mt-0.5">
                  {selectedZone.avgProspectivity.toFixed(2)}
                </div>
              </div>

              <div className="p-2.5 bg-subtle rounded border border-border/80 text-center">
                <div className="text-[10px] text-text-muted uppercase">Peak Value</div>
                <div className="text-base font-bold text-[#163E63] dark:text-[#5EB4B3] mt-0.5">
                  {selectedZone.peakProspectivity.toFixed(2)}
                </div>
              </div>

              <div className="p-2.5 bg-subtle rounded border border-border/80 text-center">
                <div className="text-[10px] text-text-muted uppercase">Target Area</div>
                <div className="text-base font-bold text-text-primary mt-0.5">
                  {selectedZone.areaKm2} km²
                </div>
              </div>

              <div className="p-2.5 bg-subtle rounded border border-border/80 text-center">
                <div className="text-[10px] text-text-muted uppercase">Reliability</div>
                <div className="text-base font-bold text-success mt-0.5">
                  {selectedZone.reliability}
                </div>
              </div>
            </div>

            {/* Top Drivers Attribution */}
            <div>
              <span className="font-semibold text-text-secondary uppercase text-[10px] tracking-wider block mb-1">
                Primary Supporting Drivers
              </span>
              <div className="p-2.5 bg-subtle rounded border border-border/60 text-[11px] text-text-primary">
                {selectedZone.topDrivers}
              </div>
            </div>

            {/* Subsurface Drilling Truth */}
            <div>
              <span className="font-semibold text-text-secondary uppercase text-[10px] tracking-wider block mb-1">
                Borehole Ground Truth Assay
              </span>
              <div className="p-2.5 bg-brand/5 border border-brand/20 rounded text-[11px] space-y-1">
                <div className="flex justify-between font-mono">
                  <span className="font-bold text-brand">{selectedZone.nearbyAssay.borehole}</span>
                  <span className="text-text-muted">{selectedZone.nearbyAssay.distanceM}m offset</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Assayed Grade:</span>
                  <span className="font-mono font-bold text-success">{selectedZone.nearbyAssay.gradeMn}% Mn</span>
                </div>
                <div className="flex justify-between text-[10px] text-text-muted">
                  <span>Core Interval:</span>
                  <span className="font-mono">{selectedZone.nearbyAssay.interval}</span>
                </div>
              </div>
            </div>

            {/* Geological Unit */}
            <div>
              <span className="font-semibold text-text-secondary uppercase text-[10px] tracking-wider block mb-1">
                Host Rock Formation
              </span>
              <p className="text-[11px] text-text-secondary leading-tight">
                {selectedZone.rockUnit}
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={onViewReport}
              className="w-full py-2 px-3 bg-brand hover:bg-brand-dark text-white rounded font-medium text-xs flex items-center justify-center gap-1.5 shadow-subtle transition-colors"
            >
              <span>Export Target Dossier</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
