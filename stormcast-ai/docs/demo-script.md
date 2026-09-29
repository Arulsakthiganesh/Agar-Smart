# STORMCAST AI - Hackathon Demonstration Script (SIH 2026)

This guide walks through presenting **STORMCAST AI** to judges for Problem Statement ID 26072.

---

## 1. Opening Pitch (30 Seconds)

> "Respected Jury, severe thunderstorms and lightning strikes cause thousands of casualties annually across India. Traditional Numerical Weather Prediction models are too slow for fast-evolving convective cells.
> 
> STORMCAST AI is a national meteorological command-and-control nowcasting platform built for the India Meteorological Department (IMD). It predicts thunderstorm probability, lightning strikes, severe risk levels, and storm cell movement 15, 30, 45, and 60 minutes into the future."

---

## 2. Step-by-Step Presentation Flow

### Step 1: Command Center Dashboard (Page 1)
- Show top KPI Cards: Active Storm Cells (`12`), Lightning Events (`428`), High-Risk Zones (`7`), Predicted Events (`16`).
- Demonstrate the **GIS Map**: Point out the Doppler Radar reflectivity rings (0–60+ dBZ scale), lightning strike markers, and storm centroid vector arrows moving towards the northeast.
- Demonstrate the **Bottom Map Timeline**: Click `PLAY TIMELINE` to show how the convective storm develops from `-30m` to `NOWCAST` to `+60m`. Point out that predicted data uses dashed/translucent styling while observed data uses solid styling.

### Step 2: Live Nowcast Map & Grid Inspection (Page 2)
- Show full-screen operational map.
- Demonstrate toggling layer variables: Thunderstorm Probability, Lightning Probability, Radar Reflectivity, and Wind Vectors.
- Click a grid cell to show real-time telemetry: Lat/Lon, 88% Thunderstorm Prob, 82% Lightning Prob, 92% Confidence, Wind Steering, Temperature & Humidity.

### Step 3: Thunderstorm & Lightning Deep Dives (Pages 3 & 4)
- **Thunderstorm Page**: Show the 60-minute temporal probability curve chart.
- **Lightning Page**: Show Cloud-to-Ground (CG) vs. Intra-Cloud (IC) strike breakdowns and flash rate frequency charts. Point out sensor quality audit flags.

### Step 4: Multi-Radar Network & Satellite (Pages 5 & 6)
- **Radar Intelligence**: Show Doppler Weather Radar status (Chennai ONLINE, Bengaluru ONLINE, Hyderabad OFFLINE). Demonstrate 250km reflectivity sweep radar screen.
- **Satellite Intelligence**: Show INSAT-3DR Infrared (10.8µm), Visible, and Water Vapor tabs with AI Convective Overshooting Top Spotter.

### Step 5: Risk & Alert Engine (Page 7)
- Show automatic rule-engine warnings. Point out critical warning `ALT-IMD-2026-CHN01` for Chennai.
- Click **Acknowledge Warning** button to demonstrate duty meteorologist workflow.

### Step 6: AI Model Center & System Health (Pages 9 & 11)
- Show the end-to-end AI pipeline architecture.
- Point out validation benchmarks (Accuracy, Precision, Recall, F1) and explain the strict separation between **Probability** and **Model Confidence**.
- Show the **Data Sources** page and demonstrate toggling between **DEMO / SIMULATION MODE** and **REAL DATA PROVIDER MODE**.
