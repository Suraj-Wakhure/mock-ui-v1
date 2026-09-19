import React from 'react';
import { Layers, Eye, EyeOff, Map as MapIcon, Sliders } from 'lucide-react';

export interface LayerState {
  showProspectivity: boolean;
  prospectivityOpacity: number;
  showConfidence: boolean;
  showBoreholes: boolean;
  showGeologyFaults: boolean;
  showSatelliteIndex: boolean;
  activeSatelliteIndex: 'ndvi' | 'ndmi' | 'lst';
  basemap: 'positron' | 'satellite' | 'topo';
}

interface LayerControlsProps {
  layers: LayerState;
  setLayers: React.Dispatch<React.SetStateAction<LayerState>>;
}

export const LayerControls: React.FC<LayerControlsProps> = ({ layers, setLayers }) => {
  const toggle = (key: keyof LayerState) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-surface border border-border rounded shadow-subtle p-3 space-y-3.5 text-xs select-none">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-1.5 font-semibold text-text-primary uppercase tracking-wider text-[11px]">
          <Layers className="w-3.5 h-3.5 text-brand" />
          <span>GIS Map Layers</span>
        </div>
        <span className="text-[10px] font-mono text-text-muted">Balaghat Lease</span>
      </div>

      {/* Layer 1: Prospectivity Heatmap */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={layers.showProspectivity}
              onChange={() => toggle('showProspectivity')}
              className="rounded border-border text-brand focus:ring-brand/30 h-3.5 w-3.5 accent-brand"
            />
            <span className="font-medium text-text-primary">Prospectivity Model</span>
          </label>
          <span className="text-[10px] font-mono text-text-muted">XGB v0.4</span>
        </div>

        {layers.showProspectivity && (
          <div className="pl-5 pr-1 flex items-center gap-2">
            <span className="text-[10px] text-text-muted">Opacity:</span>
            <input
              type="range"
              min="20"
              max="100"
              value={layers.prospectivityOpacity}
              onChange={e =>
                setLayers(prev => ({ ...prev, prospectivityOpacity: Number(e.target.value) }))
              }
              className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-brand"
            />
            <span className="text-[10px] font-mono text-text-muted w-7 text-right">
              {layers.prospectivityOpacity}%
            </span>
          </div>
        )}
      </div>

      {/* Layer 2: Confidence Layer */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={layers.showConfidence}
            onChange={() => toggle('showConfidence')}
            className="rounded border-border text-brand focus:ring-brand/30 h-3.5 w-3.5 accent-brand"
          />
          <span className="font-medium text-text-primary">Confidence Classification</span>
        </label>
        <span className="text-[10px] font-mono text-text-muted">Spatial CV</span>
      </div>

      {/* Layer 3: Boreholes & Drill Holes */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={layers.showBoreholes}
            onChange={() => toggle('showBoreholes')}
            className="rounded border-border text-brand focus:ring-brand/30 h-3.5 w-3.5 accent-brand"
          />
          <span className="font-medium text-text-primary">Boreholes & Core Assays</span>
        </label>
        <span className="text-[10px] font-mono text-copper font-medium">8 Holes</span>
      </div>

      {/* Layer 4: Geological Faults & Lineaments */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={layers.showGeologyFaults}
            onChange={() => toggle('showGeologyFaults')}
            className="rounded border-border text-brand focus:ring-brand/30 h-3.5 w-3.5 accent-brand"
          />
          <span className="font-medium text-text-primary">Structures & Faults</span>
        </label>
        <span className="text-[10px] font-mono text-text-muted">GSI Data</span>
      </div>

      {/* Layer 5: Satellite Remote Sensing */}
      <div className="space-y-1.5 pt-2 border-t border-border/60">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={layers.showSatelliteIndex}
              onChange={() => toggle('showSatelliteIndex')}
              className="rounded border-border text-brand focus:ring-brand/30 h-3.5 w-3.5 accent-brand"
            />
            <span className="font-medium text-text-primary">Space Tech / Earth Obs.</span>
          </label>
          <span className="text-[10px] font-mono text-brand">Sentinel-2</span>
        </div>

        {layers.showSatelliteIndex && (
          <div className="pl-5 grid grid-cols-3 gap-1 pt-1">
            {(['ndvi', 'ndmi', 'lst'] as const).map(idx => (
              <button
                key={idx}
                onClick={() => setLayers(prev => ({ ...prev, activeSatelliteIndex: idx }))}
                className={`py-1 px-1.5 rounded text-[10px] font-mono text-center uppercase transition-colors border ${
                  layers.activeSatelliteIndex === idx
                    ? 'bg-brand/10 border-brand text-brand font-semibold'
                    : 'bg-subtle border-border text-text-muted hover:text-text-primary'
                }`}
              >
                {idx === 'ndvi' ? 'NDVI' : idx === 'ndmi' ? 'NDMI' : 'LST (°C)'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Basemap Selection */}
      <div className="pt-2 border-t border-border/60 space-y-1.5">
        <div className="text-[11px] font-medium text-text-secondary flex items-center gap-1">
          <MapIcon className="w-3 h-3 text-text-muted" />
          <span>Base Map Style</span>
        </div>
        <div className="grid grid-cols-3 gap-1 text-[10px]">
          {(['positron', 'satellite', 'topo'] as const).map(b => (
            <button
              key={b}
              onClick={() => setLayers(prev => ({ ...prev, basemap: b }))}
              className={`py-1 px-1 text-center capitalize rounded border transition-colors ${
                layers.basemap === b
                  ? 'bg-surface font-semibold text-text-primary border-brand shadow-subtle'
                  : 'bg-subtle text-text-secondary border-border hover:bg-surface'
              }`}
            >
              {b === 'positron' ? 'Subdued' : b === 'satellite' ? 'Satellite' : 'Topo'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
