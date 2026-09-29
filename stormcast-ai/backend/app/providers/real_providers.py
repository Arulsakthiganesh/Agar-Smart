import json
import urllib.request
import urllib.error
from datetime import datetime
from typing import Dict, Any, List
from app.providers.base_provider import BaseDataProvider
from app.core.config import settings

class IMDRadarProvider(BaseDataProvider):
    """
    Real Operational Provider Adapter for India Meteorological Department (IMD)
    Doppler Weather Radar (DWR) API Integration.
    """
    def __init__(self, api_key: str = ""):
        self.api_key = api_key or settings.RADAR_API_KEY
        self.base_url = "https://api.imd.gov.in/v1/dwr"

    def get_status(self) -> Dict[str, Any]:
        if not self.api_key:
            return {
                "provider": "IMDRadarProvider",
                "status": "CONFIG_REQUIRED",
                "is_demo": False,
                "latency_seconds": 0,
                "quality_flag": "STALE",
                "message": "IMD Radar API key required in RADAR_API_KEY environment variable."
            }
        
        try:
            req = urllib.request.Request(
                f"{self.base_url}/status",
                headers={"Authorization": f"Bearer {self.api_key}", "User-Agent": "STORMCAST-AI/1.0"}
            )
            with urllib.request.urlopen(req, timeout=5) as response:
                data = json.loads(response.read().decode())
                return {
                    "provider": "IMDRadarProvider",
                    "status": "ONLINE",
                    "is_demo": False,
                    "latency_seconds": 2,
                    "quality_flag": "GOOD",
                    "active_stations": data.get("active_stations_count", 4)
                }
        except Exception as e:
            return {
                "provider": "IMDRadarProvider",
                "status": "DEGRADED",
                "is_demo": False,
                "latency_seconds": 5,
                "quality_flag": "SUSPECT",
                "message": f"IMD Radar Gateway: {str(e)}"
            }

    def fetch_latest(self) -> List[Dict[str, Any]]:
        if not self.api_key:
            return []
        try:
            req = urllib.request.Request(
                f"{self.base_url}/latest-reflectivity",
                headers={"Authorization": f"Bearer {self.api_key}", "User-Agent": "STORMCAST-AI/1.0"}
            )
            with urllib.request.urlopen(req, timeout=8) as response:
                data = json.loads(response.read().decode())
                return data.get("stations", [])
        except Exception:
            return []

    def fetch_historical(self, start_time: datetime, end_time: datetime) -> List[Dict[str, Any]]:
        return self.fetch_latest()


class MOSDACSatelliteProvider(BaseDataProvider):
    """
    Real Operational Provider Adapter for MOSDAC (ISRO / IMD)
    INSAT-3D / INSAT-3DR Satellite Telemetry API Integration.
    """
    def __init__(self, api_key: str = ""):
        self.api_key = api_key or settings.MOSDAC_API_KEY
        self.base_url = "https://mosdac.gov.in/api/v1/insat3dr"

    def get_status(self) -> Dict[str, Any]:
        if not self.api_key:
            return {
                "provider": "MOSDACSatelliteProvider",
                "status": "CONFIG_REQUIRED",
                "is_demo": False,
                "latency_seconds": 0,
                "quality_flag": "STALE",
                "satellite_id": "INSAT-3DR",
                "message": "MOSDAC API key required in MOSDAC_API_KEY environment variable."
            }

        try:
            req = urllib.request.Request(
                f"{self.base_url}/status",
                headers={"X-MOSDAC-API-KEY": self.api_key, "User-Agent": "STORMCAST-AI/1.0"}
            )
            with urllib.request.urlopen(req, timeout=5) as response:
                data = json.loads(response.read().decode())
                return {
                    "provider": "MOSDACSatelliteProvider",
                    "status": "ONLINE",
                    "is_demo": False,
                    "latency_seconds": 10,
                    "quality_flag": "GOOD",
                    "satellite_id": "INSAT-3DR",
                    "channels": ["VISIBLE", "INFRARED", "WATER_VAPOR"]
                }
        except Exception as e:
            return {
                "provider": "MOSDACSatelliteProvider",
                "status": "DEGRADED",
                "is_demo": False,
                "latency_seconds": 15,
                "quality_flag": "SUSPECT",
                "message": f"MOSDAC Gateway: {str(e)}"
            }

    def fetch_latest(self) -> List[Dict[str, Any]]:
        if not self.api_key:
            return []
        try:
            req = urllib.request.Request(
                f"{self.base_url}/convective-ir",
                headers={"X-MOSDAC-API-KEY": self.api_key, "User-Agent": "STORMCAST-AI/1.0"}
            )
            with urllib.request.urlopen(req, timeout=8) as response:
                data = json.loads(response.read().decode())
                return data.get("scans", [])
        except Exception:
            return []

    def fetch_historical(self, start_time: datetime, end_time: datetime) -> List[Dict[str, Any]]:
        return self.fetch_latest()
