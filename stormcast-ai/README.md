# STORMCAST AI 🌩️⚡
### AI/ML-Based Thunderstorm & Lightning Nowcasting Platform

**Smart India Hackathon (SIH 2026) Problem Statement ID:** 26072  
**Organization:** Ministry of Earth Sciences (MoES) / India Meteorological Department (IMD)  
**Category:** Software | **Theme:** Disaster Management  

---

## 1. Executive Summary

**STORMCAST AI** is a professional, high-performance spatio-temporal meteorological command-and-control nowcasting platform built for national early-warning disaster monitoring. It ingests multi-source observational data—Doppler Weather Radar (DWR) reflectivity, INSAT-3D/3DR satellite imagery, ground lightning detection networks, and Numerical Weather Prediction (NWP) model outputs—to predict:

1. **Thunderstorm Probability** (0–60 minute horizon)
2. **Lightning Strike Probability** (Cloud-to-Ground & Intra-Cloud)
3. **Severe Weather Risk Categorization** (Low, Moderate, High, Severe, Critical)
4. **Storm Centroid Steering Vectors** (Cardinal Direction & Speed in km/h)
5. **Multi-Horizon Forecast Curves** (15m, 30m, 45m, 60m progression)
6. **Automated Emergency Warning Generation** (Rule-based warning engine)
7. **Historical Storm Climatology & Track Analysis**

---

## 2. Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Recharts, React Query (TanStack Query), React Router v6, Leaflet (interactive vector overlays, dBZ rings, lightning markers, storm centroids).
- **Backend**: Python 3.11+, FastAPI, Pydantic v2, SQLAlchemy 2.0, PostgreSQL + PostGIS (with SQLite fallback for local demo), WebSockets for live push streaming.
- **AI/ML**: PyTorch, Scikit-Learn, NumPy, Pandas, Modular `BaseNowcastingModel` swappable architecture (`ThunderstormNowcast-ConvXGB`, `LightningFlash-SpatioTemporal`, `StormTracker-VectorFlow`).
- **DevOps**: Docker, Docker Compose, `.env` config, structured JSON logging, health checks.

---

## 3. Project Directory Structure

```
stormcast-ai/
├── frontend/             # Vite + React + TypeScript Dark Command Center UI
│   ├── src/
│   │   ├── api/          # API Client & Fallback Provider Layer
│   │   ├── components/   # Header, Sidebar, KpiCard, RiskBadge, NotificationDrawer
│   │   ├── map/          # WeatherMap, MapTimeline, MapLegend, MapControls
│   │   ├── pages/        # 12 Main Operational Pages
│   │   ├── types/        # TypeScript Interfaces & Enums
│   │   ├── App.tsx       # Root App Layout & Router
│   │   └── main.tsx      # Entry point
│   ├── package.json
│   └── vite.config.ts
├── backend/              # FastAPI Python Server
│   ├── app/
│   │   ├── api/          # REST & Auth Controllers
│   │   ├── core/         # Config, Security (JWT/SHA-256), Logging
│   │   ├── database/     # SQLAlchemy Session & Base
│   │   ├── models/       # ORM Entities (Users, Cells, Strikes, Alerts)
│   │   ├── providers/    # Demo & Real Provider Adapters
│   │   ├── schemas/      # Pydantic Request/Response Models
│   │   ├── services/     # Alert Engine & Prediction Engine
│   │   ├── websocket/    # Connection Manager for live broadcasts
│   │   ├── db_init.py    # Database Seed Script
│   │   └── main.py       # FastAPI Main Application
│   └── requirements.txt
├── ai/                   # AI/ML Pipeline
│   ├── models/           # BaseNowcastingModel, ConvXGB, VectorFlow
│   └── inference/        # NowcastPredictorEngine
├── docker/               # Dockerfiles for frontend and backend
├── docs/                 # Documentation (Architecture, API, AI Model, Demo Script)
├── tests/                # Automated Unittest Suite
├── docker-compose.yml    # Full-Stack Containerization Orchestration
├── .env.example          # Environment Variables Template
├── .env                  # Development Environment File
└── README.md
```

---

## 4. Operational Modes: DEMO vs. REAL DATA

STORMCAST AI features a dual-mode architecture:

