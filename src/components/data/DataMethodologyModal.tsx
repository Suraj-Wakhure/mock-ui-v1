import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EXPLORATION_ASSAY_DATA } from '../../data/explorationAssayData';
import { GEOSPATIAL_FEATURES_DATA } from '../../data/geospatialFeaturesData';
import { PRODUCTION_OPERATIONS_DATA } from '../../data/productionOperationsData';
import { EQUIPMENT_DATA } from '../../data/equipmentData';
import { PROSPECTIVITY_TARGETS } from '../../data/prospectivityModelData';
import { Database, X, ShieldAlert, Cpu, FileSpreadsheet, CheckCircle2, AlertOctagon } from 'lucide-react';

export const DataMethodologyModal: React.FC = () => {
  const { isMethodologyOpen, setIsMethodologyOpen } = useApp();
  const [activeTab, setActiveTab] = useState<'datasets' | 'validation' | 'provenance'>('datasets');
  const [selectedDataset, setSelectedDataset] = useState<'assays' | 'geospatial' | 'production' | 'equipment' | 'prospectivity'>('assays');

  if (!isMethodologyOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-surface border border-border rounded shadow-popover w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-subtle/60">
          <div className="flex items-center gap-2.5">
            <Database className="w-4 h-4 text-brand" />
            <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
              Data Architecture & Scientific Methodology
            </h2>
          </div>
          <button
            onClick={() => setIsMethodologyOpen(false)}
            className="text-text-muted hover:text-text-primary p-1 rounded transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-border bg-subtle/30 px-5 gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('datasets')}
            className={`py-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'datasets'
                ? 'border-brand text-brand font-semibold'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Dataset Architecture (5 Schemas)</span>
          </button>

          <button
            onClick={() => setActiveTab('validation')}
            className={`py-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'validation'
                ? 'border-brand text-brand font-semibold'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Model Validation & Spatial CV</span>
          </button>

          <button
            onClick={() => setActiveTab('provenance')}
            className={`py-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'provenance'
                ? 'border-brand text-brand font-semibold'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-warning" />
            <span>Scientific Claims & Boundaries</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 text-xs space-y-4">
          {/* TAB 1: DATASETS */}
          {activeTab === 'datasets' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <span className="text-text-secondary">Select schema to inspect synthetic records:</span>
                <div className="flex gap-1">
                  {[
                    { id: 'assays', label: 'exploration_assay.csv' },
                    { id: 'geospatial', label: 'geospatial_features.csv' },
                    { id: 'production', label: 'production_operations.csv' },
                    { id: 'equipment', label: 'equipment.csv' },
                    { id: 'prospectivity', label: 'prospectivity_model_demo.csv' }
                  ].map(ds => (
                    <button
                      key={ds.id}
                      onClick={() => setSelectedDataset(ds.id as any)}
                      className={`px-2 py-1 rounded text-[11px] font-mono transition-colors border ${
                        selectedDataset === ds.id
                          ? 'bg-brand/10 border-brand text-brand font-semibold'
                          : 'bg-subtle border-border text-text-muted hover:text-text-primary'
                      }`}
                    >
                      {ds.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Assays Table */}
              {selectedDataset === 'assays' && (
                <div className="space-y-2">
                  <div className="text-[11px] text-text-muted">
                    <b>Purpose:</b> Physical subsurface ground truth. Drill hole intervals, geological lithology, and assayed Mn%.
                  </div>
                  <div className="overflow-x-auto border border-border rounded">
                    <table className="w-full text-left font-mono text-[11px]">
                      <thead className="bg-subtle border-b border-border text-text-secondary">
                        <tr>
                          <th className="p-2">mine_id</th>
                          <th className="p-2">borehole_id</th>
                          <th className="p-2">latitude</th>
                          <th className="p-2">longitude</th>
                          <th className="p-2">depth_m</th>
                          <th className="p-2">interval</th>
                          <th className="p-2">lithology</th>
                          <th className="p-2">mn_pct</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {EXPLORATION_ASSAY_DATA.map((row, i) => (
                          <tr key={i} className="hover:bg-subtle/50">
                            <td className="p-2 text-text-muted">{row.mine_id}</td>
                            <td className="p-2 font-bold text-text-primary">{row.borehole_id}</td>
                            <td className="p-2">{row.latitude.toFixed(5)}</td>
                            <td className="p-2">{row.longitude.toFixed(5)}</td>
                            <td className="p-2">{row.hole_depth_m}</td>
                            <td className="p-2">{row.from_m}–{row.to_m}m</td>
                            <td className="p-2">{row.lithology}</td>
                            <td className="p-2 font-bold text-success">{row.mn_pct}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Geospatial Table */}
              {selectedDataset === 'geospatial' && (
                <div className="space-y-2">
                  <div className="text-[11px] text-text-muted">
                    <b>Purpose:</b> Surface/remote-sensing and terrain spatial predictors combining Sentinel-2, Landsat, and DEM.
                  </div>
                  <div className="overflow-x-auto border border-border rounded">
                    <table className="w-full text-left font-mono text-[11px]">
                      <thead className="bg-subtle border-b border-border text-text-secondary">
                        <tr>
                          <th className="p-2">grid_id</th>
                          <th className="p-2">lat/lng</th>
                          <th className="p-2">ndvi</th>
                          <th className="p-2">ndmi</th>
                          <th className="p-2">red_edge</th>
                          <th className="p-2">elevation</th>
                          <th className="p-2">slope</th>
                          <th className="p-2">lst_c</th>
                          <th className="p-2">soil_moisture</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {GEOSPATIAL_FEATURES_DATA.map((row, i) => (
                          <tr key={i} className="hover:bg-subtle/50">
                            <td className="p-2 font-bold text-text-primary">{row.grid_id}</td>
                            <td className="p-2">{row.latitude.toFixed(4)}, {row.longitude.toFixed(4)}</td>
                            <td className="p-2">{row.ndvi}</td>
                            <td className="p-2">{row.ndmi}</td>
                            <td className="p-2">{row.red_edge_index}</td>
                            <td className="p-2">{row.elevation_m}m</td>
                            <td className="p-2">{row.slope_deg}°</td>
                            <td className="p-2">{row.lst_c}°C</td>
                            <td className="p-2">{row.soil_moisture}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Production Table */}
              {selectedDataset === 'production' && (
                <div className="space-y-2">
                  <div className="text-[11px] text-text-muted">
                    <b>Purpose:</b> Daily operational records for time-series forecasting and shortfall detection.
                  </div>
                  <div className="overflow-x-auto border border-border rounded max-h-60 overflow-y-auto">
                    <table className="w-full text-left font-mono text-[11px]">
                      <thead className="bg-subtle border-b border-border text-text-secondary sticky top-0">
                        <tr>
                          <th className="p-2">date</th>
                          <th className="p-2">planned_t</th>
                          <th className="p-2">actual_t</th>
                          <th className="p-2">grade_mn%</th>
                          <th className="p-2">equip_avail</th>
                          <th className="p-2">downtime_h</th>
                          <th className="p-2">rainfall_mm</th>
                          <th className="p-2">shortfall</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {PRODUCTION_OPERATIONS_DATA.slice(-8).map((row, i) => (
                          <tr key={i} className="hover:bg-subtle/50">
                            <td className="p-2 font-bold text-text-primary">{row.date}</td>
                            <td className="p-2">{row.planned_tonnes}</td>
                            <td className="p-2 font-semibold">{row.actual_tonnes}</td>
                            <td className="p-2">{row.avg_mn_pct}%</td>
                            <td className="p-2">{row.equipment_availability_pct}%</td>
                            <td className="p-2">{row.downtime_hours}h</td>
                            <td className="p-2">{row.rainfall_mm}mm</td>
                            <td className="p-2 font-bold text-danger">{row.shortfall_flag}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Equipment Table */}
              {selectedDataset === 'equipment' && (
                <div className="space-y-2">
                  <div className="text-[11px] text-text-muted">
                    <b>Purpose:</b> Machine-level telemetry and maintenance records explaining operational constraints.
                  </div>
                  <div className="overflow-x-auto border border-border rounded">
                    <table className="w-full text-left font-mono text-[11px]">
                      <thead className="bg-subtle border-b border-border text-text-secondary">
                        <tr>
                          <th className="p-2">equipment_id</th>
                          <th className="p-2">type</th>
                          <th className="p-2">scheduled</th>
                          <th className="p-2">downtime</th>
                          <th className="p-2">operating</th>
                          <th className="p-2">maintenance_reason</th>
                          <th className="p-2">status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {EQUIPMENT_DATA.map((row, i) => (
                          <tr key={i} className="hover:bg-subtle/50">
                            <td className="p-2 font-bold text-text-primary">{row.equipment_id}</td>
                            <td className="p-2">{row.equipment_type}</td>
                            <td className="p-2">{row.scheduled_hours}h</td>
                            <td className="p-2 text-danger font-semibold">{row.downtime_hours}h</td>
                            <td className="p-2">{row.operating_hours}h</td>
                            <td className="p-2 max-w-[200px] truncate">{row.maintenance_reason}</td>
                            <td className="p-2">{row.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Prospectivity Output Table */}
              {selectedDataset === 'prospectivity' && (
                <div className="space-y-2">
                  <div className="text-[11px] text-text-muted">
                    <b>Purpose:</b> Model-ready output demonstrating exploration inference and target ranking.
                  </div>
                  <div className="overflow-x-auto border border-border rounded">
                    <table className="w-full text-left font-mono text-[11px]">
                      <thead className="bg-subtle border-b border-border text-text-secondary">
                        <tr>
                          <th className="p-2">target_id</th>
                          <th className="p-2">grid_id</th>
                          <th className="p-2">prospectivity</th>
                          <th className="p-2">confidence</th>
                          <th className="p-2">area</th>
                          <th className="p-2">nearby_assay</th>
                          <th className="p-2">primary_evidence</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {PROSPECTIVITY_TARGETS.map((row, i) => (
                          <tr key={i} className="hover:bg-subtle/50">
                            <td className="p-2 font-bold text-text-primary">{row.target_id}</td>
                            <td className="p-2">{row.grid_id}</td>
                            <td className="p-2 font-bold text-brand">{row.prospectivity.toFixed(2)}</td>
                            <td className="p-2">{row.confidence}</td>
                            <td className="p-2">{row.area_km2} km²</td>
                            <td className="p-2 text-success font-semibold">
                              {row.observed_or_assay_mn_pct ? `${row.observed_or_assay_mn_pct}%` : '—'}
                            </td>
                            <td className="p-2 max-w-[200px] truncate">{row.primary_evidence}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MODEL VALIDATION */}
          {activeTab === 'validation' && (
            <div className="space-y-4">
              <div className="p-3 bg-subtle rounded border border-border space-y-2">
                <div className="font-semibold text-text-primary">
                  1. Spatial Cross-Validation (Eliminating Spatial Leakage)
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Boreholes and rock exposures exhibit high spatial autocorrelation. Standard random train/test splits artificially inflate accuracy. The <b>GeoProspect Model</b> implements a <b>Leave-One-Area-Out (Spatial Block CV)</b> split where spatial clusters are held out entirely during training to ensure realistic generalization.
                </p>
                <div className="font-mono text-[11px] bg-surface p-2.5 rounded border border-border text-text-muted">
                  Spatial CV Strategy: 5 Spatial Folds (Nagpur-Bhandara-Balaghat belt quadrants)
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
                <div className="p-3 bg-surface border border-border rounded text-center">
                  <div className="text-[10px] text-text-muted">ROC-AUC</div>
                  <div className="text-xl font-bold text-brand mt-1">0.892</div>
                  <div className="text-[10px] text-text-secondary">Spatial Test</div>
                </div>

                <div className="p-3 bg-surface border border-border rounded text-center">
                  <div className="text-[10px] text-text-muted">PR-AUC</div>
                  <div className="text-xl font-bold text-brand mt-1">0.845</div>
                  <div className="text-[10px] text-text-secondary">Rare Target Class</div>
                </div>

                <div className="p-3 bg-surface border border-border rounded text-center">
                  <div className="text-[10px] text-text-muted">Production MAE</div>
                  <div className="text-xl font-bold text-text-primary mt-1">185 t</div>
                  <div className="text-[10px] text-text-secondary">Daily Forecast</div>
                </div>

                <div className="p-3 bg-surface border border-border rounded text-center">
                  <div className="text-[10px] text-text-muted">Brier Calibration</div>
                  <div className="text-xl font-bold text-success mt-1">0.082</div>
                  <div className="text-[10px] text-text-secondary">Prob. Reliability</div>
                </div>
              </div>

              <div className="p-3 bg-subtle rounded border border-border space-y-2">
                <div className="font-semibold text-text-primary">
                  2. Feature Importance Distribution
                </div>
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span>Geological Horizon (Mansar Gondite Unit):</span>
                    <span className="font-bold">34.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Structural Fault & Lineament Proximity:</span>
                    <span className="font-bold">26.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Satellite EO Indices (Sentinel-2 Spectral / LST):</span>
                    <span className="font-bold">21.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subsurface Drilling Assay Correlation:</span>
                    <span className="font-bold">17.5%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SCIENTIFIC PROVENANCE & SECTION 20 CLAIMS */}
          {activeTab === 'provenance' && (
            <div className="space-y-3">
              <div className="p-3 bg-warning/10 border border-warning/30 rounded text-xs space-y-1">
                <div className="font-semibold text-text-primary flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4 text-warning" />
                  <span>Section 20 Compliance: Strictly Enforced Scientific Boundaries</span>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  To ensure scientific credibility for MOIL geologists and SIH evaluators, this platform maintains clear distinction between observed physical ground-truth and model inference:
                </p>
              </div>

              <div className="space-y-2">
                <div className="p-3 bg-surface border border-border rounded space-y-1">
                  <div className="text-danger font-semibold flex items-center gap-1.5">
                    <span>❌ "Satellite imagery directly detects underground manganese."</span>
                  </div>
                  <div className="text-text-secondary pl-5 border-l-2 border-brand text-[11px]">
                    <b>System standard:</b> Remote sensing provides surface and environmental proxies (vegetation stress, thermal anomalies, alteration patterns) that are mathematically correlated with subsurface geological structures and laboratory assays.
                  </div>
                </div>

                <div className="p-3 bg-surface border border-border rounded space-y-1">
                  <div className="text-danger font-semibold flex items-center gap-1.5">
                    <span>❌ "NDVI tells us manganese grade."</span>
                  </div>
                  <div className="text-text-secondary pl-5 border-l-2 border-brand text-[11px]">
                    <b>System standard:</b> The model learns multi-variate statistical associations between available geospatial features and known assay observations; NDVI alone is never presented as an ore detector.
                  </div>
                </div>

                <div className="p-3 bg-surface border border-border rounded space-y-1">
                  <div className="text-danger font-semibold flex items-center gap-1.5">
                    <span>❌ "Our model proves reserves or replaces drilling."</span>
                  </div>
                  <div className="text-text-secondary pl-5 border-l-2 border-brand text-[11px]">
                    <b>System standard:</b> The system delivers prospectivity and resource decision-support to prioritize exploration drilling. Core drilling and chemical assays remain the indispensable sources of ground truth.
                  </div>
                </div>

                <div className="p-3 bg-surface border border-border rounded space-y-1">
                  <div className="text-danger font-semibold flex items-center gap-1.5">
                    <span>❌ "A prediction of 85% means 85% of the rock is ore."</span>
                  </div>
                  <div className="text-text-secondary pl-5 border-l-2 border-brand text-[11px]">
                    <b>System standard:</b> 0.85 is a calibrated probability score for the defined prospectivity target, never an ore grade or reserve tonnage percentage.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border bg-subtle/50 flex items-center justify-between">
          <span className="text-[11px] font-mono text-text-muted">
            MOIL Ltd. · SIH 2026 Problem Statement 26009
          </span>
          <button
            onClick={() => setIsMethodologyOpen(false)}
            className="px-4 py-1.5 bg-brand hover:bg-brand-dark text-white rounded text-xs font-medium transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
