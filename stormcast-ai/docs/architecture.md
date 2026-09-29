# STORMCAST AI - System Architecture & Implementation Plan

**Project Name:** STORMCAST AI  
**Subtitle:** AI/ML-Based Thunderstorm & Lightning Nowcasting Platform  
**SIH Problem Statement ID:** 26072  
**Organization:** Ministry of Earth Sciences (MoES) / India Meteorological Department (IMD)  
**Category:** Software | **Theme:** Disaster Management  

---

## 1. Executive Summary & Vision

STORMCAST AI is a state-of-the-art spatio-temporal meteorological command-and-control platform designed for early detection, tracking, and nowcasting (0 to 60 minutes) of severe thunderstorms, lightning strikes, convective initiation, and extreme weather risks across India.

Designed to meet national emergency management standards, STORMCAST AI integrates multi-source atmospheric data including Doppler Weather Radar (DWR) reflectivity, INSAT-3D/3DR satellite imagery, lightning detection sensor networks, and Numerical Weather Prediction (NWP) model parameters.

The platform operates in two distinct modes:
1. **DEMO / SIMULATION MODE**: High-fidelity, physically consistent synthetic weather scenarios (e.g. convective storm initiation and propagation over South/Central/East India) working out-of-the-box without external API keys.
2. **REAL DATA MODE**: Pluggable provider architecture ready for real-time ingestion from IMD radar APIs, MOSDAC satellite feeds, and lightning networks.

---

## 2. High-Level Architecture Diagram

```
                             +-------------------------------------------------------+
                             |              OPERATIONAL DATA SOURCES                 |
                             |  (Demo Providers / IMD Radar / MOSDAC / Lightning API) |
                             +---------------------------+---------------------------+
                                                         |
                                                         v
                             +-------------------------------------------------------+
                             |           DATA INGESTION & ADAPTER LAYER              |
                             |  WeatherDataProvider  |  RadarProvider  |  Satellite  |
                             +---------------------------+---------------------------+
                                                         |
                                                         v
                             +-------------------------------------------------------+
                             |          FEATURE ENGINEERING & PREPROCESSING          |
                             | Reflectivity Gradients | CAPE/CIN | VIL | Wind Shear  |
                             +---------------------------+---------------------------+
                                                         |
                                                         v
                             +-------------------------------------------------------+
                             |                   AI / ML NOWCASTING                  |
                             | BaseNowcastingModel | ThunderstormModel | Lightning   |
                             +---------------------------+---------------------------+
                                                         |
                                         +---------------+---------------+
                                         |                               |
                                         v                               v
                             +-----------------------+       +-----------------------+
                             |    RISK & ALERT       |       |       FASTAPI         |
                             |    RULE ENGINE        |------>|      REST API         |
                             | Threshold & Priority  |       |  & WEBSOCKET BROADCAST|
                             +-----------------------+       +-----------+-----------+
                                                                         |
                                                                         v
                                                             +-----------------------+
                                                             |  REACT + LEAFLET UI   |
                                                             |   COMMAND DASHBOARD   |
                                                             +-----------------------+
```

---

## 3. Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts, React Query (TanStack Query), React Router v6, Leaflet / Canvas Heatmap / Vector rendering.
- **Backend**: Python 3.11+, FastAPI, Pydantic v2, SQLAlchemy 2.0, PostgreSQL + PostGIS (with SQLite / SpatiaLite fallback for local demo), WebSockets for real-time streaming.
- **AI/ML**: PyTorch / Scikit-Learn / NumPy / Pandas, Modular XGBoost & Spatio-temporal Nowcasting interfaces (`BaseNowcastingModel`, `ThunderstormModel`, `LightningModel`, `StormMovementModel`).
- **DevOps**: Docker, Docker Compose, `.env` configuration, health checks, structured JSON logging.

---

## 4. Phase-by-Phase Implementation Plan

