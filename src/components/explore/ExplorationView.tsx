import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { MineDSSMap, MapVisualOptions } from './MineDSSMap';
import { MineDSSLeftSidebar } from './MineDSSLeftSidebar';
import { MineDSSPropertiesPanel } from './MineDSSPropertiesPanel';
import { MineDSSBottomTable } from './MineDSSBottomTable';
import { TargetZone, TARGET_ZONES } from '../../data/rasterGridData';
import { Search, PlusSquare, MapPin, ChevronUp, ChevronDown, Maximize2, Minimize2 } from 'lucide-react';

export const ExplorationView: React.FC = () => {
  const { selectedMine, setIsMethodologyOpen } = useApp();

  // Selected drilling zone
  const [selectedZone, setSelectedZone] = useState<TargetZone | null>(TARGET_ZONES[1]); // Zone #2 default

  // Search address / coords
  const [searchQuery, setSearchQuery] = useState('');

  // Map maximization mode
  const [isMaximized, setIsMaximized] = useState(false);

  // Bottom table collapse toggle
  const [isTableCollapsed, setIsTableCollapsed] = useState(false);

  // Map layer symbology options
  const [options, setOptions] = useState<MapVisualOptions>({
    showProspectivityMap: true,
    showDrillingZones: true,
    showBoreholes: true,
    hoverToInspect: true,
    displayMode: 'cells',
    colorBy: 'prospectivity',
    minProspectivityFilter: 0,
    layerOpacity: 0.85
  });

  // Handle search submission to jump to target
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    const matchedZone = TARGET_ZONES.find(
      z => z.name.toLowerCase().includes(query) || z.label.toLowerCase().includes(query) || `zone ${z.id}`.includes(query)
    );
    if (matchedZone) {
      setSelectedZone(matchedZone);
    }
  };

  return (
    <div className={`flex flex-col ${isMaximized ? 'fixed inset-0 z-50 p-2 bg-app' : 'h-full min-h-[580px]'} bg-surface border border-border rounded shadow-subtle overflow-hidden`}>
      {/* Subheader Search & Address Bar (Matching MineDSS top strip) */}
      <div className="h-10 px-3 border-b border-border bg-subtle/40 flex items-center justify-between text-xs select-none">
        <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search zone (e.g. #1, Footwall, BH017)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1 bg-surface border border-border rounded text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand font-sans"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setOptions(prev => ({ ...prev, showProspectivityMap: true, showDrillingZones: true }));
            }}
            className="flex items-center gap-1 px-2.5 py-1 bg-surface border border-border rounded text-text-secondary hover:text-text-primary text-[11px] font-sans transition-colors"
            title="Area of Interest Boundary"
          >
            <PlusSquare className="w-3.5 h-3.5 text-text-muted" />
            <span>AOI</span>
          </button>
        </form>

        <div className="flex items-center gap-3 text-[11px] font-sans text-text-muted">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-text-secondary font-medium">3,750 Spatial Nodes Active</span>
          </div>
          <span className="text-border hidden md:inline">|</span>
          <span className="hidden md:inline">Nagpur-Bhandara-Balaghat Manganese Belt</span>
          
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="flex items-center gap-1 px-2 py-0.5 rounded border border-border bg-surface hover:bg-subtle text-text-primary text-[11px] font-medium transition-colors ml-1"
            title={isMaximized ? 'Restore View' : 'Maximize Map Canvas'}
          >
            {isMaximized ? <Minimize2 className="w-3 h-3 text-brand" /> : <Maximize2 className="w-3 h-3 text-text-muted" />}
            <span className="hidden sm:inline">{isMaximized ? 'Restore' : 'Maximize'}</span>
          </button>
        </div>
      </div>

      {/* Main Map Body: Left Symbology Sidebar, Center Map, Right Properties Panel */}
      <div className="flex-1 flex flex-row min-h-0 overflow-hidden">
        {/* Left Symbology Sidebar (collapsible in maximized mode) */}
        {!isMaximized && (
          <MineDSSLeftSidebar options={options} setOptions={setOptions} />
        )}

        {/* Center Map Canvas with Floating Inspector */}
        <div className="flex-1 relative min-w-0 h-full">
          <MineDSSMap
            center={selectedMine.coordinates}
            zoom={14}
            options={options}
            selectedZoneId={selectedZone?.id ?? null}
            onSelectZone={z => setSelectedZone(z)}
            isMaximized={isMaximized}
            onToggleMaximize={() => setIsMaximized(!isMaximized)}
          />
        </div>

        {/* Right Properties Panel */}
        {!isMaximized && (
          <MineDSSPropertiesPanel
            selectedZone={selectedZone}
            onClearZone={() => setSelectedZone(null)}
            onViewReport={() => setIsMethodologyOpen(true)}
          />
        )}
      </div>

      {/* Bottom Ranked Drilling-Target Zones Table with Toggle */}
      {!isMaximized && (
        <div className="border-t border-border flex flex-col">
          <div className="flex items-center justify-between px-3 py-1 bg-subtle/50 text-[11px] text-text-muted border-b border-border/60">
            <span className="font-semibold text-text-primary flex items-center gap-1.5">
              <span>Drilling-Target Zones</span>
              <span className="text-[10px] bg-brand/10 text-brand px-1.5 py-0.2 rounded font-mono">8 Ranked</span>
            </span>
            <button
              onClick={() => setIsTableCollapsed(!isTableCollapsed)}
              className="flex items-center gap-1 text-text-secondary hover:text-text-primary text-[10px] font-medium"
            >
              <span>{isTableCollapsed ? 'Show Table' : 'Minimize Table'}</span>
              {isTableCollapsed ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
          {!isTableCollapsed && (
            <MineDSSBottomTable
              selectedZoneId={selectedZone?.id ?? null}
              onSelectZone={z => setSelectedZone(z)}
            />
          )}
        </div>
      )}
    </div>
  );
};
