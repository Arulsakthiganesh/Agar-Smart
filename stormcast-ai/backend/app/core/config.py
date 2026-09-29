import os
from typing import List, Union
from pydantic import AnyHttpUrl, validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "STORMCAST AI"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "stormcast-secret-key-sih-2026-moes-imd-secure"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Data Ingestion Mode: 'demo' | 'real'
    DATA_MODE: str = "real"

    # External Provider Identifiers
    RADAR_PROVIDER: str = "imd_dwr_adapter"
    SATELLITE_PROVIDER: str = "mosdac_insat3d_adapter"
    LIGHTNING_PROVIDER: str = "imd_lms_adapter"
    NWP_PROVIDER: str = "demo_nwp"

    # Built-in Default Operational Station API Keys (Chennai Sector DWR & MOSDAC INSAT-3DR)
    RADAR_API_KEY: str = "imd_chn_dwr_live_sk_2026_9941a"
    MOSDAC_API_KEY: str = "mosdac_insat3dr_chn_sk_8820f"
    LIGHTNING_API_KEY: str = "imd_lms_chn_sensor_sk_3310b"

    # Database
    DATABASE_URL: str = "sqlite:///./stormcast.db"

    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://localhost:8000"
    ]

    # WebSockets
    WS_HEARTBEAT_INTERVAL: int = 15

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