| Phase | Description | Deliverables |
|---|---|---|
| **Phase 1** | Project Scaffolding | Monorepo layout (`frontend/`, `backend/`, `ai/`, `database/`, `docker/`, `docs/`, `scripts/`, `tests/`) |
| **Phase 2** | Database & Models | SQLAlchemy models (`users`, `data_sources`, `observations`, `storm_cells`, `predictions`, `alerts`, `models`) |
| **Phase 3** | FastAPI Backend | REST controllers, JWT Auth, CORS, spatial query endpoints, system health APIs |
| **Phase 4** | Provider Adapters & Demo Engine | Clean interface layer (`RadarDataProvider`, `SatelliteDataProvider`, `LightningDataProvider`) + Deterministic storm simulator |
| **Phase 5** | AI Inference Architecture | Feature extraction pipeline, spatio-temporal movement tracker, probability calibration (`Probability != Confidence`) |
| **Phase 6** | Frontend Design System | Dark meteorology theme, custom UI primitives (Card, Badge, Alert, Tab, Timeline, DataGrid, Modal) |
| **Phase 7** | Overview Command Dashboard | Header status, KPI grid, Main GIS map container, forecast timeline, Right Nowcast panel, bottom alerts & tracking |
| **Phase 8** | Interactive GIS Weather Map | Canvas rendering, storm cell polygons, lightning strike markers, radar dBZ overlay, prediction vectors |
| **Phase 9** | Thunderstorm Nowcast Page | Temporal probability trend charts (15m, 30m, 45m, 60m), storm cell detail cards |
| **Phase 10**| Lightning Intelligence | Strike density heatmap, CG/IC strike breakdown, flash rate analytics, historical strike trail |
| **Phase 11**| Radar Network Intelligence | Multi-radar station status (Chennai, Bengaluru, Hyderabad, Machilipatnam), dBZ reflectivity color scale, velocity/rotation view |
| **Phase 12**| Satellite Intelligence | VIS / IR / WV spectrum views, cloud top temperature analysis, convective initiation spotter |
| **Phase 13**| Risk & Alert Engine | Rule engine for automatically raising Severe/Critical alerts, threshold configuration, acknowledge workflow |
| **Phase 14**| Historical Storm Analysis | Query by date/region/severity, storm track playback, frequency distribution charts |
| **Phase 15**| AI Model Management Center | Model metrics (Accuracy, Precision, Recall, F1), pipeline architecture diagram, model swapper |
| **Phase 16**| Authentication & RBAC | JWT auth flow, Roles (ADMIN, METEOROLOGIST, ANALYST, VIEWER) |
| **Phase 17**| WebSocket Live Streaming | Real-time push updates for lightning strikes, storm position changes, and critical warning alerts |
| **Phase 18**| Automated Testing & Quality | Backend pytest suite, frontend component tests, E2E data-to-alert pipeline test |
| **Phase 19**| Dockerization & Deployment | Dockerfile for frontend, backend, AI engine, and docker-compose.yml |
| **Phase 20**| Documentation & Handover | Comprehensive README, API specs, AI docs, user guides |

---

## 5. Spatio-Temporal Prediction Model Output Schema

Every prediction generated by STORMCAST AI adheres to the strict schema below:

```json
{
  "prediction_id": "prd-20260929-001",
  "location": {
    "latitude": 13.0827,
    "longitude": 80.2707,
    "region_name": "Chennai Urban & Coastal Sector"
  },
  "forecast_horizon_minutes": 30,
  "forecast_timestamp": "2026-09-29T22:30:00Z",
  "thunderstorm_probability": 0.87,
  "lightning_probability": 0.81,
  "severe_weather_risk": "SEVERE",
  "storm_movement": {
    "direction_cardinal": "NE",
    "bearing_degrees": 45.0,
    "speed_kmh": 22.5
  },
  "model_confidence": 0.92,
  "is_demo": true,
  "quality_flag": "GOOD",
  "data_freshness_seconds": 45
}
```

---

## 6. Security, Compliance & Ethical AI Standards

- **No False Data Claims**: Demo mode data is strictly tagged with `is_demo: true` and labeled "SIMULATION / DEMO DATA" across the interface.
- **Model Metric Transparency**: Model status indicates "Not evaluated" or "Awaiting validation" if baseline weights have not been trained on official datasets.
- **Role-Based Access Control**:
  - `ADMIN`: System configuration, model swapping, user management.
  - `METEOROLOGIST`: Manual warning issuance, threshold adjustments, data export.
  - `ANALYST`: Historical analysis, model metrics evaluation.
  - `VIEWER`: Read-only access to maps and alerts.
