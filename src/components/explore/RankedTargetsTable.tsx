import React from 'react';
import { ProspectivityTarget } from '../../types';
import { ChevronRight, ArrowUpDown } from 'lucide-react';

interface RankedTargetsTableProps {
  targets: ProspectivityTarget[];
  selectedTargetId: string | null;
  onSelectTarget: (id: string) => void;
}

export const RankedTargetsTable: React.FC<RankedTargetsTableProps> = ({
  targets,
  selectedTargetId,
  onSelectTarget
}) => {
  return (
    <div className="bg-surface border border-border rounded shadow-subtle overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-subtle/70 border-b border-border text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-text-primary uppercase tracking-wider text-[11px]">
            Ranked Exploration Targets
          </span>
          <span className="text-[10px] font-mono text-text-muted">
            ({targets.length} targets identified by GeoProspect-XGB)
          </span>
        </div>
        <div className="text-[10px] text-text-secondary font-mono flex items-center gap-1">
          <ArrowUpDown className="w-3 h-3 text-text-muted" />
          <span>Sorted by Prospectivity P(mineralization)</span>
        </div>
      </div>

      <div className="overflow-x-auto max-h-48 overflow-y-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-subtle text-[11px] font-semibold text-text-secondary border-b border-border/70 sticky top-0">
            <tr>
              <th className="py-2 px-3 w-10 text-center font-mono">#</th>
              <th className="py-2 px-3 font-mono">Target ID</th>
              <th className="py-2 px-3 font-mono">Prospectivity</th>
              <th className="py-2 px-3">Confidence</th>
              <th className="py-2 px-3 font-mono">Area</th>
              <th className="py-2 px-3">Primary Evidence</th>
              <th className="py-2 px-3 font-mono">Ground Assay</th>
              <th className="py-2 px-3 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {targets.map((target, idx) => {
              const isSelected = selectedTargetId === target.target_id;

              const prospectColor =
                target.prospectivity >= 0.8
                  ? 'text-[#163E63] dark:text-[#5EB4B3] font-bold'
                  : target.prospectivity >= 0.6
                  ? 'text-[#4E9CA0] font-semibold'
                  : 'text-text-secondary';

              const confBadge = {
                High: 'bg-[#163E63]/10 text-[#163E63] dark:text-[#5EB4B3] border-[#163E63]/30',
                Medium: 'bg-[#4E9CA0]/10 text-[#4E9CA0] border-[#4E9CA0]/30',
                Low: 'bg-text-muted/10 text-text-muted border-border'
              };

              return (
                <tr
                  key={target.target_id}
                  onClick={() => onSelectTarget(target.target_id)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'bg-brand/10 font-medium' : 'hover:bg-subtle/60'
                  }`}
                >
                  <td className="py-2 px-3 text-center font-mono text-text-muted">{idx + 1}</td>
                  <td className="py-2 px-3 font-mono font-bold text-text-primary">
                    {target.target_id}
                  </td>
                  <td className="py-2 px-3 font-mono">
                    <span className={prospectColor}>{target.prospectivity.toFixed(2)}</span>
                  </td>
                  <td className="py-2 px-3">
                    <span className={`px-1.5 py-0.5 text-[10px] rounded font-mono border ${confBadge[target.confidence]}`}>
                      {target.confidence}
                    </span>
                  </td>
                  <td className="py-2 px-3 font-mono text-text-secondary">
                    {target.area_km2} km²
                  </td>
                  <td className="py-2 px-3 text-text-secondary max-w-[220px] truncate">
                    {target.primary_evidence}
                  </td>
                  <td className="py-2 px-3 font-mono text-text-primary">
                    {target.observed_or_assay_mn_pct ? (
                      <span className="text-success font-semibold">
                        {target.observed_or_assay_mn_pct}% Mn
                      </span>
                    ) : (
                      <span className="text-text-muted">Unsampled</span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-right">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onSelectTarget(target.target_id);
                      }}
                      className={`p-1 rounded text-xs transition-colors ${
                        isSelected ? 'text-brand font-bold' : 'text-text-muted hover:text-text-primary'
                      }`}
                      aria-label={`Inspect target ${target.target_id}`}
                    >
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
