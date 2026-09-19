export interface Mine {
  id: string;
  name: string;
  location: string;
  state: string;
  coordinates: [number, number]; // [lat, lng]
  type: 'Underground' | 'Opencast' | 'Mixed';
  productionTargetMonthlyKt: number;
  gradeMnPct: number;
  geologySummary: string;
}

export interface ExplorationAssay {
  mine_id: string;
  borehole_id: string;
  latitude: number;
  longitude: number;
  hole_depth_m: number;
  from_m: number;
  to_m: number;
  lithology: 'Manganese-bearing' | 'Waste' | 'Gondite' | 'Quartzite' | 'Schist' | 'Pegmatite';
  mn_pct: number;
}

export interface GeospatialFeature {
  mine_id: string;
  grid_id: string;
  latitude: number;
  longitude: number;
  ndvi: number;
  ndmi: number;
  red_edge_index: number;
  elevation_m: number;
  slope_deg: number;
  lst_c: number;
  soil_moisture: number;
  known_mineralized_area: number;
}

export interface ProductionOperation {
  mine_id: string;
  date: string;
  planned_tonnes: number;
  actual_tonnes: number;
  avg_mn_pct: number;
  equipment_availability_pct: number;
  downtime_hours: number;
  blasting_delay_hours: number;
  blast_delay_events: number;
  rainfall_mm: number;
  shortfall_flag: number;
}

export interface EquipmentRecord {
  mine_id: string;
  equipment_id: string;
  equipment_type: 'Excavator' | 'Haul Truck' | 'Drill Rig' | 'Wheel Loader' | 'Crusher';
  date: string;
  scheduled_hours: number;
  downtime_hours: number;
  operating_hours: number;
  failure_events: number;
  maintenance_reason: string;
  status: 'Operational' | 'Degraded' | 'Critical Downtime';
}

export interface EvidenceDriver {
  name: string;
  score: number; // 0 to 100
  direction: '+' | '-';
  detail: string;
}

export interface ProspectivityTarget {
  grid_id: string;
  target_id: string;
  name: string;
  latitude: number;
  longitude: number;
  prospectivity: number; // 0.00 to 1.00
  confidence: 'High' | 'Medium' | 'Low';
  area_km2: number;
  primary_evidence: string;
  observed_or_assay_mn_pct?: number;
  nearby_borehole: {
    borehole_id: string;
    distance_m: number;
    depth_interval: string;
    mn_pct: number;
  };
  evidence_drivers: EvidenceDriver[];
  model_version: string;
  updated_at: string;
}

export interface ProductionForecastPoint {
  date: string;
  label: string;
  planned_tonnes: number;
  actual_tonnes?: number;
  forecast_tonnes?: number;
  p10?: number;
  p50?: number;
  p90?: number;
  isHistorical: boolean;
  shortfall: boolean;
}

export interface CorrectiveAction {
  id: string;
  title: string;
  category: 'Equipment' | 'Blasting' | 'Weather' | 'Scheduling' | 'Ore Access';
  urgency: 'Immediate' | 'High' | 'Medium';
  recommended_action: string;
  constraint_detected: string;
  root_cause: string;
  estimated_impact_tonnes: string;
  impact_val_kt: number;
  status: 'Pending' | 'Accepted' | 'Modified' | 'Rejected';
  model_version: string;
  created_at: string;
  decision_by?: string;
  decision_time?: string;
  modification_notes?: string;
}

export interface SimulationParameters {
  rainfall_mm: number;
  downtime_hours_delta: number;
  blasting_delay_hours: number;
  fleet_availability_pct: number;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action_id: string;
  action_title: string;
  decision: 'Accepted' | 'Modified' | 'Rejected';
  notes?: string;
  model_version: string;
  impact_recorded: string;
}
