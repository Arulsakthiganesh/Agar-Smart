from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

# Authentication
class UserLogin(BaseModel):
    email: str
    password: str

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    role: Optional[str] = "VIEWER"

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    is_active: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# API Key Management
class ApiKeyUpdateRequest(BaseModel):
    radar_api_key: Optional[str] = None
    mosdac_api_key: Optional[str] = None
    lightning_api_key: Optional[str] = None

class ApiKeyStatusResponse(BaseModel):
    radar_key_configured: bool
    mosdac_key_configured: bool
    lightning_key_configured: bool
    data_mode: str
    radar_provider: str
    satellite_provider: str

# Coordinates & Geographic Structures
class LocationPoint(BaseModel):
    latitude: float
    longitude: float
    location_name: Optional[str] = None

class MovementVector(BaseModel):
    direction_cardinal: str = "NE"
    bearing_degrees: float = 45.0
    speed_kmh: float = 20.0

# Storm Cells
class StormCellSchema(BaseModel):
    id: str
    cell_code: str
    latitude: float
    longitude: float
    intensity_dbz: float
    severity_level: str
    thunderstorm_prob: float
    lightning_prob: float
    direction_cardinal: str
    bearing_deg: float
    speed_kmh: float
    confidence: float
    polygon_geojson: Optional[Dict[str, Any]] = None
    is_demo: bool
    detected_at: datetime

    class Config:
        from_attributes = True

# Lightning Strikes
class LightningStrikeSchema(BaseModel):
    id: str
    latitude: float
    longitude: float
    peak_current_ka: float
    type: str
    polarity: str
    confidence: float
    is_demo: bool
    timestamp: datetime

    class Config:
        from_attributes = True

# Weather Observations
class WeatherObservationSchema(BaseModel):
    id: str
    location_name: str
    latitude: float
    longitude: float
    temperature_c: float
    humidity_pct: float
    pressure_hpa: float
    wind_speed_kmh: float
    wind_direction_deg: float
    rainfall_mm: float
    cape_jkg: float
    cin_jkg: float
    is_demo: bool
    observed_at: datetime

    class Config:
        from_attributes = True

# Predictions
class NowcastPredictionSchema(BaseModel):
    id: str
    location_name: str
    latitude: float
    longitude: float
    horizon_minutes: int
    thunderstorm_prob: float
    lightning_prob: float
    risk_level: str
    storm_direction: str
    storm_speed_kmh: float
    confidence: float
    is_demo: bool
    created_at: datetime
    valid_until: datetime

    class Config:
        from_attributes = True

# Radar Network
class RadarStationSchema(BaseModel):
    id: str
    station_code: str
    name: str
    latitude: float
    longitude: float
    elevation_m: float
    status: str
    max_range_km: float
    last_scan_at: datetime
    is_demo: bool

    class Config:
        from_attributes = True

# Alerts
class AlertSchema(BaseModel):
    id: str
    alert_code: str
    category: str
    severity: str
    location_name: str
    latitude: float
    longitude: float
    thunderstorm_prob: float
    lightning_prob: float
    confidence: float
    message: str
    recommended_action: str
    status: str
    acknowledged_by: Optional[str] = None
    is_demo: bool
    created_at: datetime
    expires_at: datetime

    class Config:
        from_attributes = True

class AlertAcknowledgeRequest(BaseModel):
    acknowledged_by: str

# Data Sources Status
class DataSourceSchema(BaseModel):
    id: str
    name: str
    type: str
    provider: str
    status: str
    is_demo: bool
    last_ingested_at: datetime
    latency_seconds: int
    quality_flag: str
    metadata_json: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

# System Health
class SystemHealthSchema(BaseModel):
    api_status: str
    database_status: str
    ai_engine_status: str
    websocket_status: str
    data_mode: str
    cpu_usage_pct: float
    memory_usage_pct: float
    active_connections: int
    last_model_inference: datetime
    providers_status: Dict[str, str]

# Dashboard Summary Package
class DashboardSummarySchema(BaseModel):
    active_storm_cells_count: int
    active_storm_cells_trend: str
    lightning_events_60m_count: int
    high_risk_zones_count: int
    critical_risk_zones_count: int
    predicted_events_count: int
    data_mode: str
    last_updated: datetime
    recent_alerts: List[AlertSchema]
    active_storm_cells: List[StormCellSchema]
    latest_lightning_strikes: List[LightningStrikeSchema]
