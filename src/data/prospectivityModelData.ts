import { ProspectivityTarget } from '../types';

export interface ProspectivityGridCell {
  grid_id: string;
  latitude: number;
  longitude: number;
  bounds: [[number, number], [number, number]]; // [[south, west], [north, east]]
  prospectivity: number; // 0.0 - 1.0
  confidence: 'High' | 'Medium' | 'Low';
  target_id?: string;
  ndvi: number;
  ndmi: number;
  lst_c: number;
  elevation_m: number;
}

export const PROSPECTIVITY_TARGETS: ProspectivityTarget[] = [
  {
    grid_id: 'G002',
    target_id: 'T-001',
    name: 'North-East Ridge Target',
    latitude: 21.8780,
    longitude: 79.8250,
    prospectivity: 0.88,
    confidence: 'High',
    area_km2: 0.58,
    primary_evidence: 'Lineament intersection & Sausar gondite unit',
    observed_or_assay_mn_pct: 33.7,
    nearby_borehole: {
      borehole_id: 'BH002',
      distance_m: 120,
      depth_interval: '20.0 – 28.0 m',
      mn_pct: 35.1
    },
    evidence_drivers: [
      { name: 'Geological unit concordance (Mansar)', score: 92, direction: '+', detail: 'Matches known braunite-quartzite host horizon' },
      { name: 'Structural lineament proximity', score: 86, direction: '+', detail: 'Within 75m of major strike fault F-2' },
      { name: 'Surface spectral signature (Sentinel-2)', score: 78, direction: '+', detail: 'Strong Fe-Mn absorption feature band 11/8A' },
      { name: 'Thermal inertia proxy (LST anomaly)', score: 65, direction: '+', detail: 'Dense rock mass thermal retention signature' }
    ],
    model_version: 'GeoProspect-XGB v0.4',
    updated_at: '18 Sep 2026'
  },
  {
    grid_id: 'G001',
    target_id: 'T-003',
    name: 'Bharveli Central Stope Extension',
    latitude: 21.8740,
    longitude: 79.8210,
    prospectivity: 0.84,
    confidence: 'High',
    area_km2: 0.42,
    primary_evidence: 'Subsurface assay confirmation & fault proximity',
    observed_or_assay_mn_pct: 32.4,
    nearby_borehole: {
      borehole_id: 'BH017',
      distance_m: 180,
      depth_interval: '18.0 – 32.0 m',
      mn_pct: 38.6
    },
    evidence_drivers: [
      { name: 'Drilling assay ground-truth (BH017)', score: 94, direction: '+', detail: 'Core intersection confirmed 38.6% Mn at 24m' },
      { name: 'Structural lineament proximity', score: 84, direction: '+', detail: 'Sub-parallel shear zone intersection' },
      { name: 'Geological unit match', score: 81, direction: '+', detail: 'High gondite-to-schist ratio' },
      { name: 'Surface vegetation stress (NDVI)', score: 62, direction: '+', detail: 'Moderate localized canopy stress above mineralized zone' }
    ],
    model_version: 'GeoProspect-XGB v0.4',
    updated_at: '18 Sep 2026'
  },
  {
    grid_id: 'G003',
    target_id: 'T-007',
    name: 'Eastern Footwall Flank',
    latitude: 21.8820,
    longitude: 79.8290,
    prospectivity: 0.79,
    confidence: 'Medium',
    area_km2: 0.31,
    primary_evidence: 'Structural lineament & DEM ridge anomaly',
    observed_or_assay_mn_pct: 27.8,
    nearby_borehole: {
      borehole_id: 'BH004',
      distance_m: 210,
      depth_interval: '24.0 – 36.0 m',
      mn_pct: 29.4
    },
    evidence_drivers: [
      { name: 'Structural lineament proximity', score: 85, direction: '+', detail: 'Conjugate fracture zone cross-cutting stratigraphy' },
      { name: 'Geological unit contact', score: 72, direction: '+', detail: 'Gondite quartzite boundary' },
      { name: 'Topographic ridge feature', score: 68, direction: '+', detail: 'Competent resistant outcrop morphology' }
    ],
    model_version: 'GeoProspect-XGB v0.4',
    updated_at: '18 Sep 2026'
  },
  {
    grid_id: 'G005',
    target_id: 'T-004',
    name: 'South-East Bench Deepening',
    latitude: 21.8720,
    longitude: 79.8250,
    prospectivity: 0.76,
    confidence: 'High',
    area_km2: 0.45,
    primary_evidence: 'High Mn-bearing core assay & fold hinge',
    observed_or_assay_mn_pct: 29.8,
    nearby_borehole: {
      borehole_id: 'BH001',
      distance_m: 230,
      depth_interval: '10.0 – 18.0 m',
      mn_pct: 18.5
    },
    evidence_drivers: [
      { name: 'Fold hinge zone concentration', score: 88, direction: '+', detail: 'Thickening in synclinal keel' },
      { name: 'Geological formation continuity', score: 75, direction: '+', detail: 'Direct continuation from active working stope' },
      { name: 'Hydrothermal alteration index', score: 70, direction: '+', detail: 'Moderate iron-manganese enrichment indicator' }
    ],
    model_version: 'GeoProspect-XGB v0.4',
    updated_at: '18 Sep 2026'
  },
  {
    grid_id: 'G007',
    target_id: 'T-002',
    name: 'Western Hanging Wall Prospect',
    latitude: 21.8760,
    longitude: 79.8180,
    prospectivity: 0.65,
    confidence: 'Medium',
    area_km2: 0.38,
    primary_evidence: 'Spectral iron-manganese anomaly & DEM slope',
    nearby_borehole: {
      borehole_id: 'BH003',
      distance_m: 340,
      depth_interval: '8.0 – 15.0 m',
      mn_pct: 22.1
    },
    evidence_drivers: [
      { name: 'Surface spectral signature', score: 73, direction: '+', detail: 'Shortwave infrared absorption match' },
      { name: 'Geological proximity', score: 62, direction: '+', detail: 'Proximal to Mansar contact zone' },
      { name: 'Sparse drilling constraint', score: 45, direction: '-', detail: 'Nearest borehole >300m reduces spatial confidence' }
    ],
    model_version: 'GeoProspect-XGB v0.4',
    updated_at: '18 Sep 2026'
  },
  {
    grid_id: 'G006',
    target_id: 'T-005',
    name: 'North Flank Boundary',
    latitude: 21.8850,
    longitude: 79.8340,
    prospectivity: 0.52,
    confidence: 'Low',
    area_km2: 0.29,
    primary_evidence: 'Weak lineament extension in schists',
    nearby_borehole: {
      borehole_id: 'BH004',
      distance_m: 480,
      depth_interval: 'Surface',
      mn_pct: 3.1
    },
    evidence_drivers: [
      { name: 'Weak lineament trace', score: 55, direction: '+', detail: 'Inferred fault extension' },
      { name: 'Unfavorable lithology proxy', score: 64, direction: '-', detail: 'Dominated by barren mica schist' }
    ],
    model_version: 'GeoProspect-XGB v0.4',
    updated_at: '18 Sep 2026'
  },
  {
    grid_id: 'G004',
    target_id: 'T-006',
    name: 'South-West Alluvium Zone',
    latitude: 21.8700,
    longitude: 79.8160,
    prospectivity: 0.38,
    confidence: 'Low',
    area_km2: 0.22,
    primary_evidence: 'Covered terrain, low confidence extrapolation',
    nearby_borehole: {
      borehole_id: 'BH003',
      distance_m: 410,
      depth_interval: 'Overburden',
      mn_pct: 1.5
    },
    evidence_drivers: [
      { name: 'Thick transported soil cover', score: 78, direction: '-', detail: 'High vegetation and moisture mask bedrock signal' },
      { name: 'Geological contact ambiguity', score: 60, direction: '-', detail: 'Underlying lithology unconfirmed' }
    ],
    model_version: 'GeoProspect-XGB v0.4',
    updated_at: '18 Sep 2026'
  },
  {
    grid_id: 'G008',
    target_id: 'T-008',
    name: 'South Boundary Baseline',
    latitude: 21.8680,
    longitude: 79.8220,
    prospectivity: 0.22,
    confidence: 'Low',
    area_km2: 0.18,
    primary_evidence: 'Sterile quartzite formation background',
    nearby_borehole: {
      borehole_id: 'BH021',
      distance_m: 520,
      depth_interval: '14.0 – 22.0 m',
      mn_pct: 4.2
    },
    evidence_drivers: [
      { name: 'Sterile quartzite bedrock', score: 82, direction: '-', detail: 'Borehole core shows barren footwall quartzite' },
      { name: 'Absence of spectral indicators', score: 75, direction: '-', detail: 'No detectable Mn-oxide absorption' }
    ],
    model_version: 'GeoProspect-XGB v0.4',
    updated_at: '18 Sep 2026'
  }
];

