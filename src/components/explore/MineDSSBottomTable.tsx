import React from 'react';
import { TargetZone, TARGET_ZONES } from '../../data/rasterGridData';

interface MineDSSBottomTableProps {
  selectedZoneId: number | null;
  onSelectZone: (zone: TargetZone) => void;
}

export const MineDSSBottomTable: React.FC<MineDSSBottomTableProps> = ({
  selectedZoneId,
  onSelectZone
}) => {
  return (
    <div className="bg-surface border-t border-border flex flex-col h-40 flex-shrink-0 select-none font-sans">
      {/* Table Data */}
      <div className="overflow-x-auto overflow-y-auto flex-1">
        <table className="w-full text-left text-xs font-sans">
          <thead className="bg-subtle/50 text-[11px] font-semibold text-text-secondary border-b border-border/70 sticky top-0">
            <tr>
              <th className="py-2 px-3 w-12 font-mono">#</th>
              <th className="py-2 px-4 font-sans text-right w-36">Peak prospectivity</th>
              <th className="py-2 px-4 font-sans text-right w-28">Area (km²)</th>
              <th className="py-2 px-4 font-sans text-center w-24">Reliability</th>
              <th className="py-2 px-4 font-sans">Strongest supporting drivers</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {TARGET_ZONES.map(zone => {
              const isSelected = selectedZoneId === zone.id;

              return (
                <tr
                  key={zone.id}
                  onClick={() => onSelectZone(zone)}
                  className={`cursor-pointer transition-colors text-xs ${
                    isSelected
                      ? 'bg-[#9333EA]/10 font-medium'
                      : 'hover:bg-subtle/60 text-text-secondary'
                  }`}
                >
                  <td className="py-1.5 px-3 font-mono font-bold text-[#9333EA]">
                    {zone.label}
                  </td>
                  <td className="py-1.5 px-4 font-mono font-bold text-text-primary text-right">
                    {zone.peakProspectivity.toFixed(2)}
                  </td>
                  <td className="py-1.5 px-4 font-mono text-text-secondary text-right">
                    {zone.areaKm2.toFixed(2)}
                  </td>
                  <td className="py-1.5 px-4 text-center">
                    <span className="text-[11px] text-text-muted font-mono">
                      {zone.reliability}
                    </span>
                  </td>
                  <td className="py-1.5 px-4 text-text-secondary text-xs italic truncate max-w-[500px]">
                    {zone.topDrivers}
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
