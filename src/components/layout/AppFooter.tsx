import React from 'react';
import { useApp } from '../../context/AppContext';

export const AppFooter: React.FC = () => {
  const { selectedMine } = useApp();

  return (
    <footer className="border-t border-border bg-surface px-4 py-2 text-[11px] font-mono text-text-muted flex flex-col sm:flex-row items-center justify-between gap-1 select-none">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
        <span>MOIL Limited · Manganese Intelligence Platform (MineIntel)</span>
        <span className="text-border">|</span>
        <span className="text-text-secondary">{selectedMine.name} Hub</span>
      </div>
      <div className="flex items-center gap-3">
        <span>CRS: EPSG:4326</span>
        <span className="text-border">|</span>
        <span>Baseline: OSM Tiles</span>
        <span className="text-border">|</span>
        <span>Inference: Online</span>
        <span className="text-border">|</span>
        <span className="text-text-secondary">SIH 2026 PS 26009</span>
      </div>
    </footer>
  );
};
