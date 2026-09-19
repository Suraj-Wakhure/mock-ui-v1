import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import L from 'leaflet';
import { 
  RasterCell, 
  TargetZone, 
  TARGET_ZONES, 
  generateRasterGrid, 
  GRID_CONFIG,
  REGIONAL_GEOLOGY,
  GeologicalFormation
} from '../../data/rasterGridData';
import { EXPLORATION_ASSAY_DATA } from '../../data/explorationAssayData';
import { ZoomIn, ZoomOut, Crosshair, Maximize2, Minimize2 } from 'lucide-react';

export interface MapVisualOptions {
  showProspectivityMap: boolean;
  showDrillingZones: boolean;
  showBoreholes: boolean;
  hoverToInspect: boolean;
  displayMode: 'cells' | 'heatmap' | 'contours';
  colorBy: 'prospectivity' | 'confidence';
  minProspectivityFilter: number;
  layerOpacity: number;
}

interface MineDSSMapProps {
  center: [number, number];
  zoom: number;
  options: MapVisualOptions;
  selectedZoneId: number | null;
  onSelectZone: (zone: TargetZone | null) => void;
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
}

export const MineDSSMap: React.FC<MineDSSMapProps> = ({
  center,
  zoom,
  options,
  selectedZoneId,
  onSelectZone,
  isMaximized = false,
  onToggleMaximize
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Layers
  const geologyLayerRef = useRef<L.LayerGroup | null>(null);
  const aoiLayerRef = useRef<L.Rectangle | null>(null);
  const rasterLayerRef = useRef<L.LayerGroup | null>(null);
  const zonesLayerRef = useRef<L.LayerGroup | null>(null);
  const boreholeLayerRef = useRef<L.LayerGroup | null>(null);
  const hoverHighlightRef = useRef<L.Rectangle | null>(null);

  const optionsRef = useRef(options);
  optionsRef.current = options;

  // Mouse hover state for smooth cursor-tracking inspector popup
  const [hoveredCell, setHoveredCell] = useState<RasterCell | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({ width: 800, height: 600 });

  // Generate dense raster grid memoized (35 rows x 45 cols = 1,575 distinct pixels)
  const rasterCells = useMemo(() => generateRasterGrid(), []);

  // 2D matrix for instant O(1) cell lookup
  const rasterMatrix = useMemo(() => {
    const matrix: (RasterCell | undefined)[][] = [];
    for (let r = 0; r < GRID_CONFIG.rows; r++) {
      matrix[r] = [];
    }
    rasterCells.forEach(cell => {
      const parts = cell.id.split('-');
      const r = parseInt(parts[1], 10);
      const c = parseInt(parts[2], 10);
      if (!isNaN(r) && !isNaN(c)) {
        matrix[r][c] = cell;
      }
    });
    return matrix;
  }, [rasterCells]);

  // Color mapping matching MineDSS Image 2:
  // Low = Warm Pale Cream Bedrock (#FAF7D8 / #F3EFBF)
  // Med = Soft Aqua / Vibrant Teal (#86B5B8 / #4E9CA0)
  // High = Deep Royal Indigo Navy (#163E63 / #112F4D)
  const getCellColor = (p: number, conf: string): string => {
    if (options.colorBy === 'confidence') {
      if (conf === 'Strong match') return '#163E63';
      if (conf === 'Moderate') return '#4E9CA0';
      return '#EAF0D8';
    }

    if (p >= 0.80) return '#163E63'; // Deep Royal Navy
    if (p >= 0.65) return '#26677F'; // Deep Teal Blue
    if (p >= 0.50) return '#4E9CA0'; // Vibrant Teal
    if (p >= 0.35) return '#86B5B8'; // Soft Aqua
    if (p >= 0.22) return '#D4E2BE'; // Pale Sage / Buff
    return '#F5F0CF'; // Warm Pale Cream Bedrock
  };

  // Track container size on resize & invalidate map size
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const updateSize = () => {
      if (mapContainerRef.current) {
        setContainerSize({
          width: mapContainerRef.current.clientWidth,
          height: mapContainerRef.current.clientHeight
        });
        mapInstanceRef.current?.invalidateSize();
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [isMaximized]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: zoom,
      zoomControl: false,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    // Esri World Topographic Basemap (Official Clean Topographic & Geological Shading)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Esri, HERE, Garmin, © OpenStreetMap contributors'
    }).addTo(map);

    // Create Layer Groups
    geologyLayerRef.current = L.layerGroup().addTo(map);

    // Render Regional Geological Formations (Peach, Sand, Slate, Grey polygons outside AOI)
    REGIONAL_GEOLOGY.forEach(formation => {
      const poly = L.polygon(formation.polygon, {
        fillColor: formation.color,
        fillOpacity: 0.38,
        color: '#8A9BA8',
        weight: 1.2,
        opacity: 0.7,
        interactive: false
      });
      geologyLayerRef.current?.addLayer(poly);
    });

    // Red dashed AOI boundary rectangle matching MineDSS Image 2
    const aoiBounds: [[number, number], [number, number]] = [
      [GRID_CONFIG.baseLat, GRID_CONFIG.baseLng],
      [
        GRID_CONFIG.baseLat + GRID_CONFIG.rows * GRID_CONFIG.step,
        GRID_CONFIG.baseLng + GRID_CONFIG.cols * GRID_CONFIG.step
      ]
    ];

    aoiLayerRef.current = L.rectangle(aoiBounds, {
      color: '#EF4444',
      weight: 2,
      dashArray: '6, 6',
      fill: false,
      opacity: 1,
      interactive: false
    }).addTo(map);

    rasterLayerRef.current = L.layerGroup().addTo(map);
    zonesLayerRef.current = L.layerGroup().addTo(map);
    boreholeLayerRef.current = L.layerGroup().addTo(map);

    // Native Leaflet mouse tracking across discrete pixels
    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      if (!optionsRef.current.hoverToInspect || !optionsRef.current.showProspectivityMap) {
        setHoveredCell(null);
        return;
      }
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      const { baseLat, baseLng, step, rows, cols } = GRID_CONFIG;

      const r = Math.round((lat - baseLat) / step);
      const c = Math.round((lng - baseLng) / step);

      let cell: RasterCell | null = null;
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        cell = rasterMatrix[r]?.[c] || null;
      }
      if (!cell) {
        const half = step / 2;
        cell = rasterCells.find(
          k => Math.abs(lat - k.lat) <= half && Math.abs(lng - k.lng) <= half
        ) || null;
      }

      if (cell) {
        setHoveredCell(cell);
        setMousePos({ x: e.containerPoint.x, y: e.containerPoint.y });
      } else {
        setHoveredCell(null);
      }
    });

    map.on('mouseout', () => {
      setHoveredCell(null);
    });

    // Handle map clicks to select target zone
    map.on('click', (e: L.LeafletMouseEvent) => {
      const latlng = e.latlng;
      const clickedZone = TARGET_ZONES.find(zone => {
        const poly = L.polygon(zone.polygon);
        return poly.getBounds().contains(latlng);
      });
      onSelectZone(clickedZone || null);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update center when mine changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, zoom, { animate: true });
    }
  }, [center, zoom]);

  // Render Raster Grid (Solid pixels matching MineDSS Image 2)
  useEffect(() => {
    if (!rasterLayerRef.current || !mapInstanceRef.current) return;
    rasterLayerRef.current.clearLayers();

    if (!options.showProspectivityMap) return;

    const { step } = GRID_CONFIG;
    const half = step / 2;
    const baseOpacity = options.layerOpacity;

    // CELLS MODE (Solid discrete rectangular pixels filling 100% of AOI)
    if (options.displayMode === 'cells') {
      rasterCells.forEach(cell => {
        if (cell.prospectivity < options.minProspectivityFilter) return;

        const bounds: [[number, number], [number, number]] = [
          [cell.lat - half, cell.lng - half],
          [cell.lat + half, cell.lng + half]
        ];

        const color = getCellColor(cell.prospectivity, cell.confidence);

        const pixel = L.rectangle(bounds, {
          fillColor: color,
          fillOpacity: 0.94 * baseOpacity,
          weight: 0.45,
          color: '#FFFFFF',
          opacity: 0.45 * baseOpacity,
          interactive: false
        });

        rasterLayerRef.current?.addLayer(pixel);
      });
    }

    // HEATMAP MODE (Continuous Blended Geophysical Heat Map)
    else if (options.displayMode === 'heatmap') {
      rasterCells.forEach(cell => {
        if (cell.prospectivity < options.minProspectivityFilter) return;

        const color = getCellColor(cell.prospectivity, cell.confidence);
        const radius = Math.max(10, Math.min(24, cell.prospectivity * 26));

        const circle = L.circleMarker([cell.lat, cell.lng], {
          radius: radius,
          fillColor: color,
          fillOpacity: 0.65 * baseOpacity,
          stroke: false,
          interactive: false
        });

        rasterLayerRef.current?.addLayer(circle);
      });
    }

    // CONTOURS MODE
    else if (options.displayMode === 'contours') {
      rasterCells.forEach(cell => {
        const bounds: [[number, number], [number, number]] = [
          [cell.lat - half, cell.lng - half],
          [cell.lat + half, cell.lng + half]
        ];
        const color = getCellColor(cell.prospectivity, cell.confidence);
        const wash = L.rectangle(bounds, {
          fillColor: color,
          fillOpacity: cell.prospectivity >= 0.70 ? 0.8 : 0.25,
          weight: 0.3,
          color: '#FFFFFF',
          opacity: 0.3,
          interactive: false
        });
        rasterLayerRef.current?.addLayer(wash);
      });
    }
  }, [
    rasterCells, 
    options.showProspectivityMap, 
    options.displayMode, 
    options.colorBy, 
    options.minProspectivityFilter, 
    options.layerOpacity
  ]);

  // Render Target Zones with Stepped Purple Outlines and Badges matching Image 2
  useEffect(() => {
    if (!zonesLayerRef.current) return;
    zonesLayerRef.current.clearLayers();

    if (!options.showDrillingZones) return;

    TARGET_ZONES.forEach(zone => {
      const isSelected = selectedZoneId === zone.id;

      // Bright magenta/purple stepped perimeter line matching Image 2
      const polygon = L.polygon(zone.polygon, {
        color: isSelected ? '#A855F7' : '#D946EF',
        weight: isSelected ? 3.5 : 2.5,
        fillColor: '#D946EF',
        fillOpacity: isSelected ? 0.25 : 0.08,
        opacity: 1,
        interactive: true
      });

      polygon.on('click', () => {
        onSelectZone(zone);
      });

      const labelIcon = L.divIcon({
        className: 'custom-zone-badge',
        html: `
          <div style="
            background-color: #9333EA;
            color: #FFFFFF;
            font-family: 'Outfit', sans-serif;
            font-weight: 700;
            font-size: 11px;
            padding: 1px 6px;
            border-radius: 3px;
            border: 1px solid #FFFFFF;
            box-shadow: 0 2px 4px rgba(0,0,0,0.35);
            display: inline-block;
            cursor: pointer;
          ">${zone.label}</div>
        `,
        iconSize: [28, 20],
        iconAnchor: [14, 10]
      });

      const marker = L.marker(zone.center, { icon: labelIcon });
      marker.on('click', () => onSelectZone(zone));

      zonesLayerRef.current?.addLayer(polygon);
      zonesLayerRef.current?.addLayer(marker);
    });
  }, [options.showDrillingZones, selectedZoneId]);

  // Render Core Boreholes
  useEffect(() => {
    if (!boreholeLayerRef.current) return;
    boreholeLayerRef.current.clearLayers();

    if (!options.showBoreholes) return;

    const uniqueBoreholes = Array.from(
      new Map(EXPLORATION_ASSAY_DATA.map(b => [b.borehole_id, b])).values()
    );

    uniqueBoreholes.forEach(bh => {
      const marker = L.circleMarker([bh.latitude, bh.longitude], {
        radius: 5.5,
        fillColor: '#B56A32',
        color: '#FFFFFF',
        weight: 1.5,
        opacity: 1,
        fillOpacity: 0.95
      });

      marker.bindTooltip(`Borehole ${bh.borehole_id} · ${bh.mn_pct}% Mn`, {
        direction: 'top',
        offset: [0, -5],
        className: 'font-sans text-xs'
      });

      boreholeLayerRef.current?.addLayer(marker);
    });
  }, [options.showBoreholes]);

  // High-performance smooth mouse tracking across pixels
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current || !mapInstanceRef.current) return;
    if (!options.hoverToInspect || !options.showProspectivityMap) {
      if (hoveredCell) setHoveredCell(null);
      return;
    }

    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const map = mapInstanceRef.current;
    const latlng = map.containerPointToLatLng([x, y]);
    const lat = latlng.lat;
    const lng = latlng.lng;

    const { baseLat, baseLng, step, rows, cols } = GRID_CONFIG;
    const r = Math.round((lat - baseLat) / step);
    const c = Math.round((lng - baseLng) / step);

    if (r >= 0 && r < rows && c >= 0 && c < cols) {
      const cell = rasterMatrix[r]?.[c];
      if (cell) {
        setHoveredCell(cell);
        setMousePos({ x, y });
        return;
      }
    }

    if (hoveredCell) {
      setHoveredCell(null);
    }
  }, [options.hoverToInspect, options.showProspectivityMap, rasterMatrix, hoveredCell]);

  const handleMouseLeave = useCallback(() => {
    setHoveredCell(null);
  }, []);

  // Update white outline highlight over currently hovered pixel
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (hoverHighlightRef.current) {
      mapInstanceRef.current.removeLayer(hoverHighlightRef.current);
      hoverHighlightRef.current = null;
    }

    if (hoveredCell && options.hoverToInspect && options.showProspectivityMap) {
      const half = GRID_CONFIG.step / 2;
      hoverHighlightRef.current = L.rectangle(
        [
          [hoveredCell.lat - half, hoveredCell.lng - half],
          [hoveredCell.lat + half, hoveredCell.lng + half]
        ],
        {
          fill: false,
          weight: 2,
          color: '#FFFFFF',
          opacity: 0.95,
          interactive: false
        }
      ).addTo(mapInstanceRef.current);
    }
  }, [hoveredCell, options.hoverToInspect, options.showProspectivityMap]);

  // Zoom to lease AOI bounds
  const handleZoomAoi = () => {
    if (mapInstanceRef.current && aoiLayerRef.current) {
      mapInstanceRef.current.fitBounds(aoiLayerRef.current.getBounds(), { padding: [30, 30] });
    }
  };

  // Calculate drivers counts
  const supportsCount = hoveredCell
    ? (hoveredCell.drivers.alteration === 'supports' ? 1 : 0) +
      (hoveredCell.drivers.structure === 'supports' ? 1 : 0) +
      (hoveredCell.drivers.radiometrics === 'supports' ? 1 : 0) +
      (hoveredCell.drivers.terrain === 'supports' ? 1 : 0)
    : 0;

  const againstCount = hoveredCell
    ? (hoveredCell.drivers.alteration === 'against' ? 1 : 0) +
      (hoveredCell.drivers.radiometrics === 'against' ? 1 : 0)
    : 0;

  const pct = hoveredCell ? Math.max(8, Math.min(100, Math.round(hoveredCell.prospectivity * 100))) : 0;
  const isAboveThreshold = hoveredCell ? hoveredCell.prospectivity >= 0.70 : false;

  // Collision boundary check for floating card
  const cardWidth = 280;
  const cardHeight = 310;
  const flipX = mousePos.x > containerSize.width - cardWidth - 20;
  const flipY = mousePos.y > containerSize.height - cardHeight - 20;
  const posX = flipX ? mousePos.x - cardWidth - 14 : mousePos.x + 18;
  const posY = flipY ? Math.max(10, mousePos.y - cardHeight + 40) : Math.max(10, mousePos.y - 15);

  return (
    <div
      className="relative w-full h-full bg-[#E5E0D8] select-none overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Map DOM Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0 cursor-crosshair" />

      {/* Floating Popup Window that tracks the mouse pointer across pixels (Matching Image 2) */}
      {hoveredCell && options.hoverToInspect && options.showProspectivityMap && (
        <div
          className="absolute z-[2500] pointer-events-none transition-transform duration-75 ease-out select-none"
          style={{
            left: `${posX}px`,
            top: `${posY}px`,
            width: `${cardWidth}px`
          }}
        >
          <div className="bg-white dark:bg-[#151B19] text-[#17201D] dark:text-[#EDF2EF] rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xl p-3.5 backdrop-blur-md font-sans">
            {/* Header: Pin icon + This location */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                <span className="text-sm">📍</span>
                <span>This location</span>
              </div>
              {hoveredCell.zoneId ? (
                <span className="text-[10px] font-bold bg-purple-600 text-white px-2 py-0.5 rounded-full shadow-sm">
                  Zone #{hoveredCell.zoneId}
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 font-medium font-mono">
                  {hoveredCell.lat.toFixed(4)}, {hoveredCell.lng.toFixed(4)}
                </span>
              )}
            </div>

            {/* Prospectivity Section: Blue progress bar & number */}
            <div className="mt-2.5">
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                Prospectivity
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                  <div
                    className="h-full bg-[#1D70B8] rounded-full transition-all duration-150"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-base font-extrabold text-slate-900 dark:text-white min-w-[36px] text-right">
                  {hoveredCell.prospectivity.toFixed(2)}
                </span>
              </div>

              {/* Threshold badge */}
              <div className="mt-1.5">
                {isAboveThreshold ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    <span>✓</span> <span>high drill priority</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    <span>◎</span> <span>below drill threshold</span>
                  </span>
                )}
              </div>
            </div>

            {/* Confidence Box */}
            <div className="mt-2.5 p-2 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 dark:text-white">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Confidence: <b>{hoveredCell.confidence}</b></span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 pl-4">
                {hoveredCell.confidence === 'Strong match'
                  ? 'resembles ground with known deposits'
                  : 'moderate regional proxy correlation'}
              </div>
            </div>

            {/* What's driving this */}
            <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="text-[11px] font-bold text-slate-900 dark:text-white">
                What's driving this
              </div>
              <div className="flex items-center gap-2 text-[10px] font-semibold mt-0.5 mb-1.5">
                <span className="text-emerald-600">↗ {supportsCount} supports</span>
                <span className="text-slate-300 dark:text-slate-600">·</span>
                <span className="text-rose-600">↘ {againstCount} against</span>
              </div>

              {/* Feature Drivers Rows */}
              <div className="flex flex-col gap-1.5 text-[10px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Terrain shape</span>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-semibold text-[9px]">↗ supports</span>
                    <div className="w-11 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-9 h-full bg-emerald-600 rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Alteration minerals</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold text-[9px] ${hoveredCell.drivers.alteration === 'supports' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {hoveredCell.drivers.alteration === 'supports' ? '↗ supports' : '↘ against'}
                    </span>
                    <div className="w-11 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${hoveredCell.drivers.alteration === 'supports' ? 'w-9 bg-emerald-600' : 'w-9 bg-rose-500'}`} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Magnetics & gravity</span>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-semibold text-[9px]">↗ supports</span>
                    <div className="w-11 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-7 h-full bg-emerald-600 rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Radiometrics</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium text-[9px]">· neutral</span>
                    <div className="w-11 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-3 h-full bg-slate-400 rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Surface texture</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium text-[9px]">· neutral</span>
                    <div className="w-11 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-3 h-full bg-slate-400 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rock Unit Footer */}
            <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span>🥞</span>
              <span className="truncate">
                Rock unit: <b className="text-slate-800 dark:text-slate-200 font-semibold">metamorphic and sedimentary, undifferentiated</b>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Top Map Controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 bg-surface border border-border rounded shadow-subtle overflow-hidden">
        <button
          onClick={() => mapInstanceRef.current?.zoomIn()}
          className="w-7 h-7 flex items-center justify-center text-text-primary hover:bg-subtle transition-colors border-b border-border"
          title="Zoom in"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => mapInstanceRef.current?.zoomOut()}
          className="w-7 h-7 flex items-center justify-center text-text-primary hover:bg-subtle transition-colors border-b border-border"
          title="Zoom out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleZoomAoi}
          className="w-7 h-7 flex items-center justify-center text-text-primary hover:bg-subtle transition-colors border-b border-border"
          title="Fit Lease AOI Boundary"
        >
          <Crosshair className="w-3.5 h-3.5" />
        </button>
        {onToggleMaximize && (
          <button
            onClick={onToggleMaximize}
            className={`w-7 h-7 flex items-center justify-center transition-colors ${
              isMaximized ? 'bg-brand text-white' : 'text-text-primary hover:bg-subtle'
            }`}
            title={isMaximized ? 'Restore normal view' : 'Maximize map canvas'}
          >
            {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Attribution matching MineDSS Image 2 Reference */}
      <div className="absolute bottom-2 left-2 z-10 bg-surface/90 backdrop-blur-sm border border-border px-2.5 py-1 rounded text-[10px] text-text-muted flex items-center gap-1.5 max-w-[85%] truncate">
        <span className="font-semibold text-text-primary">MineDSS tiles protocol-v1</span>
        <span>—</span>
        <span>Geological Survey of India (GSI) source data</span>
        <span>|</span>
        <span className="truncate">Esri, HERE, Garmin, © OpenStreetMap contributors</span>
      </div>
    </div>
  );
};
