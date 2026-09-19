import React from 'react';

export const MapLegend: React.FC = () => {
  return (
    <div className="bg-surface/95 backdrop-blur-sm border border-border rounded p-3 text-xs shadow-panel pointer-events-auto select-none max-w-[240px]">
      <div className="font-semibold text-text-primary text-[11px] uppercase tracking-wider mb-2">
        Prospectivity
      </div>
      
      {/* Non-red-green gradient bar */}
      <div className="h-3 w-full rounded-sm border border-border/80" 
        style={{ 
          background: 'linear-gradient(to right, #DCE9ED 0%, #4E9CA0 50%, #163E63 100%)' 
        }} 
      />
      <div className="flex justify-between items-center text-[10px] font-mono text-text-muted mt-1">
        <span>LOW (0.0)</span>
        <span>0.5</span>
        <span>HIGH (1.0)</span>
      </div>

      <div className="mt-3 pt-2 border-t border-border/60">
        <div className="text-[11px] font-medium text-text-secondary mb-1.5">Model Confidence</div>
        <div className="grid grid-cols-3 gap-1 text-[10px] font-mono text-text-secondary">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#163E63] border border-border" />
            <span>High</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4E9CA0] border border-border" />
            <span>Med</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DCE9ED] border border-border" />
            <span>Low</span>
          </div>
        </div>
      </div>

      <div className="mt-2.5 pt-1.5 border-t border-border/60 flex items-center justify-between text-[10px] text-text-muted">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-copper" />
          <span>Borehole Assay</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-0.5 bg-text-primary border-t border-dashed" />
          <span>Fault / Lineament</span>
        </div>
      </div>
    </div>
  );
};
