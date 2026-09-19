// MineDSS High-Precision Raster Spatial Dataset
// Matches the exact geological and geochemical synthesis from MineDSS (app.minedss.com/demo)

export interface RasterCell {
  id: string;
  lat: number;
  lng: number;
  prospectivity: number; // 0.00 - 1.00
  confidence: 'Strong match' | 'Moderate' | 'Low';
  zoneId?: number;
  drivers: {
    alteration: 'supports' | 'against' | 'neutral';
    structure: 'supports' | 'against' | 'neutral';
    radiometrics: 'supports' | 'against' | 'neutral';
    terrain: 'supports' | 'against' | 'neutral';
    geology: string;
  };
}

export interface TargetZone {
  id: number;
  label: string; // "#1", "#2"
  name: string;
  center: [number, number];
  polygon: [number, number][];
  avgProspectivity: number;
  peakProspectivity: number;
  areaKm2: number;
  reliability: 'ok' | 'High' | 'Medium';
  topDrivers: string;
  nearbyAssay: {
    borehole: string;
    distanceM: number;
    gradeMn: number;
    interval: string;
  };
  rockUnit: string;
}

export interface GeologicalFormation {
  name: string;
  code: string;
  color: string;
  polygon: [number, number][];
}

// Bounding coordinates for the AOI (matching MineDSS lease boundary)
export const GRID_CONFIG = {
  baseLat: 21.8620,
  baseLng: 79.8050,
  step: 0.00075, // approx 80m resolution
  rows: 35,
  cols: 45
};

// Regional Geological Formations (displayed outside and around AOI matching MineDSS background)
export const REGIONAL_GEOLOGY: GeologicalFormation[] = [
  {
    name: 'Mansar Formation (Mica Schist, Braunite-Quartzite Reef)',
    code: 'Ms-G',
    color: '#E8B494', // Soft peach/terracotta
    polygon: [
      [21.850, 79.790], [21.870, 79.790], [21.895, 79.820],
      [21.895, 79.855], [21.875, 79.855], [21.850, 79.815]
    ]
  },
  {
    name: 'Sitasaongi Quartzite & Muscovite Schist',
    code: 'St-Q',
    color: '#E7D7C1', // Pale sand/buff
    polygon: [
      [21.870, 79.790], [21.905, 79.790], [21.905, 79.820], [21.885, 79.805]
    ]
  },
  {
    name: 'Tirodi Biotite Gneiss Complex',
    code: 'Tr-Gn',
    color: '#C7D0D8', // Pale slate blue-grey
    polygon: [
      [21.850, 79.770], [21.905, 79.770], [21.905, 79.790], [21.850, 79.790]
    ]
  },
  {
    name: 'Bichua Dolomitic Marble & Calc-Silicate',
    code: 'Bc-M',
    color: '#DFDDD5', // Muted warm grey
    polygon: [
      [21.885, 79.820], [21.905, 79.820], [21.905, 79.855], [21.895, 79.855]
    ]
  },
  {
    name: 'Wainganga Valley Quaternary Alluvium',
    code: 'Q-Al',
    color: '#F0EAE1', // Soft light cream
    polygon: [
      [21.850, 79.815], [21.875, 79.855], [21.850, 79.855]
    ]
  }
];

