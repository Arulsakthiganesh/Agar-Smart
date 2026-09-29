# STORMCAST AI - REST & WebSocket API Reference

**Base API URL:** `http://localhost:8000/api`  
**WebSocket URL:** `ws://localhost:8000/ws/live`  
**Interactive OpenAPI Specs:** `http://localhost:8000/docs`

---

## 1. Authentication Endpoints

### `POST /api/auth/login`
Authenticates a user and returns a JWT access token.

- **Request Body:**
  ```json
  {
    "email": "admin@stormcast.moes.gov.in",
    "password": "stormcast2026!"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "token_type": "bearer",
    "user": {
      "id": "usr-admin-001",
      "email": "admin@stormcast.moes.gov.in",
      "full_name": "Dr. A. K. Sharma (Duty Meteorologist)",
      "role": "ADMIN",
      "is_active": true
    }
  }
  ```

---

## 2. Operational Dashboard

### `GET /api/dashboard/summary`
Retrieves top KPI counters, recent active alerts, tracked storm cells, and lightning events.

- **Response (200 OK):**
  ```json
  {
    "active_storm_cells_count": 12,
    "active_storm_cells_trend": "+3 from 15 min ago",
    "lightning_events_60m_count": 428,
    "high_risk_zones_count": 7,
    "critical_risk_zones_count": 2,
    "predicted_events_count": 16,
    "data_mode": "DEMO",
    "last_updated": "2026-09-29T22:00:00Z",
    "recent_alerts": [],
    "active_storm_cells": [],
    "latest_lightning_strikes": []
  }
  ```

---

## 3. Predictions & Nowcasting

### `GET /api/predictions/latest`
Fetches multi-horizon predictions (15, 30, 45, 60 minutes).

- **Response (200 OK):**
  ```json
  [
    {
      "id": "prd-15m-001",
      "location_name": "Chennai Coastal & Urban Sector",
      "latitude": 13.0827,
      "longitude": 80.2707,
      "horizon_minutes": 15,
      "thunderstorm_prob": 0.88,
      "lightning_prob": 0.82,
      "risk_level": "SEVERE",
      "storm_direction": "NE",
      "storm_speed_kmh": 22.0,
      "confidence": 0.92,
      "is_demo": true,
      "created_at": "2026-09-29T22:00:00Z",
      "valid_until": "2026-09-29T22:15:00Z"
    }
  ]
  ```

---

## 4. Radar & Satellite

### `GET /api/radar`
Lists all Doppler Weather Radar (DWR) stations and their operational status.

### `GET /api/satellite/latest`
Retrieves current INSAT-3DR satellite convective scan status.

---

## 5. Alerts & Emergency Warnings

### `GET /api/alerts`
Lists all active emergency weather warnings.

### `POST /api/alerts/{id}/acknowledge`
Acknowledges an emergency alert by ID.

- **Request Body:**
  ```json
  {
    "acknowledged_by": "Dr. A. K. Sharma (Duty Meteorologist)"
  }
  ```

---

## 6. WebSocket Live Stream

### Endpoint: `ws://localhost:8000/ws/live`
Streams real-time updates for lightning events, radar sweep pulses, and alert triggers.

- **Event Schema Broadcast:**
  ```json
  {
    "event": "LIVE_HEARTBEAT",
    "timestamp": "2026-09-29T22:05:00Z",
    "data_mode": "demo",
    "message": "Live radar pulse & lightning telemetry synced."
  }
  ```
