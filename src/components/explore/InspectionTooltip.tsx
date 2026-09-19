import React from 'react';
import { RasterCell } from '../../data/rasterGridData';
import { CheckCircle2, Target, Layers } from 'lucide-react';

interface InspectionTooltipProps {
  cell: RasterCell | null;
  position: { x: number; y: number } | null;
  containerBounds: { width: number; height: number };
}

export const InspectionTooltip: React.FC<InspectionTooltipProps> = ({
  cell,
  position,
  containerBounds
}) => {
  if (!cell || !position) return null;

  const tooltipWidth = 260;
  const tooltipHeight = 310;

  // Position relative to mouse pointer with offset
  let left = position.x + 18;
  let top = position.y - 40;

  // Flip if near right edge
  if (left + tooltipWidth > containerBounds.width - 12) {
    left = position.x - tooltipWidth - 18;
  }
  // Flip if near bottom edge
  if (top + tooltipHeight > containerBounds.height - 12) {
    top = position.y - tooltipHeight - 10;
  }

  // Clamp within container
  left = Math.max(12, Math.min(containerBounds.width - tooltipWidth - 12, left));
  top = Math.max(12, Math.min(containerBounds.height - tooltipHeight - 12, top));

  const isAboveThreshold = cell.prospectivity >= 0.70;

  // Calculate drivers count
  const supportsCount = (cell.drivers.alteration === 'supports' ? 1 : 0) +
    (cell.drivers.structure === 'supports' ? 1 : 0) +
    (cell.drivers.radiometrics === 'supports' ? 1 : 0) +
    (cell.drivers.terrain === 'supports' ? 1 : 0);

  const againstCount = (cell.drivers.alteration === 'against' ? 1 : 0) +
    (cell.drivers.radiometrics === 'against' ? 1 : 0);

  return (
    <div
      className="absolute z-40 pointer-events-none select-none transition-transform duration-75 ease-out"
      style={{
        transform: `translate3d(${left}px, ${top}px, 0)`,
        width: `${tooltipWidth}px`
      }}
    >
      <div className="bg-white/98 dark:bg-[#151B19]/98 backdrop-blur-md border border-[#D9DEDA] dark:border-[#2A3430] rounded-xl shadow-2xl p-3.5 text-xs font-sans text-[#17201D] dark:text-[#EDF2EF] ring-1 ring-black/5">
        {/* Header matching Screenshot: Pin icon + "This location" */}
        <div className="flex items-center justify-between pb-2 border-b border-border/70">
          <div className="flex items-center gap-1.5 font-bold text-[13px] text-text-primary">
            <span className="text-brand text-sm">📍</span>
            <span>This location</span>
          </div>
          {cell.zoneId && (
            <span className="font-mono text-[10px] font-bold bg-[#9333EA] text-white px-2 py-0.5 rounded-full shadow-xs">
              Zone #{cell.zoneId}
            </span>
          )}
        </div>

        {/* Prospectivity Section with Blue Horizontal Bar & Big Number */}
        <div className="mt-2.5 space-y-1.5">
          <div className="text-[11px] text-text-secondary font-medium">Prospectivity</div>
          <div className="flex items-center gap-3">
            {/* Blue Progress Bar */}
            <div className="flex-1 h-3 bg-[#EEF2F6] dark:bg-[#1C2421] rounded-full overflow-hidden p-0.5 border border-border/60">
              <div
                className="h-full bg-[#1E6CA8] dark:bg-[#5EB4B3] rounded-full transition-all duration-100"
                style={{ width: `${Math.max(8, cell.prospectivity * 100)}%` }}
              />
            </div>
            {/* Big bold prospectivity number matching screenshot */}
            <span className="font-mono font-bold text-base text-text-primary">
              {cell.prospectivity.toFixed(2)}
            </span>
          </div>

          {/* Threshold Pill matching screenshot */}
          <div className="pt-0.5">
            {isAboveThreshold ? (
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-success/15 text-success border border-success/30">
                <span>✓ high drill priority</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#F1F5F9] dark:bg-[#1C2421] text-text-muted border border-border">
                <Target className="w-2.5 h-2.5" />
                <span>below drill threshold</span>
              </div>
            )}
          </div>
        </div>

        {/* Confidence Box with Green Check matching Screenshot */}
        <div className="mt-3 p-2 bg-[#F8FAFC] dark:bg-[#1A2320] rounded-lg border border-border/70 space-y-0.5">
          <div className="flex items-center gap-1.5 font-medium text-xs text-text-primary">
            <CheckCircle2 className="w-3.5 h-3.5 text-success stroke-[2.5]" />
            <span>
              Confidence: <b>{cell.confidence}</b>
            </span>
          </div>
          <p className="text-[10px] text-text-muted pl-5 leading-tight">
            {cell.confidence === 'Strong match'
              ? 'resembles ground with known deposits'
              : 'moderate regional feature alignment'}
          </p>
        </div>

        {/* What's driving this section matching screenshot */}
        <div className="mt-3 pt-2 border-t border-border/60 space-y-2">
          <div>
            <div className="font-bold text-[11px] text-text-primary">What's driving this</div>
            <div className="flex items-center gap-2 text-[10px] font-medium mt-0.5">
              <span className="text-success flex items-center gap-0.5">
                <span>↗</span> {supportsCount} supports
              </span>
              <span className="text-text-muted">·</span>
              <span className="text-danger flex items-center gap-0.5">
                <span>↘</span> {againstCount} against
              </span>
            </div>
          </div>

          {/* Feature Rows with exact colored status and horizontal pill bars */}
          <div className="space-y-1.5 text-[11px]">
            {/* Feature 1: Terrain shape */}
            <div className="flex items-center justify-between">
              <span className="text-text-secondary text-[11px]">Terrain shape</span>
              <div className="flex items-center gap-2">
                <span className="text-success font-medium text-[10px] flex items-center gap-0.5">
                  <span>↗</span> supports
                </span>
                <div className="w-12 h-1.5 bg-[#EEF2F6] dark:bg-[#1C2421] rounded-full overflow-hidden">
                  <div className="w-10 h-full bg-[#65A30D] rounded-full" />
                </div>
              </div>
            </div>

            {/* Feature 2: Alteration minerals */}
            <div className="flex items-center justify-between">
              <span className="text-text-secondary text-[11px]">Alteration minerals</span>
              <div className="flex items-center gap-2">
                <span
                  className={`font-medium text-[10px] flex items-center gap-0.5 ${
                    cell.drivers.alteration === 'supports' ? 'text-success' : 'text-danger'
                  }`}
                >
                  <span>{cell.drivers.alteration === 'supports' ? '↗' : '↘'}</span>{' '}
                  {cell.drivers.alteration}
                </span>
                <div className="w-12 h-1.5 bg-[#EEF2F6] dark:bg-[#1C2421] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      cell.drivers.alteration === 'supports'
                        ? 'w-10 bg-[#65A30D]'
                        : 'w-10 bg-[#EF4444]'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Feature 3: Magnetics & gravity */}
            <div className="flex items-center justify-between">
              <span className="text-text-secondary text-[11px]">Magnetics & gravity</span>
              <div className="flex items-center gap-2">
                <span className="text-success font-medium text-[10px] flex items-center gap-0.5">
                  <span>↗</span> supports
                </span>
                <div className="w-12 h-1.5 bg-[#EEF2F6] dark:bg-[#1C2421] rounded-full overflow-hidden">
                  <div className="w-7 h-full bg-[#65A30D] rounded-full" />
                </div>
              </div>
            </div>

            {/* Feature 4: Radiometrics */}
            <div className="flex items-center justify-between">
              <span className="text-text-secondary text-[11px]">Radiometrics</span>
              <div className="flex items-center gap-2">
                <span className="text-text-muted text-[10px] flex items-center gap-0.5">
                  <span>·</span> neutral
                </span>
                <div className="w-12 h-1.5 bg-[#EEF2F6] dark:bg-[#1C2421] rounded-full overflow-hidden">
                  <div className="w-3 h-full bg-[#94A3B8] rounded-full" />
                </div>
              </div>
            </div>

            {/* Feature 5: Surface texture */}
            <div className="flex items-center justify-between">
              <span className="text-text-secondary text-[11px]">Surface texture</span>
              <div className="flex items-center gap-2">
                <span className="text-text-muted text-[10px] flex items-center gap-0.5">
                  <span>·</span> neutral
                </span>
                <div className="w-12 h-1.5 bg-[#EEF2F6] dark:bg-[#1C2421] rounded-full overflow-hidden">
                  <div className="w-3 h-full bg-[#94A3B8] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rock Unit Footer with Stacked Layers Icon matching screenshot */}
        <div className="mt-2.5 pt-2 border-t border-border/60 flex items-start gap-1.5 text-[10px] text-text-secondary">
          <Layers className="w-3 h-3 text-text-muted mt-0.5 flex-shrink-0" />
          <span className="leading-tight">
            Rock unit: <span className="font-medium text-text-primary">Mansar formation, braunite quartzite</span>
          </span>
        </div>
      </div>
    </div>
  );
};