// Generate dense raster grid with realistic geological deposit bodies matching Image 2
export const generateRasterGrid = (): RasterCell[] => {
  const cells: RasterCell[] = [];
  const { baseLat, baseLng, step, rows, cols } = GRID_CONFIG;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const lat = baseLat + r * step;
      const lng = baseLng + c * step;

      // Anomaly centers modeled after MineDSS Reference (Image 2)
      // 1. South-Central Main Syncline (#1 & #2 lobe)
      const dMain1 = Math.sqrt(Math.pow((lat - 21.8725) * 1.3, 2) + Math.pow(lng - 79.8210, 2));
      const dMain2 = Math.sqrt(Math.pow((lat - 21.8755) * 1.1, 2) + Math.pow(lng - 79.8225, 2));
      const pMain = Math.max(0, 0.95 - Math.min(dMain1, dMain2) * 90);

      // 2. North-West Anomaly (#7)
      const dNW = Math.sqrt(Math.pow(lat - 21.8845, 2) + Math.pow(lng - 79.8115, 2));
      const pNW = Math.max(0, 0.88 - dNW * 125);

      // 3. North-Central Anomaly (#11)
      const dNC = Math.sqrt(Math.pow(lat - 21.8835, 2) + Math.pow(lng - 79.8190, 2));
      const pNC = Math.max(0, 0.89 - dNC * 115);

      // 4. North-East Ridge (#8)
      const dNE = Math.sqrt(Math.pow(lat - 21.8860, 2) + Math.pow(lng - 79.8335, 2));
      const pNE = Math.max(0, 0.91 - dNE * 135);

      // 5. East Target (#10)
      const dE = Math.sqrt(Math.pow(lat - 21.8810, 2) + Math.pow(lng - 79.8310, 2));
      const pE = Math.max(0, 0.87 - dE * 120);

      // 6. South-West Extension
      const dSW = Math.sqrt(Math.pow(lat - 21.8680, 2) + Math.pow(lng - 79.8140, 2));
      const pSW = Math.max(0, 0.80 - dSW * 110);

      // Base background prospectivity (low yellowish bedrock: 0.12 - 0.38)
      let baseVal = 0.22 + Math.sin(r * 0.35 + c * 0.25) * 0.08 + Math.cos(r * 0.18 - c * 0.3) * 0.06;

      // Combined prospectivity
      let p = Math.max(baseVal, pMain, pNW, pNC, pNE, pE, pSW);

      // High-frequency geological micro-texture
      const noise = (Math.sin(r * 3.4 + c * 2.1) * 0.04) + (Math.cos(r * 1.9 - c * 4.2) * 0.03);
      p = Math.max(0.08, Math.min(0.97, p + noise));

      let conf: 'Strong match' | 'Moderate' | 'Low' = 'Low';
      if (p >= 0.70) conf = 'Strong match';
      else if (p >= 0.45) conf = 'Moderate';

      // Associate zones
      let zoneId: number | undefined;
      if (p >= 0.80 && lat >= 21.870 && lat <= 21.874 && lng >= 79.818 && lng <= 79.824) zoneId = 1;
      else if (p >= 0.75 && lat > 21.874 && lat <= 21.879 && lng >= 79.818 && lng <= 79.826) zoneId = 2;
      else if (p >= 0.68 && lat > 21.882 && lng < 79.815) zoneId = 7;
      else if (p >= 0.72 && lat > 21.883 && lng > 79.830) zoneId = 8;
      else if (p >= 0.68 && lat > 21.878 && lat <= 21.884 && lng >= 79.828 && lng <= 79.834) zoneId = 10;
      else if (p >= 0.70 && lat > 21.881 && lat <= 21.886 && lng >= 79.816 && lng <= 79.822) zoneId = 11;

      cells.push({
        id: `C-${r}-${c}`,
        lat: Number(lat.toFixed(5)),
        lng: Number(lng.toFixed(5)),
        prospectivity: Number(p.toFixed(2)),
        confidence: conf,
        zoneId,
        drivers: {
          alteration: p > 0.6 ? 'supports' : p < 0.35 ? 'against' : 'neutral',
          structure: (pMain > 0.4 || pNW > 0.4 || pNE > 0.4) ? 'supports' : 'neutral',
          radiometrics: p > 0.72 ? 'supports' : p < 0.38 ? 'against' : 'neutral',
          terrain: lat > 21.868 ? 'supports' : 'neutral',
          geology: 'metamorphic and sedimentary, undifferentiated'
        }
      });
    }
  }

  return cells;
};

