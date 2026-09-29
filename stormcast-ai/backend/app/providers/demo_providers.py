import random
import math
from datetime import datetime, timedelta
from typing import Dict, Any, List
from app.providers.base_provider import BaseDataProvider

# Deterministic seed for reproducible demo scenarios
random.seed(42)

# Central Coordinates around South/Central India (Chennai, Bengaluru, Hyderabad, Visakhapatnam, Kolkata)
DEMO_REGIONS = [
    {"name": "Chennai Urban & Coastal Sector", "lat": 13.0827, "lon": 80.2707, "base_dbz": 52.0},
    {"name": "Bengaluru Electronic City Sector", "lat": 12.9716, "lon": 77.5946, "base_dbz": 44.0},
    {"name": "Hyderabad Convective Sector", "lat": 17.3850, "lon": 78.4867, "base_dbz": 48.0},
    {"name": "Machilipatnam Radar Radius", "lat": 16.1800, "lon": 81.1300, "base_dbz": 58.5},
    {"name": "Kolkata Coastal Delta", "lat": 22.5726, "lon": 88.3639, "base_dbz": 38.0}
]

class DemoRadarProvider(BaseDataProvider):
    def get_status(self) -> Dict[str, Any]:
        return {
            "provider": "DemoRadarProvider",
            "status": "ONLINE",
            "is_demo": True,
            "latency_seconds": 2,
            "quality_flag": "GOOD",
            "active_stations": 4
        }

    def fetch_latest(self) -> List[Dict[str, Any]]:

        stations = [
            {"id": "rad-001", "station_code": "CHN-DWR", "name": "Chennai Doppler Radar", "latitude": 13.0827, "longitude": 80.2707, "elevation_m": 45.0, "status": "ONLINE", "max_range_km": 250.0, "is_demo": True},
            {"id": "rad-002", "station_code": "BLR-DWR", "name": "Bengaluru Radar Station", "latitude": 12.9716, "longitude": 77.5946, "elevation_m": 920.0, "status": "ONLINE", "max_range_km": 250.0, "is_demo": True},
            {"id": "rad-003", "station_code": "HYD-DWR", "name": "Hyderabad Radar Station", "latitude": 17.3850, "longitude": 78.4867, "elevation_m": 540.0, "status": "OFFLINE", "max_range_km": 250.0, "is_demo": True},
            {"id": "rad-004", "station_code": "MPT-DWR", "name": "Machilipatnam Coastal DWR", "latitude": 16.1800, "longitude": 81.1300, "elevation_m": 15.0, "status": "ONLINE", "max_range_km": 250.0, "is_demo": True}
        ]
        return stations

    def fetch_historical(self, start_time: datetime, end_time: datetime) -> List[Dict[str, Any]]:
        return self.fetch_latest()


class DemoLightningProvider(BaseDataProvider):
    def get_status(self) -> Dict[str, Any]:
        return {
            "provider": "DemoLightningProvider",
            "status": "ONLINE",
            "is_demo": True,
            "latency_seconds": 1,
            "quality_flag": "GOOD"
        }

    def fetch_latest(self) -> List[Dict[str, Any]]:
        now = datetime.utcnow()
        strikes = []
        # Generate 40 active demo strikes centered around Chennai storm cell
        for i in range(40):
            dt = now - timedelta(seconds=random.randint(5, 3500))
            lat = 13.0827 + random.uniform(-0.4, 0.4)
            lon = 80.2707 + random.uniform(-0.4, 0.4)
            stype = "CG" if random.random() > 0.3 else "IC"
            current = round(random.uniform(12.0, 85.0), 1)
            strikes.append({
                "id": f"lgt-demo-{i+1:03d}",
                "latitude": round(lat, 5),
                "longitude": round(lon, 5),
                "peak_current_ka": current,
                "type": stype,
                "polarity": "+" if random.random() > 0.2 else "-",
                "confidence": 0.94,
                "is_demo": True,
                "timestamp": dt
            })
        return strikes

    def fetch_historical(self, start_time: datetime, end_time: datetime) -> List[Dict[str, Any]]:
        return self.fetch_latest()


class DemoSatelliteProvider(BaseDataProvider):
    def get_status(self) -> Dict[str, Any]:
        return {
            "provider": "DemoSatelliteProvider",
            "status": "ONLINE",
            "is_demo": True,
            "latency_seconds": 15,
            "quality_flag": "GOOD",
            "satellite_id": "INSAT-3DR",
            "channels": ["VISIBLE", "INFRARED", "WATER_VAPOR"]
        }

    def fetch_latest(self) -> List[Dict[str, Any]]:
        return [
            {
                "satellite": "INSAT-3DR",
                "channel": "INFRARED (10.8µm)",
                "min_cloud_top_temp_c": -68.4,
                "convective_risk_detected": True,
                "resolution_km": 4.0,
                "coverage": "Indian Subcontinent & Bay of Bengal",
                "is_demo": True,
                "timestamp": datetime.utcnow()
            }
        ]

    def fetch_historical(self, start_time: datetime, end_time: datetime) -> List[Dict[str, Any]]:
        return self.fetch_latest()


class DemoWeatherProvider(BaseDataProvider):
    def get_status(self) -> Dict[str, Any]:
        return {
            "provider": "DemoWeatherProvider",
            "status": "ONLINE",
            "is_demo": True,
            "latency_seconds": 3,
            "quality_flag": "GOOD"
        }

    def fetch_latest(self) -> List[Dict[str, Any]]:
        obs = []
        for reg in DEMO_REGIONS:
            obs.append({
                "location_name": reg["name"],
                "latitude": reg["lat"],
                "longitude": reg["lon"],
                "temperature_c": round(31.5 + random.uniform(-2, 2), 1),
                "humidity_pct": round(84.0 + random.uniform(-5, 10), 1),
                "pressure_hpa": round(1003.5 + random.uniform(-3, 3), 1),
                "wind_speed_kmh": round(22.0 + random.uniform(-5, 15), 1),
                "wind_direction_deg": round(215.0 + random.uniform(-30, 30), 1),
                "rainfall_mm": round(18.4 + random.uniform(-5, 20), 1),
                "cape_jkg": round(2650.0 + random.uniform(-300, 500), 1),
                "cin_jkg": round(12.0 + random.uniform(-5, 10), 1),
                "is_demo": True,
                "observed_at": datetime.utcnow()
            })
        return obs

    def fetch_historical(self, start_time: datetime, end_time: datetime) -> List[Dict[str, Any]]:
        return self.fetch_latest()
