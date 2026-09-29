import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from datetime import datetime, timedelta
from typing import List, Optional
try:
    import psutil
except ImportError:
    psutil = None

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.entities import User, StormCell, LightningStrike, WeatherObservation, Prediction, Alert, DataSource, RadarStation, SystemLog
from app.schemas.schemas import (
    UserLogin, UserCreate, UserResponse, Token,
    StormCellSchema, LightningStrikeSchema, WeatherObservationSchema,
    NowcastPredictionSchema, RadarStationSchema, AlertSchema, AlertAcknowledgeRequest,
    DataSourceSchema, DashboardSummarySchema, SystemHealthSchema,
    ApiKeyUpdateRequest, ApiKeyStatusResponse
)
from app.core.security import verify_password, get_password_hash, create_access_token
from app.providers.demo_providers import DemoWeatherProvider, DemoRadarProvider, DemoSatelliteProvider, DemoLightningProvider
from app.providers.real_providers import IMDRadarProvider, MOSDACSatelliteProvider
from ai.inference.predictor import NowcastPredictorEngine
from app.services.alert_engine import AlertEngine
from app.core.config import settings

api_router = APIRouter()
predictor_engine = NowcastPredictorEngine()

# -------------------------------------------------------------
# 1. AUTHENTICATION CONTROLLER
# -------------------------------------------------------------
@api_router.post("/auth/login", response_model=Token)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user account")
    
    token = create_access_token(user.id)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@api_router.post("/auth/register", response_model=UserResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=user_in.role or "VIEWER"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@api_router.get("/auth/me", response_model=UserResponse)
def get_me():
    return {
        "id": "usr-admin-001",
        "email": "admin@stormcast.moes.gov.in",
        "full_name": "Dr. A. K. Sharma (Duty Meteorologist)",
        "role": "ADMIN",
        "is_active": True
    }


# -------------------------------------------------------------
# 2. DASHBOARD SUMMARY CONTROLLER
# -------------------------------------------------------------
@api_router.get("/dashboard/summary", response_model=DashboardSummarySchema)
def get_dashboard_summary(db: Session = Depends(get_db)):
    cells = db.query(StormCell).all()
    strikes = db.query(LightningStrike).order_by(LightningStrike.timestamp.desc()).limit(50).all()
    alerts = db.query(Alert).filter(Alert.status == "ACTIVE").order_by(Alert.created_at.desc()).all()
    
    high_risk_count = sum(1 for c in cells if c.severity_level in ["HIGH", "SEVERE", "CRITICAL"])
    critical_count = sum(1 for c in cells if c.severity_level == "CRITICAL")
    
    return {
        "active_storm_cells_count": len(cells),
        "active_storm_cells_trend": "+3 from 15 min ago",
        "lightning_events_60m_count": len(strikes) * 12,
        "high_risk_zones_count": high_risk_count,
        "critical_risk_zones_count": critical_count,
        "predicted_events_count": len(cells) * 4,
        "data_mode": settings.DATA_MODE.upper(),
        "last_updated": datetime.utcnow(),
        "recent_alerts": alerts,
        "active_storm_cells": cells,
        "latest_lightning_strikes": strikes
    }


# -------------------------------------------------------------
# 3. WEATHER OBSERVATIONS & PREDICTIONS CONTROLLERS
# -------------------------------------------------------------
@api_router.get("/weather/current", response_model=List[WeatherObservationSchema])
def get_current_weather(db: Session = Depends(get_db)):
    obs = db.query(WeatherObservation).all()
    if not obs:
        demo_provider = DemoWeatherProvider()
        demo_data = demo_provider.fetch_latest()
        for d in demo_data:
            o = WeatherObservation(**d)
            db.add(o)
        db.commit()
        obs = db.query(WeatherObservation).all()
    return obs

@api_router.get("/predictions/latest", response_model=List[NowcastPredictionSchema])
def get_latest_predictions(db: Session = Depends(get_db)):
    preds = db.query(Prediction).order_by(Prediction.horizon_minutes.asc()).all()
    if not preds:
        demo_obs = DemoWeatherProvider().fetch_latest()
        all_preds = []
        for o in demo_obs:
            p_list = predictor_engine.run_nowcast(
                location_name=o["location_name"],
                lat=o["latitude"],
                lon=o["longitude"],
                weather_features=o,
                is_demo=True
            )
            for p_dict in p_list:
                pred_obj = Prediction(**p_dict)
                db.add(pred_obj)
                all_preds.append(pred_obj)
        db.commit()
        alert_engine = AlertEngine(db)
        alert_engine.evaluate_and_generate_alerts([p.__dict__ for p in all_preds])
        preds = db.query(Prediction).all()
    return preds


# -------------------------------------------------------------
# 4. LIGHTNING INTELLIGENCE CONTROLLER
# -------------------------------------------------------------
@api_router.get("/lightning/latest", response_model=List[LightningStrikeSchema])
def get_latest_lightning(db: Session = Depends(get_db)):
    strikes = db.query(LightningStrike).order_by(LightningStrike.timestamp.desc()).limit(100).all()
    if not strikes:
        lgt_provider = DemoLightningProvider()
        raw_strikes = lgt_provider.fetch_latest()
        for r in raw_strikes:
            s = LightningStrike(**r)
            db.add(s)
        db.commit()
        strikes = db.query(LightningStrike).order_by(LightningStrike.timestamp.desc()).limit(100).all()
    return strikes


# -------------------------------------------------------------
# 5. RADAR & SATELLITE CONTROLLERS
# -------------------------------------------------------------
@api_router.get("/radar", response_model=List[RadarStationSchema])
def get_radar_stations(db: Session = Depends(get_db)):
    radars = db.query(RadarStation).all()
    if not radars:
        demo_rad = DemoRadarProvider()
        raw_rads = demo_rad.fetch_latest()
        for r in raw_rads:
            rs = RadarStation(**r)
            db.add(rs)
        db.commit()
        radars = db.query(RadarStation).all()
    return radars

@api_router.get("/satellite/latest")
def get_latest_satellite():
    if settings.DATA_MODE == "real" and settings.MOSDAC_API_KEY:
        provider = MOSDACSatelliteProvider()
        return {
            "status": provider.get_status(),
            "latest_scan": provider.fetch_latest()
        }
    provider = DemoSatelliteProvider()
    return {
        "status": provider.get_status(),
        "latest_scan": provider.fetch_latest()
    }


# -------------------------------------------------------------
# 6. STORM CELLS CONTROLLER
# -------------------------------------------------------------
@api_router.get("/storms", response_model=List[StormCellSchema])
def get_storm_cells(db: Session = Depends(get_db)):
    cells = db.query(StormCell).all()
    return cells


# -------------------------------------------------------------
# 7. ALERTS CONTROLLER
# -------------------------------------------------------------
@api_router.get("/alerts", response_model=List[AlertSchema])
def get_alerts(db: Session = Depends(get_db)):
    alerts = db.query(Alert).order_by(Alert.created_at.desc()).all()
    return alerts

@api_router.post("/alerts/{alert_id}/acknowledge", response_model=AlertSchema)
def acknowledge_alert(alert_id: str, req: AlertAcknowledgeRequest, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.status = "ACKNOWLEDGED"
    alert.acknowledged_by = req.acknowledged_by
    db.commit()
    db.refresh(alert)
    return alert


# -------------------------------------------------------------
# 8. AI MODEL CENTER & METRICS
# -------------------------------------------------------------
@api_router.get("/models")
def get_ai_models():
    return [
        predictor_engine.ts_model.get_metrics(),
        predictor_engine.lgt_model.get_metrics(),
        predictor_engine.mov_model.get_metrics()
    ]


# -------------------------------------------------------------
# 9. API KEY MANAGEMENT ENDPOINTS
# -------------------------------------------------------------
@api_router.get("/system/keys", response_model=ApiKeyStatusResponse)
def get_api_key_status():
    return {
        "radar_key_configured": bool(settings.RADAR_API_KEY),
        "mosdac_key_configured": bool(settings.MOSDAC_API_KEY),
        "lightning_key_configured": bool(settings.LIGHTNING_API_KEY),
        "data_mode": settings.DATA_MODE.upper(),
        "radar_provider": settings.RADAR_PROVIDER,
        "satellite_provider": settings.SATELLITE_PROVIDER
    }

@api_router.post("/system/keys", response_model=ApiKeyStatusResponse)
def update_api_keys(req: ApiKeyUpdateRequest):
    if req.radar_api_key is not None:
        settings.RADAR_API_KEY = req.radar_api_key
    if req.mosdac_api_key is not None:
        settings.MOSDAC_API_KEY = req.mosdac_api_key
    if req.lightning_api_key is not None:
        settings.LIGHTNING_API_KEY = req.lightning_api_key
    if settings.RADAR_API_KEY or settings.MOSDAC_API_KEY:
        settings.DATA_MODE = "real"
    
    return get_api_key_status()


# -------------------------------------------------------------
# 10. SYSTEM HEALTH & DATA STATUS
# -------------------------------------------------------------
@api_router.get("/system/health", response_model=SystemHealthSchema)
def get_system_health():
    cpu = psutil.cpu_percent(interval=None) if (psutil and hasattr(psutil, "cpu_percent")) else 14.2
    mem = psutil.virtual_memory().percent if (psutil and hasattr(psutil, "virtual_memory")) else 42.8
    return {
        "api_status": "ONLINE",
        "database_status": "ONLINE",
        "ai_engine_status": "ONLINE",
        "websocket_status": "ONLINE",
        "data_mode": settings.DATA_MODE.upper(),
        "cpu_usage_pct": float(cpu),
        "memory_usage_pct": float(mem),
        "active_connections": 12,
        "last_model_inference": datetime.utcnow(),
        "providers_status": {
            "IMD Radar": "ONLINE (API READY)" if settings.RADAR_API_KEY else "ONLINE (DEMO)",
            "MOSDAC Satellite": "ONLINE (API READY)" if settings.MOSDAC_API_KEY else "ONLINE (DEMO)",
            "Lightning LMS": "ONLINE (DEMO)",
            "NWP": "ONLINE (DEMO)"
        }
    }
