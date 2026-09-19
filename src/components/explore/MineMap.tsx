import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { LayerState } from './LayerControls';
import { MapLegend } from './MapLegend';
import { PROSPECTIVITY_GRID_CELLS, GEOLOGICAL_FAULTS } from '../../data/prospectivityModelData';
import { EXPLORATION_ASSAY_DATA } from '../../data/explorationAssayData';
import { ZoomIn, ZoomOut, Crosshair, RefreshCw, Ruler } from 'lucide-react';

interface MineMapProps {
  center: [number, number];
  zoom: number;
  layers: LayerState;
  selectedTargetId: string | null;
  onSelectTarget: (id: string) => void;
}

export const MineMap: React.FC<MineMapProps> = ({
  center,
  zoom,
  layers,
  selectedTargetId,
  onSelectTarget
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const gridLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const boreholeLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const faultsLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [mouseCoords, setMouseCoords] = useState<{ lat: number; lng: number } | null>({
    lat: center[0],
    lng: center[1]
  });

  // Color mapper according to strictly defined Non-Red-Green Prospectivity scale:
  // Low: #DCE9ED (Pale Blue), Medium: #4E9CA0 (Teal), High: #163E63 (Deep Blue)
  const getProspectivityColor = (val: number): string => {
    if (val >= 0.75) return '#163E63';
    if (val >= 0.45) return '#4E9CA0';
    return '#DCE9ED';
  };

  // Basemap URLs
  const basemapUrls = {
    positron: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    topo: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: zoom,
      zoomControl: false,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    // Default tile layer
    tileLayerRef.current = L.tileLayer(basemapUrls[layers.basemap], {
      maxZoom: 18,
      subdomains: 'abcd'
    }).addTo(map);

    // Layer groups
    gridLayerGroupRef.current = L.layerGroup().addTo(map);
    boreholeLayerGroupRef.current = L.layerGroup().addTo(map);
    faultsLayerGroupRef.current = L.layerGroup().addTo(map);

    // Mouse coordinates tracker
    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      setMouseCoords({
        lat: Number(e.latlng.lat.toFixed(5)),
        lng: Number(e.latlng.lng.toFixed(5))
      });
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update center & zoom if mine changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, zoom, { animate: true });
    }
  }, [center, zoom]);

  // Update Basemap
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    tileLayerRef.current = L.tileLayer(basemapUrls[layers.basemap], {
      maxZoom: 18,
      subdomains: 'abcd'
    }).addTo(mapInstanceRef.current);
  }, [layers.basemap]);

  // Render Geological Faults / Lineaments
  useEffect(() => {
    if (!faultsLayerGroupRef.current) return;
    faultsLayerGroupRef.current.clearLayers();

    if (layers.showGeologyFaults) {
      GEOLOGICAL_FAULTS.forEach(fault => {
        const polyline = L.polyline(fault.coordinates, {
          color: '#17201D',
          weight: 2,
          dashArray: '4, 4',
          opacity: 0.85
        });

        polyline.bindTooltip(`<b>${fault.name}</b><br/>Type: ${fault.type}`, {
          className: 'font-mono text-xs'
        });

        faultsLayerGroupRef.current?.addLayer(polyline);
      });
    }
  }, [layers.showGeologyFaults]);

  // Render Boreholes & Assays
  useEffect(() => {
    if (!boreholeLayerGroupRef.current) return;
    boreholeLayerGroupRef.current.clearLayers();

    if (layers.showBoreholes) {
      // Group assays by unique borehole_id
      const uniqueBoreholes = Array.from(
        new Map(EXPLORATION_ASSAY_DATA.map(b => [b.borehole_id, b])).values()
      );

      uniqueBoreholes.forEach(bh => {
        // Copper circle with white center for technical clarity
        const marker = L.circleMarker([bh.latitude, bh.longitude], {
          radius: 6,
          fillColor: '#B56A32',
          color: '#FFFFFF',
          weight: 1.5,
          opacity: 1,
          fillOpacity: 0.95
        });

        const popupContent = `
          <div style="font-family: 'IBM Plex Mono', monospace; font-size: 11px; padding: 4px;">
            <div style="font-weight: 700; color: #0B5F63; border-bottom: 1px solid #D9DEDA; padding-bottom: 3px; margin-bottom: 4px;">
              ${bh.borehole_id} (Core Assay)
            </div>
            <div>Lithology: <b>${bh.lithology}</b></div>
            <div>Assayed Mn: <b style="color: #19734A;">${bh.mn_pct}%</b></div>
            <div>Total Depth: <b>${bh.hole_depth_m} m</b></div>
            <div style="color: #8A928E; font-size: 10px; margin-top: 3px;">
              Lat: ${bh.latitude.toFixed(4)}, Lng: ${bh.longitude.toFixed(4)}
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.bindTooltip(`Borehole ${bh.borehole_id} (${bh.mn_pct}% Mn)`, {
          direction: 'top',
          offset: [0, -6]
        });

        boreholeLayerGroupRef.current?.addLayer(marker);
      });
    }
  }, [layers.showBoreholes]);

  // Render Prospectivity Grid Cells
  useEffect(() => {
    if (!gridLayerGroupRef.current) return;
    gridLayerGroupRef.current.clearLayers();

    if (layers.showProspectivity) {
      PROSPECTIVITY_GRID_CELLS.forEach(cell => {
        const isSelected = cell.target_id === selectedTargetId;
        const color = getProspectivityColor(cell.prospectivity);

        const polygon = L.rectangle(cell.bounds, {
          fillColor: color,
          fillOpacity: layers.prospectivityOpacity / 100,
          color: isSelected ? '#B56A32' : '#FFFFFF',
          weight: isSelected ? 2.5 : 0.8,
          opacity: isSelected ? 1 : 0.6
        });

        polygon.on('click', () => {
          if (cell.target_id) {
            onSelectTarget(cell.target_id);
          }
        });

        const satVal = layers.activeSatelliteIndex === 'lst' ? `${cell.lst_c}°C` : cell[layers.activeSatelliteIndex];
        polygon.bindTooltip(
          `<div><b>Cell ${cell.grid_id}</b>${cell.target_id ? ` · ${cell.target_id}` : ''}</div>
           <div>Prospectivity: <b>${cell.prospectivity.toFixed(2)}</b> (${cell.confidence})</div>
           ${layers.showSatelliteIndex ? `<div>${layers.activeSatelliteIndex.toUpperCase()}: ${satVal}</div>` : ''}`,
          { direction: 'center', opacity: 0.95 }
        );

        gridLayerGroupRef.current?.addLayer(polygon);
      });
    }
  }, [
    layers.showProspectivity,
    layers.prospectivityOpacity,
    layers.showSatelliteIndex,
    layers.activeSatelliteIndex,
    selectedTargetId
  ]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleReset = () => mapInstanceRef.current?.setView(center, zoom, { animate: true });

  return (
    <div className="relative w-full h-full min-h-[480px] bg-subtle rounded border border-border overflow-hidden">
      {/* Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Essential Map Controls (Zoom, Reset, Locate) */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 shadow-subtle">
        <button
          onClick={handleZoomIn}
          className="w-7 h-7 bg-surface/95 backdrop-blur-sm border border-border rounded flex items-center justify-center text-text-primary hover:bg-subtle transition-colors"
          title="Zoom in"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-7 h-7 bg-surface/95 backdrop-blur-sm border border-border rounded flex items-center justify-center text-text-primary hover:bg-subtle transition-colors"
          title="Zoom out"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleReset}
          className="w-7 h-7 bg-surface/95 backdrop-blur-sm border border-border rounded flex items-center justify-center text-text-primary hover:bg-subtle transition-colors"
          title="Reset to Mine Center"
          aria-label="Reset view"
        >
          <Crosshair className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Floating Coordinates Bar */}
      <div className="absolute bottom-3 left-3 z-10 bg-surface/90 backdrop-blur-sm border border-border rounded px-2.5 py-1 text-[10px] font-mono text-text-secondary shadow-subtle flex items-center gap-3">
        <span>
          LAT: <span className="text-text-primary font-semibold">{mouseCoords?.lat.toFixed(4)}° N</span>
        </span>
        <span className="text-border">|</span>
        <span>
          LNG: <span className="text-text-primary font-semibold">{mouseCoords?.lng.toFixed(4)}° E</span>
        </span>
        <span className="text-border">|</span>
        <span className="text-text-muted">CRS: EPSG:4326 (WGS84)</span>
      </div>

      {/* Floating Restrained Legend */}
      {layers.showProspectivity && (
        <div className="absolute bottom-3 right-3 z-10">
          <MapLegend />
        </div>
      )}
    </div>
  );
};
