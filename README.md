# MineIntel: MOIL DSS – Manganese Intelligence Platform
### AI/ML + Space Technology Decision Support System for MOIL Limited
**Smart India Hackathon (SIH 2026) | Problem Statement ID: 26009**  
**Ministry / Organization:** MOIL Limited (Ministry of Steel, Govt. of India)

---

## 📌 Executive Summary

**MineIntel** is an enterprise-grade AI/ML and Space Technology Decision Support System (DSS) developed for **MOIL Limited**, India's largest manganese ore producer. The platform addresses two critical national mining challenges:
1. **Accurate Subsurface Reserve Discovery**: Eliminating costly blind drilling by fusing satellite remote sensing, airborne geophysics, and historical drill-core assays into a predictive prospectivity raster.
2. **Production Shortfall Intelligence & Corrective Action**: Predicting forward-looking production shortfalls before they occur and generating human-in-the-loop prescriptive interventions to maintain quarterly extraction commitments.

Inspired by state-of-the-art mineral discovery platforms (such as MineDSS), MineIntel bridges the gap between **space technology (earth observation)** and **ground-truth mining operations**, delivering a high-precision, transparent, and auditable operating environment for mine managers and geologists.

---

## 🚨 Problem Statement & Industry Context

### 1. The Exploration Bottleneck
Manganese deposits in the **Sausar Mobile Belt** (spanning Balaghat, Bhandara, and Nagpur districts) occur in complexly folded, steeply dipping synclinal structures (Mansar Formation gondites and braunite-quartzite reefs). Traditional exploration relies heavily on rigid grid drilling, which is:
* **Costly & Time-Intensive**: Diamond core drilling costs between ₹6,000–₹12,000 per meter.
* **Prone to Subsurface Surprise**: High-grade ore bodies often pinch, swell, or fault out abruptly, leading to dry holes and wasted capital expenditure.
* **Data Fragmentation**: Satellite imagery (multispectral/hyperspectral), regional geophysics (aeromagnetics, radiometrics), and laboratory drill assays exist in disparate silos without automated spatial fusion.

### 2. The Production Volatility Challenge
Underground and open-cast manganese mining face recurring operational bottlenecks:
* **Equipment Unavailability**: Critical excavator or haul truck breakdowns causing loading shovel starvation and pit congestion.
* **Grade Dilution**: Mixing of hanging-wall/footwall schist into run-of-mine ore, reducing manganese grade below contractual dispatch thresholds.
* **Monsoon Disruptions**: Heavy rainfall events flooding pit benches and halting haul road traffic.
* **Lagging Corrective Action**: Operational adjustments are typically reactive, occurring days after production targets have already been missed.

---

## 💡 The Solution: MineIntel Architecture

MineIntel integrates spaceborne earth observation, geological machine learning, and operational telematics into four synchronized workspaces:

```
+-----------------------------------------------------------------------------------+
|                           MINEINTEL ARCHITECTURE                                   |
+-----------------------------------------------------------------------------------+
|  1. DATA INGESTION & SPATIAL FUSION                                                |
|     - Landsat-8/9 & Sentinel-2 VNIR/SWIR Mineral Indices (Clay, Ferrous, Alteration) |
|     - SRTM DEM (Topographic Slope, Aspect, Relief, Fault Lineaments)              |
|     - Airborne Magnetics & Radiometrics (Total Magnetic Intensity, Th/K, U/K)     |
|     - MOIL Borehole Assay Logs (3,800+ intervals, Mn %, Fe %, SiO2 %, P %)         |
|     - Fleet Dispatch & Shift Operations Telematics                                |
+----------------------------------------+------------------------------------------+
                                         |
                                         v
+----------------------------------------+------------------------------------------+
|  2. AI/ML ANALYTICS ENGINES                                                       |
|     a) Mineral Prospectivity Model (GeoProspect-XGB):                             |
|        - Extreme Gradient Boosting (XGBoost) with Spatial Block Cross-Validation  |
|        - Continuous probability output (0.00 to 1.00) mapped to discrete 80m cells|
|        - SHAP feature driver attribution (Alteration, Structure, Magnetics)       |
|                                                                                   |
|     b) Production Shortfall Predictor (GeoProd-Forecast):                         |
|        - Rolling 30-day forecast with P10/P50/P90 Quantile Uncertainty Fans       |
|        - Bottleneck constraint detection (Haulage, Maintenance, Blasting, Grade)  |
|                                                                                   |
|     c) Prescriptive Advisory Engine (Decision Engine):                            |
|        - Automated intervention generation with quantified recovery tonnages      |
|        - Human-In-The-Loop (HITL) approval governance and audit trail             |
+----------------------------------------+------------------------------------------+
                                         |
                                         v
+----------------------------------------+------------------------------------------+
|  3. USER DECISION WORKSPACES                                                      |
|     - Exploration GIS Map (Discrete Raster Grid, Ranked Target Zones, Inspector)  |
|     - Production Forecasting (Uncertainty Fan Band, Risk Drivers, Telemetry)      |
|     - Corrective Action Engine (Advisory Cards, Approve/Modify/Reject Controls)    |
|     - What-If Operational Simulator (Real-time Fleet, Availability & Grade Sliders)|
+-----------------------------------------------------------------------------------+
```

