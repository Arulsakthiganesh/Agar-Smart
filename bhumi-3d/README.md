# BHUMI³D — 3D ULPIN & Vertical Property Intelligence Platform

[![Smart India Hackathon 2026](https://img.shields.io/badge/SIH-2026-blue.svg)](https://sih.gov.in)
[![Problem Statement ID](https://img.shields.io/badge/Problem%20ID-SIH26011-cyan.svg)](https://sih.gov.in)
[![Ministry](https://img.shields.io/badge/Ministry-Rural%20Development%20(DoLR)-emerald.svg)](https://dolr.gov.in)

> **BHUMI³D** transforms traditional 2D land records into an intelligent 3D cadastral system where every surface land parcel, building structure, floor level, apartment unit, and underground subsurface asset has a standardized 3D ULPIN (Unique Land Parcel Identification Number) spatial identity.

---

## 📌 Problem Statement (SIH26011)

* **Title:** 3D ULPIN Generation and Vertical Property Mapping System
* **Organization:** Ministry of Rural Development
* **Department:** Department of Land Resources (DoLR)
* **Category:** Software | **Theme:** Space Technology

Existing land administration systems primarily identify surface-level land parcels and are unable to uniquely define ownership rights associated with multi-storey apartments, underground infrastructure, elevated corridors, air-rights, and subsurface utility networks.

---

## 🚀 Key Features

* **Interactive 3D Cadastral Engine (Three.js / React Three Fiber):**
  * Multi-storey procedural building models (e.g. *BHUMI Residency*, 8 floors, 32 units).
  * **Exploded Floor View:** Vertical floor separation animation to inspect interior units.
  * **Floor Slider:** Isolate individual floor levels (e.g. Floor 7).
  * **Subsurface Mode:** 3D visualization of underground water pipelines, sewage lines, 33kV electrical conduits, and metro tunnels.
  * Preset View Controls: Isometric, Top View, Front View, Subsurface View.
* **Standardized 3D ULPIN Generator:**
  * Form-driven spatial identifier formula: `IN-[STATE]-[DISTRICT]-[LOCALITY]-[PARCEL]-[BUILDING]-[FLOOR]-[UNIT]-[CHECKSUM]`.
  * Instant QR code generation & PDF ULPIN Spatial Rights Certificate export.
* **AI Geospatial Intelligence Pipeline:**
  * Simulated computer vision drone scan analyzer for automated building footprint extraction, 2D/3D boundary delineation, and vertical unit segmentation with confidence scores (e.g., 96.4%).
* **Intelligent Topology Validation Engine:**
  * Automated checks for parcel spatial overlaps, air-rights variances, elevation bounds mismatches, and duplicate ULPIN warnings.
* **2D/3D GIS Parcel Explorer:**
  * Interactive Leaflet map with GeoJSON parcel polygon overlays and subsurface utility polylines centered around Chennai, Tamil Nadu (Adyar, Anna Nagar, Velachery).

---

## 🛠 Technology Stack

* **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`), Leaflet, React Leaflet, Recharts, Lucide Icons, Axios, Zustand.
* **Backend:** Python 3.10+, FastAPI, Pydantic, SQLAlchemy, SQLite (Zero-dependency default) / PostgreSQL PostGIS ready, ReportLab (PDF Certificates), OpenCV / NumPy (AI Computer Vision simulation), PyJWT.

---

## 📂 Project Structure

```text
bhumi-3d/
├── frontend/                  # React + Vite + TypeScript + Tailwind + R3F 3D Engine
│   ├── src/
│   │   ├── components/        # ThreeDViewer, MapView, Navbar, Sidebar
│   │   ├── layouts/           # DashboardLayout
│   │   ├── pages/             # 13 Application Pages
│   │   ├── services/          # Axios API Client
│   │   ├── store/             # Zustand global state
│   │   └── types/             # TypeScript interfaces
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── backend/                   # FastAPI REST API + SQLAlchemy + AI Pipeline
│   ├── app/
│   │   ├── main.py            # FastAPI Entry Point
│   │   ├── database.py        # SQLAlchemy Setup
│   │   ├── models/            # DB Models
│   │   ├── schemas/           # Pydantic Schemas
│   │   ├── routers/           # REST Routers
│   │   ├── ulpin/             # 3D ULPIN Generator & QR Code
│   │   ├── ai/                # AI Drone Scan Computer Vision Pipeline
│   │   └── utils/             # PDF Report Generator
│   ├── seed.py                # Database Seeder (Chennai Land Records)
│   └── requirements.txt
│
├── docker-compose.yml
├── README.md
└── .env.example
```

---

## ⚡ Quick Start & Running Locally

### 1. Backend Setup & Run

```bash
cd backend

# Create virtual environment (optional)
python -m venv venv
# On Windows:
venv\Scripts\activate

# Install python dependencies
pip install -r requirements.txt

# Seed Database with Realistic Chennai Cadastral Data
python seed.py

# Start FastAPI Backend Server
python -m uvicorn app.main:app --reload --port 8000
```

FastAPI OpenAPI Documentation will be live at: **`http://localhost:8000/docs`**

---

### 2. Frontend Setup & Run

Open a new terminal:

```bash
cd frontend

# Install Node dependencies
npm install

# Start Vite Development Server
npm run dev
```

Frontend application will be live at: **`http://localhost:5173`**

---

## 🔑 Demo Login Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@bhumi3d.gov.in` | `admin123` |
| **Government Officer (DoLR)** | `officer@bhumi3d.gov.in` | `officer123` |
| **Senior GIS Surveyor** | `surveyor@bhumi3d.gov.in` | `surveyor123` |

---

## 🎯 SIH 2026 Presentation Walkthrough Scenario

1. **Login** using `admin@bhumi3d.gov.in`.
2. Inspect the **Land Intelligence Dashboard** showing 8 KPI Cards, 3D Cadastral mapping progress charts, and recent activity.
3. Open **3D Property Map** to enter full-screen Three.js GIS view.
4. Rotate/Pan scene around **BHUMI Residency**.
5. Click **Exploded View** button to watch all 8 floors separate smoothly into vertical layers.
6. Adjust **Floor Level Slider** to isolate **Floor 7**.
7. Click unit **A-703** to highlight it in glowing cyan and inspect the right drawer with 3D ULPIN `IN-TN-CHN-ADY-00482-B03-F07-U21-X7`.
8. Click **Subsurface Mode** to inspect underground water pipes, sewage lines, 33kV electrical conduits, and Metro tunnels.
9. Open **ULPIN Generator** to issue new spatial identifiers and download a **3D ULPIN PDF Certificate**.
10. Navigate to **AI Geospatial** page and trigger the computer-vision extraction pipeline.
11. View **Topology Validation** to review and resolve spatial overlap conflicts.

---

## ⚖️ Official Disclaimer

> **BHUMI³D** is a prototype developed for Smart India Hackathon 2026 (Problem Statement ID: SIH26011). Demonstration data and prototype ULPIN logic are fictional and must not be treated as official government land records.