// Ranked Drilling Target Zones matching MineDSS Image 2 exactly
export const TARGET_ZONES: TargetZone[] = [
  {
    id: 1,
    label: '#1',
    name: 'Bharveli South Synclinal Keel',
    center: [21.8720, 79.8215],
    polygon: [
      [21.8700, 79.8185],
      [21.8735, 79.8180],
      [21.8750, 79.8225],
      [21.8735, 79.8250],
      [21.8705, 79.8240],
      [21.8695, 79.8210]
    ],
    avgProspectivity: 0.88,
    peakProspectivity: 0.95,
    areaKm2: 3.41,
    reliability: 'ok',
    topDrivers: 'Alteration minerals · Structural fold hinge · Core assay',
    nearbyAssay: {
      borehole: 'BH002',
      distanceM: 95,
      gradeMn: 41.2,
      interval: '18.0 – 26.5 m'
    },
    rockUnit: 'metamorphic and sedimentary, undifferentiated'
  },
  {
    id: 2,
    label: '#2',
    name: 'Central Stope Footwall Lobe',
    center: [21.8765, 79.8215],
    polygon: [
      [21.8745, 79.8190],
      [21.8780, 79.8185],
      [21.8800, 79.8225],
      [21.8785, 79.8260],
      [21.8755, 79.8255],
      [21.8740, 79.8220]
    ],
    avgProspectivity: 0.84,
    peakProspectivity: 0.94,
    areaKm2: 0.49,
    reliability: 'ok',
    topDrivers: 'Magnetic gradient · Subsurface ground-truth BH017',
    nearbyAssay: {
      borehole: 'BH017',
      distanceM: 140,
      gradeMn: 38.6,
      interval: '18.0 – 32.0 m'
    },
    rockUnit: 'metamorphic and sedimentary, undifferentiated'
  },
  {
    id: 7,
    label: '#7',
    name: 'North-West Fault Offset Anomaly',
    center: [21.8845, 79.8115],
    polygon: [
      [21.8830, 79.8095],
      [21.8860, 79.8095],
      [21.8865, 79.8135],
      [21.8845, 79.8140],
      [21.8830, 79.8120]
    ],
    avgProspectivity: 0.78,
    peakProspectivity: 0.88,
    areaKm2: 0.45,
    reliability: 'ok',
    topDrivers: 'Terrain shape · Structural fault lineament',
    nearbyAssay: {
      borehole: 'BH015',
      distanceM: 280,
      gradeMn: 29.8,
      interval: '14.0 – 21.0 m'
    },
    rockUnit: 'metamorphic and sedimentary, undifferentiated'
  },
  {
    id: 8,
    label: '#8',
    name: 'East Ridge Deep Extension',
    center: [21.8860, 79.8335],
    polygon: [
      [21.8845, 79.8315],
      [21.8875, 79.8315],
      [21.8880, 79.8360],
      [21.8855, 79.8365],
      [21.8845, 79.8340]
    ],
    avgProspectivity: 0.82,
    peakProspectivity: 0.91,
    areaKm2: 0.15,
    reliability: 'ok',
    topDrivers: 'Terrain shape · Magnetics & gravity · Alteration minerals',
    nearbyAssay: {
      borehole: 'BH004',
      distanceM: 190,
      gradeMn: 34.5,
      interval: '22.0 – 30.0 m'
    },
    rockUnit: 'metamorphic and sedimentary, undifferentiated'
  },
  {
    id: 10,
    label: '#10',
    name: 'North-East Hinge Zone',
    center: [21.8810, 79.8310],
    polygon: [
      [21.8795, 79.8290],
      [21.8825, 79.8290],
      [21.8830, 79.8330],
      [21.8810, 79.8335],
      [21.8795, 79.8315]
    ],
    avgProspectivity: 0.76,
    peakProspectivity: 0.87,
    areaKm2: 0.15,
    reliability: 'ok',
    topDrivers: 'Terrain shape · Magnetics & gravity · Alteration minerals',
    nearbyAssay: {
      borehole: 'BH011',
      distanceM: 310,
      gradeMn: 27.2,
      interval: '12.0 – 19.0 m'
    },
    rockUnit: 'metamorphic and sedimentary, undifferentiated'
  },
  {
    id: 11,
    label: '#11',
    name: 'Northern Gondite Anomaly',
    center: [21.8835, 79.8190],
    polygon: [
      [21.8820, 79.8170],
      [21.8855, 79.8170],
      [21.8860, 79.8215],
      [21.8835, 79.8220],
      [21.8820, 79.8195]
    ],
    avgProspectivity: 0.79,
    peakProspectivity: 0.89,
    areaKm2: 0.32,
    reliability: 'ok',
    topDrivers: 'Thermal inertia proxy · Lineament intersection',
    nearbyAssay: {
      borehole: 'BH008',
      distanceM: 220,
      gradeMn: 31.8,
      interval: '16.0 – 24.0 m'
    },
    rockUnit: 'metamorphic and sedimentary, undifferentiated'
  }
];