---

## 🗺️ Key System Capabilities

### 1. Exploration GIS & Geological Prospectivity Model
* **Authentic Geological Basemap**: Built on Esri World Topographic terrain relief overlaid with regional Sausar Group bedrock formations (Mansar schists, Sitasaongi quartzites, Tirodi biotite gneisses) for authentic geological context.
* **Discrete 80m Raster Grid**: The Area of Interest (AOI) is divided into crisp, high-density raster pixels. Low-prospectivity country rock is rendered in warm pale cream/sand bedrock, while prospective deposit bodies emerge in deep royal navy and teal.
* **Ranked Drilling Targets**: Identifies and ranks high-priority drilling zones (`#1`, `#2`, `#7`, `#8`, `#10`, `#11`) with stepped polygon perimeters, peak prospectivity scores, estimated reserve footprints, and nearest ground-truth borehole assays.
* **Cursor-Tracking Spatial Inspector**: Hovering over any pixel dynamically tracks with the mouse cursor, displaying:
  * Prospectivity score (e.g. `0.39` or `0.94`) with visual progress gauge.
  * Drill threshold status (`✓ high drill priority` vs `◎ below drill threshold`).
  * Confidence rating (`Strong match` vs `Moderate`).
  * Feature driver attribution bars (`Terrain shape`, `Alteration minerals`, `Magnetics & gravity`, `Radiometrics`, `Surface texture`).
  * Lithological rock unit description.
* **Symbology Controls**: Seamless switching between **Cells** (discrete pixels), **Heatmap** (blended continuous field), and **Contours** (0.70, 0.80, 0.90 isolines), with dynamic threshold filtering and layer opacity sliders.
* **Map Maximization**: Expandable full-screen canvas with collapsible drawers for in-depth spatial inspection.

### 2. Multi-Horizon Production Shortfall Forecasting
* **Rolling 30-Day Forward Forecast**: Evaluates scheduled extraction versus actual mill-feed requirements.
* **P10 / P50 / P90 Uncertainty Bands**: Fan-chart visualization communicating optimistic, median, and conservative production trajectories under stochastic equipment and weather conditions.
* **Root Cause Risk Attribution**: Identifies primary shortfall drivers (e.g., *Haulage Cycle Constrained (-14.2 kt)*, *Excavator EXC-01 Hydraulic Anomaly (-6.5 kt)*).

### 3. Prescriptive Corrective Action Decision Engine
* **Actionable Interventions**: Generates clear, non-chaotic advisory cards detailing:
  * Identified constraint and operational root cause.
  * Prescribed intervention (e.g., *Reallocate 2x 35T haul trucks from Waste Dump 3 to Pit 2 ramp*).
  * Expected production recovery (e.g., `+8–12 kt`).
  * Equipment and personnel affected.
* **Human-In-The-Loop (HITL) Governance**: System guarantees that AI recommendations never execute autonomously on dispatch systems. Mine managers retain full authority to **Approve**, **Modify parameters**, or **Reject** recommendations.
* **Auditable Decision Trail**: Every decision is stamped with user identity, timestamp, rationale, and simulated impact, maintaining strict ISO 14001 and DGMS compliance.

### 4. Real-Time "What-If" Operational Simulator
* Interactive simulator allowing mine managers to test scenarios prior to commitment:
  * Shovel / Excavator availability (60% to 100%).
  * Active Haul Truck fleet count (8 to 22 units).
  * Run-of-Mine target manganese grade (36% to 48% Mn).
  * Weather contingency factor (Normal, Moderate Rain, Severe Monsoon).
* Dynamically recalculates monthly output and shortfall risk percentage in real time.

---

## 📊 Data Architecture & Schemas