// 24 grid cells forming the contiguous prospectivity grid over Balaghat lease
export const PROSPECTIVITY_GRID_CELLS: ProspectivityGridCell[] = [
  // Row 1 (North)
  { grid_id: 'G006', latitude: 21.8850, longitude: 79.8340, bounds: [[21.883, 79.831], [21.887, 79.837]], prospectivity: 0.52, confidence: 'Low', target_id: 'T-005', ndvi: 0.71, ndmi: 0.22, lst_c: 30.2, elevation_m: 405 },
  { grid_id: 'G009', latitude: 21.8850, longitude: 79.8280, bounds: [[21.883, 79.825], [21.887, 79.831]], prospectivity: 0.71, confidence: 'Medium', ndvi: 0.58, ndmi: 0.32, lst_c: 31.6, elevation_m: 414 },
  { grid_id: 'G010', latitude: 21.8850, longitude: 79.8220, bounds: [[21.883, 79.819], [21.887, 79.825]], prospectivity: 0.63, confidence: 'Medium', ndvi: 0.64, ndmi: 0.29, lst_c: 31.0, elevation_m: 410 },
  { grid_id: 'G011', latitude: 21.8850, longitude: 79.8160, bounds: [[21.883, 79.813], [21.887, 79.819]], prospectivity: 0.35, confidence: 'Low', ndvi: 0.76, ndmi: 0.19, lst_c: 29.9, elevation_m: 401 },

  // Row 2
  { grid_id: 'G003', latitude: 21.8820, longitude: 79.8290, bounds: [[21.880, 79.826], [21.884, 79.832]], prospectivity: 0.79, confidence: 'Medium', target_id: 'T-007', ndvi: 0.55, ndmi: 0.35, lst_c: 31.8, elevation_m: 417 },
  { grid_id: 'G002', latitude: 21.8780, longitude: 79.8250, bounds: [[21.876, 79.822], [21.880, 79.828]], prospectivity: 0.88, confidence: 'High', target_id: 'T-001', ndvi: 0.48, ndmi: 0.39, lst_c: 32.1, elevation_m: 408 },
  { grid_id: 'G012', latitude: 21.8780, longitude: 79.8310, bounds: [[21.876, 79.828], [21.880, 79.834]], prospectivity: 0.82, confidence: 'High', ndvi: 0.50, ndmi: 0.37, lst_c: 32.2, elevation_m: 416 },
  { grid_id: 'G013', latitude: 21.8780, longitude: 79.8190, bounds: [[21.876, 79.816], [21.880, 79.822]], prospectivity: 0.69, confidence: 'Medium', ndvi: 0.60, ndmi: 0.30, lst_c: 31.2, elevation_m: 406 },

  // Row 3 (Center - Highest mineralization)
  { grid_id: 'G007', latitude: 21.8760, longitude: 79.8180, bounds: [[21.874, 79.815], [21.878, 79.821]], prospectivity: 0.65, confidence: 'Medium', target_id: 'T-002', ndvi: 0.49, ndmi: 0.36, lst_c: 32.7, elevation_m: 415 },
  { grid_id: 'G001', latitude: 21.8740, longitude: 79.8210, bounds: [[21.872, 79.818], [21.876, 79.824]], prospectivity: 0.84, confidence: 'High', target_id: 'T-003', ndvi: 0.62, ndmi: 0.31, lst_c: 31.4, elevation_m: 412 },
  { grid_id: 'G005', latitude: 21.8720, longitude: 79.8250, bounds: [[21.870, 79.822], [21.874, 79.828]], prospectivity: 0.76, confidence: 'High', target_id: 'T-004', ndvi: 0.51, ndmi: 0.37, lst_c: 32.4, elevation_m: 422 },
  { grid_id: 'G014', latitude: 21.8740, longitude: 79.8270, bounds: [[21.872, 79.824], [21.876, 79.830]], prospectivity: 0.81, confidence: 'High', ndvi: 0.53, ndmi: 0.36, lst_c: 32.0, elevation_m: 419 },

  // Row 4 (South)
  { grid_id: 'G004', latitude: 21.8700, longitude: 79.8160, bounds: [[21.868, 79.813], [21.872, 79.819]], prospectivity: 0.38, confidence: 'Low', target_id: 'T-006', ndvi: 0.79, ndmi: 0.18, lst_c: 29.8, elevation_m: 399 },
  { grid_id: 'G008', latitude: 21.8680, longitude: 79.8220, bounds: [[21.866, 79.819], [21.870, 79.825]], prospectivity: 0.22, confidence: 'Low', target_id: 'T-008', ndvi: 0.74, ndmi: 0.20, lst_c: 29.5, elevation_m: 395 },
  { grid_id: 'G015', latitude: 21.8680, longitude: 79.8280, bounds: [[21.866, 79.825], [21.870, 79.831]], prospectivity: 0.28, confidence: 'Low', ndvi: 0.72, ndmi: 0.21, lst_c: 29.7, elevation_m: 398 },
  { grid_id: 'G016', latitude: 21.8700, longitude: 79.8320, bounds: [[21.868, 79.829], [21.872, 79.835]], prospectivity: 0.45, confidence: 'Medium', ndvi: 0.65, ndmi: 0.27, lst_c: 30.5, elevation_m: 402 }
];

// Lineament / Fault coordinates for structural geology layer
export const GEOLOGICAL_FAULTS = [
  {
    name: 'Balaghat Central Strike Shear F-1',
    type: 'Strike-Slip Fault',
    coordinates: [
      [21.8870, 79.8150],
      [21.8810, 79.8220],
      [21.8750, 79.8260],
      [21.8680, 79.8320]
    ] as [number, number][]
  },
  {
    name: 'Mansar Synclinal Hinge Axis L-2',
    type: 'Fold Hinge Lineament',
    coordinates: [
      [21.8840, 79.8340],
      [21.8770, 79.8250],
      [21.8710, 79.8180]
    ] as [number, number][]
  }
];
