from datetime import datetime
import uuid
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, Text, JSON, Enum
from app.database.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default="VIEWER")  # ADMIN, METEOROLOGIST, ANALYST, VIEWER
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class DataSource(Base):
    __tablename__ = "data_sources"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)  # RADAR, SATELLITE, LIGHTNING, NWP
    provider = Column(String, nullable=False)
    status = Column(String, default="ONLINE")  # ONLINE, DEGRADED, OFFLINE
    is_demo = Column(Boolean, default=True)
    last_ingested_at = Column(DateTime, default=datetime.utcnow)
    latency_seconds = Column(Integer, default=5)
    quality_flag = Column(String, default="GOOD")  # GOOD, SUSPECT, MISSING, STALE
    metadata_json = Column(JSON, nullable=True)

class RadarStation(Base):
    __tablename__ = "radar_stations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    station_code = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    elevation_m = Column(Float, default=100.0)
    status = Column(String, default="ONLINE")
    max_range_km = Column(Float, default=250.0)
    last_scan_at = Column(DateTime, default=datetime.utcnow)
    is_demo = Column(Boolean, default=True)

class StormCell(Base):
    __tablename__ = "storm_cells"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    cell_code = Column(String, index=True, nullable=False)  # e.g., CELL-001
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    intensity_dbz = Column(Float, default=45.0)  # Reflectivity dBZ
    severity_level = Column(String, default="MODERATE")  # LOW, MODERATE, HIGH, SEVERE, CRITICAL
    thunderstorm_prob = Column(Float, default=0.75)
    lightning_prob = Column(Float, default=0.60)
    direction_cardinal = Column(String, default="NE")
    bearing_deg = Column(Float, default=45.0)
    speed_kmh = Column(Float, default=25.0)
    confidence = Column(Float, default=0.88)
    polygon_geojson = Column(JSON, nullable=True)
    is_demo = Column(Boolean, default=True)
    detected_at = Column(DateTime, default=datetime.utcnow)

class LightningStrike(Base):
    __tablename__ = "lightning_strikes"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    peak_current_ka = Column(Float, default=25.4)
    type = Column(String, default="CG")  # CG (Cloud-to-Ground) or IC (Intra-Cloud)
    polarity = Column(String, default="+")
    confidence = Column(Float, default=0.95)
    is_demo = Column(Boolean, default=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

class WeatherObservation(Base):
    __tablename__ = "weather_observations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    location_name = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    temperature_c = Column(Float, default=32.5)
    humidity_pct = Column(Float, default=85.0)
    pressure_hpa = Column(Float, default=1004.2)
    wind_speed_kmh = Column(Float, default=18.0)
    wind_direction_deg = Column(Float, default=210.0)
    rainfall_mm = Column(Float, default=14.5)
    cape_jkg = Column(Float, default=2400.0)  # Convective Available Potential Energy
    cin_jkg = Column(Float, default=15.0)    # Convective Inhibition
    is_demo = Column(Boolean, default=True)
    observed_at = Column(DateTime, default=datetime.utcnow, index=True)

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    location_name = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    horizon_minutes = Column(Integer, nullable=False)  # 15, 30, 45, 60
    thunderstorm_prob = Column(Float, nullable=False)
    lightning_prob = Column(Float, nullable=False)
    risk_level = Column(String, nullable=False)  # LOW, MODERATE, HIGH, SEVERE, CRITICAL
    storm_direction = Column(String, default="NE")
    storm_speed_kmh = Column(Float, default=20.0)
    confidence = Column(Float, default=0.90)
    is_demo = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    valid_until = Column(DateTime, nullable=False)

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    alert_code = Column(String, unique=True, nullable=False)
    category = Column(String, nullable=False)  # THUNDERSTORM, LIGHTNING, HEAVY_RAIN, WIND
    severity = Column(String, nullable=False)  # LOW, MODERATE, HIGH, SEVERE, CRITICAL
    location_name = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    thunderstorm_prob = Column(Float, default=0.85)
    lightning_prob = Column(Float, default=0.80)
    confidence = Column(Float, default=0.92)
    message = Column(Text, nullable=False)
    recommended_action = Column(Text, nullable=False)
    status = Column(String, default="ACTIVE")  # ACTIVE, ACKNOWLEDGED, EXPIRED
    acknowledged_by = Column(String, nullable=True)
    is_demo = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)

class SystemLog(Base):
    __tablename__ = "system_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    level = Column(String, default="INFO")  # INFO, WARNING, ERROR, CRITICAL
    module = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    details_json = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