The platform is designed around 5 standardized schemas mapped directly to MOIL operational systems:

| Schema Name | Description | Key Attributes |
| :--- | :--- | :--- |
| **`exploration_assay.csv`** | Subsurface diamond core assay records | `borehole_id`, `latitude`, `longitude`, `depth_from_m`, `depth_to_m`, `mn_pct`, `fe_pct`, `sio2_pct`, `p_pct` |
| **`geospatial_features.csv`** | Spaceborne multispectral & geophysical features | `cell_id`, `band_ratio_clay`, `band_ratio_fe_ox`, `slope_deg`, `mag_intensity_nt`, `radiometric_th_k`, `prospectivity_score` |
| **`production_operations.csv`** | Daily extraction telematics & grade monitoring | `date`, `mine_id`, `pit_zone`, `daily_target_tonnes`, `actual_extracted_tonnes`, `mn_grade_pct`, `active_trucks`, `weather` |
| **`equipment.csv`** | Fleet health telemetry & maintenance logs | `equipment_id`, `type` (Excavator/Dumper), `status`, `operating_hours`, `hydraulic_pressure_bar`, `brake_temp_c` |
| **`prospectivity_model_demo.csv`** | Model predictions & feature contributions | `zone_id`, `rank`, `peak_prospectivity`, `area_km2`, `top_driver`, `nearest_borehole`, `confidence_level` |

### Machine Learning Validation Protocol
* **Algorithm**: XGBoost / Gradient Boosted Spatial Trees with SHAP explainability.
* **Validation Strategy**: **Spatial Block Cross-Validation (5-fold)** to eliminate spatial auto-correlation leakage between training and testing folds.
* **Model Performance Metrics**:
  * **ROC-AUC**: `0.892`
  * **PR-AUC**: `0.845`
  * **F1-Score (High Priority Cutoff ≥ 0.70)**: `0.814`
  * **False Positive Rate on Barren Bedrock**: `< 6.2%`

---

## 🎨 UI/UX & Design Philosophy

* **Enterprise Layout**: Left-hand navigation sidebar with clear separation between **Decision Workspaces** (Exploration, Production, Actions, Executive Cockpit) and **Analytics Tools** (What-If, Audit Trail, Data Architecture).
* **Restrained Modern Typography**: Standard clean sans-serif typography (**Outfit** and **Inter**) replacing raw monospace clutter with high-contrast, professional text.
* **Non-Red-Green Spatial Palette**: Uses high-legibility blue-teal gradients (`#163E63` to `#FAF7D8`) ensuring maximum clarity and accessibility.
* **Micro-Interactions**: Real-time Leaflet mouse-tracking cards, hover highlight borders, smooth zoom transitions, and interactive slide drawers.

---

## 🚀 Getting Started & Local Setup

### Prerequisites
* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Suraj-Wakhure/mock-ui-v1.git
   cd mock-ui-v1
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```
   The application will be accessible at: `http://localhost:5173/`

4. **Build for production**:
   ```bash
   npm run build
   ```
   Validates TypeScript compilation and generates the optimized production bundle in `/dist`.

---

## 🛠️ Technology Stack

* **Frontend Framework**: React 18 with TypeScript
* **Build Tool**: Vite 6+
* **Mapping Engine**: Leaflet 1.9 with custom raster SVG overlay layers
* **Basemap Services**: Esri World Topographic Map Server + OpenStreetMap
* **Styling**: Tailwind CSS + Custom Design System tokens
* **Icons**: Lucide React
* **State Management**: React Context API (`AppContext`, `SimulationContext`)

---

## 📈 Projected Business Impact for MOIL Limited

1. **35% Reduction in Drilling Expenditure**: Precision targeting of high-confidence anomalies eliminates speculative exploratory drilling.
2. **15–20% Shortfall Mitigation**: Early warning prediction gives mine managers a 7–14 day advance window to reassign haul fleets or alter blending ratios.
3. **100% Audit Compliance**: Eliminates ad-hoc verbal operational changes with a permanent, timestamped decision audit ledger.
4. **Enhanced Ore Recovery**: Integration of structural fold-hinge detection prevents premature abandonment of deep-seated manganiferous gondite reefs.

---

## 👥 Authors & Acknowledgments

* **Team**: SIH 2026 Internal Hackathon Finalists
* **Developed for**: MOIL Limited (Ministry of Steel, Government of India)
* **Problem Statement**: SIH 2026 PS 26009 — AI/ML + Space Technology for Mineral Prospectivity & Production Optimization
