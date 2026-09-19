import React from 'react';
import { MapVisualOptions } from './MineDSSMap';
import { Layers, MapPin, Grid, Activity, Sliders, ChevronDown, Eye, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MineDSSLeftSidebarProps {
  options: MapVisualOptions;
  setOptions: React.Dispatch<React.SetStateAction<MapVisualOptions>>;
  onZoomAoi?: () => void;
}

export const MineDSSLeftSidebar: React.FC<MineDSSLeftSidebarProps> = ({
  options,
  setOptions,
  onZoomAoi
}) => {
  const { selectedMine } = useApp();

  const toggleOption = (key: keyof MapVisualOptions) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-surface border-r border-border w-72 flex-shrink-0 flex flex-col h-full text-xs select-none">
      {/* Top Location Selector Card (Matching reference top-left) */}
      <div className="p-3 border-b border-border bg-subtle/40">
        <div className="flex items-center gap-2">
          <span className="text-base leading-none">🇮🇳</span>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-text-primary text-xs truncate">
              India · {selectedMine.name}
            </div>
            <div className="text-[11px] text-brand font-medium">
              Manganese Belt — {selectedMine.state}
            </div>
          </div>
        </div>
      </div>

      {/* Main Layers & Symbology Content */}
      <div className="p-3.5 space-y-4 overflow-y-auto flex-1">
        <div className="flex items-center justify-between pb-1.5 border-b border-border/70">
          <span className="font-semibold text-text-primary text-xs">Layers & symbology</span>
          {onZoomAoi && (
            <button
              onClick={onZoomAoi}
              className="text-[10px] text-brand hover:underline font-medium"
            >
              Zoom AOI
            </button>
          )}
        </div>

        {/* Group: PROSPECTIVITY LAYER TOGGLES */}
        <div className="space-y-2">
          <div className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
            Prospectivity
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-2 cursor-pointer text-text-primary hover:text-brand">
              <input
                type="checkbox"
                checked={options.showProspectivityMap}
                onChange={() => toggleOption('showProspectivityMap')}
                className="rounded border-border text-brand focus:ring-brand/30 h-3.5 w-3.5 accent-brand"
              />
              <span className="font-medium text-xs">Prospectivity map</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-text-primary hover:text-brand">
              <input
                type="checkbox"
                checked={options.showDrillingZones}
                onChange={() => toggleOption('showDrillingZones')}
                className="rounded border-border text-brand focus:ring-brand/30 h-3.5 w-3.5 accent-brand"
              />
              <span className="font-medium text-xs flex items-center gap-1.5">
                <span>Drilling-target zones</span>
                <span className="w-2.5 h-2.5 rounded-sm border border-[#9333EA] bg-[#9333EA]/20" />
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-text-primary hover:text-brand">
              <input
                type="checkbox"
                checked={options.showBoreholes}
                onChange={() => toggleOption('showBoreholes')}
                className="rounded border-border text-brand focus:ring-brand/30 h-3.5 w-3.5 accent-brand"
              />
              <span className="font-medium text-xs flex items-center gap-1.5">
                <span>Core Boreholes & Assays</span>
                <span className="w-2 h-2 rounded-full bg-copper" />
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-text-primary hover:text-brand">
              <input
                type="checkbox"
                checked={options.hoverToInspect}
                onChange={() => toggleOption('hoverToInspect')}
                className="rounded border-border text-brand focus:ring-brand/30 h-3.5 w-3.5 accent-brand"
              />
              <span className="text-text-secondary text-xs">Hover to inspect</span>
            </label>
          </div>
        </div>

        {/* Group: Show as (Segmented Control Pills) */}
        <div className="space-y-1.5 pt-2 border-t border-border/60">
          <div className="text-[11px] font-medium text-text-secondary">Show as</div>
          <div className="grid grid-cols-3 gap-1 bg-subtle p-1 rounded border border-border">
            {[
              { id: 'cells', label: 'Cells' },
              { id: 'heatmap', label: 'Heatmap' },
              { id: 'contours', label: 'Contours' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setOptions(prev => ({ ...prev, displayMode: tab.id as any }))}
                className={`py-1 text-[11px] font-medium rounded transition-all text-center ${
                  options.displayMode === tab.id
                    ? 'bg-surface text-brand font-semibold shadow-subtle border border-border/80'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Group: Colour by (Prospectivity vs Confidence) */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[11px] font-medium text-text-secondary">Colour by</div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => setOptions(prev => ({ ...prev, colorBy: 'prospectivity' }))}
              className={`py-1.5 px-2 text-[11px] font-medium rounded border transition-colors flex items-center justify-center gap-1.5 ${
                options.colorBy === 'prospectivity'
                  ? 'bg-brand/10 border-brand text-brand font-semibold'
                  : 'bg-subtle border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-brand" />
              <span>Prospectivity</span>
            </button>

            <button
              onClick={() => setOptions(prev => ({ ...prev, colorBy: 'confidence' }))}
              className={`py-1.5 px-2 text-[11px] font-medium rounded border transition-colors flex items-center justify-center gap-1.5 ${
                options.colorBy === 'confidence'
                  ? 'bg-brand/10 border-brand text-brand font-semibold'
                  : 'bg-subtle border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#163E63]" />
              <span>Confidence</span>
            </button>
          </div>
        </div>

        {/* Continuous Gradient Legend matching Reference */}
        <div className="pt-2 border-t border-border/60 space-y-1.5">
          <div className="text-[11px] font-medium text-text-secondary">
            Prospectivity — low to high
          </div>
          {/* Continuous gradient strip */}
          <div
            className="h-2.5 w-full rounded border border-border/70"
            style={{
              background: 'linear-gradient(to right, #EAF0EE 0%, #B9D5D7 20%, #4E9CA0 50%, #26677F 75%, #163E63 100%)'
            }}
          />
          <div className="flex justify-between items-center text-[10px] font-mono text-text-muted">
            <span>0</span>
            <span>0.4</span>
            <span>0.85+</span>
          </div>
        </div>

        {/* Dynamic Threshold Filter Slider */}
        <div className="pt-2 border-t border-border/60 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium text-text-secondary flex items-center gap-1">
              <Filter className="w-3 h-3 text-text-muted" />
              <span>Drill Priority Filter</span>
            </span>
            <span className="font-mono font-bold text-brand text-[11px]">
              {options.minProspectivityFilter > 0 ? `≥ ${options.minProspectivityFilter.toFixed(2)}` : 'All Ground'}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="0.85"
            step="0.05"
            value={options.minProspectivityFilter}
            onChange={e => setOptions(prev => ({ ...prev, minProspectivityFilter: parseFloat(e.target.value) }))}
            className="w-full accent-brand h-1.5 bg-subtle rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-text-muted">
            <span>0.00 (All)</span>
            <span>0.70 (High Priority)</span>
            <span>0.85+ (Core)</span>
          </div>
        </div>

        {/* Layer Opacity Slider */}
        <div className="pt-1.5 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium text-text-secondary flex items-center gap-1">
              <Eye className="w-3 h-3 text-text-muted" />
              <span>Overlay Opacity</span>
            </span>
            <span className="font-mono font-bold text-text-primary text-[11px]">
              {Math.round(options.layerOpacity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.2"
            max="1.0"
            step="0.05"
            value={options.layerOpacity}
            onChange={e => setOptions(prev => ({ ...prev, layerOpacity: parseFloat(e.target.value) }))}
            className="w-full accent-brand h-1.5 bg-subtle rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Model Spec Note at bottom */}
      <div className="p-3 border-t border-border bg-subtle/50 text-[10px] font-mono text-text-muted flex items-center justify-between">
        <span>Model: GeoProspect-XGB v0.4</span>
        <span className="text-brand font-semibold">110m Grid</span>
      </div>
    </div>
  );
};