- **A. DEMO / SIMULATION MODE (Default)**: Works immediately out-of-the-box without external API keys. Generates realistic, deterministic convective storm evolution across South/Central India (Chennai, Bengaluru, Hyderabad, Machilipatnam). All synthetic data items are clearly tagged with `is_demo: true` and displayed with a **DEMO / SIMULATION DATA** badge.
- **B. REAL DATA MODE**: Connected via clean provider interfaces (`RadarDataProvider`, `SatelliteDataProvider`, `LightningDataProvider`). Enabled by setting `DATA_MODE=real` and configuring provider API credentials in `.env`.

---

## 5. Quick Start & Running Locally

### Option A: Docker Compose (Recommended)

1. Clone or navigate to the project directory:
   ```bash
   cd stormcast-ai
   ```
2. Launch all services:
   ```bash
   docker-compose up --build
   ```
3. Open your browser:
   - **Frontend Command Dashboard:** `http://localhost:5173`
   - **FastAPI Documentation:** `http://localhost:8000/docs`

---

### Option B: Local Development Execution

#### 1. Backend Setup:
```bash
cd stormcast-ai/backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
# source venv/bin/activate

pip install -r requirements.txt
python -c "from app.database.session import engine, Base; from app.models.entities import *; Base.metadata.create_all(bind=engine)"
python -c "from app.database.session import SessionLocal; from app.db_init import init_db; db=SessionLocal(); init_db(db); db.close()"
uvicorn app.main:app --reload --port 8000
```

#### 2. Frontend Setup:
```bash
cd stormcast-ai/frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 6. Demo Login Credentials

- **Role:** Duty Meteorologist (Admin Access)
- **Email:** `admin@stormcast.moes.gov.in`
- **Password:** `stormcast2026!`

---

## 7. Operational Pages Overview

1. **Overview Dashboard:** Main command center with KPI cards, GIS map, Timeline player, Right Nowcast panel, and active warning alerts.
2. **Live Nowcasting Map:** Dedicated full-screen operational map with forecast variable toggles and grid cell inspection.
3. **Thunderstorm Prediction:** Multi-horizon probability curves (15m, 30m, 45m, 60m) and storm cell directory.
4. **Lightning Monitoring:** Cloud-to-Ground (CG) vs. Intra-Cloud (IC) flash rate analytics and stroke current telemetry.
5. **Radar Intelligence:** Doppler Weather Radar network status and 250km reflectivity sweep screen.
6. **Satellite Intelligence:** INSAT-3DR Infrared (10.8µm), Visible, and Water Vapor spectrum views with AI convective overshooting top spotter.
7. **Risk & Alert Center:** Rule-engine warning cards with acknowledgment workflow.
8. **Historical Analysis:** Climatological query tool by date, sector, and severity with monthly flash frequency charts.
9. **AI Model Center:** Swappable model registry, validation metrics (Accuracy, Precision, Recall, F1), and pipeline architecture.
10. **Data Sources:** Provider ingestion status, quality flags (GOOD, SUSPECT, MISSING, STALE), and real provider setup instructions.
11. **System Health:** Server host CPU/memory load, API latency, and WebSocket status.
12. **Settings:** Threshold configuration for thunderstorm prob, lightning prob, confidence, and GIS map defaults.

---

## 8. Verification & Test Suite

Run the automated backend test suite:
```bash
cd stormcast-ai
python tests/run_tests.py
```

Run the frontend build verification:
```bash
cd stormcast-ai/frontend
npm run build
```

---

## 9. Real Data Integration Instructions

To connect real IMD radar or satellite feeds, implement the provider interface in `backend/app/providers/real_providers.py` and set `.env`:
```env
DATA_MODE=real
RADAR_PROVIDER=imd_dwr_adapter
RADAR_API_KEY=your_imd_api_key
SATELLITE_PROVIDER=mosdac_insat3d_adapter
MOSDAC_API_KEY=your_mosdac_api_key
LIGHTNING_PROVIDER=imd_lms_adapter
```

---

## 10. System Architecture & Ethics Disclosure

- **No Fake Scientific Claims:** Demo data is tagged with `is_demo = true` and clearly labeled as simulation. Untrained model metrics state *"Awaiting validation"*.
- **Probability != Confidence:** Probability represents event likelihood; confidence represents dataset quality and observation sensor coverage density.
