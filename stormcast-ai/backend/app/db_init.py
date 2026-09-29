from datetime import datetime, timedelta
import uuid
from sqlalchemy.orm import Session
from app.models.entities import User, RadarStation, StormCell, LightningStrike, WeatherObservation, Prediction, Alert, DataSource
from app.core.security import get_password_hash

def init_db(db: Session):
    # 1. Default Admin & Duty Meteorologist User
    if not db.query(User).filter(User.email == "admin@stormcast.moes.gov.in").first():
        admin = User(
            id="usr-admin-001",
            email="admin@stormcast.moes.gov.in",
            hashed_password=get_password_hash("stormcast2026!"),
            full_name="Dr. A. K. Sharma (Duty Meteorologist)",
            role="ADMIN",
            is_active=True
        )
        db.add(admin)

    # 2. Radar Stations
    if db.query(RadarStation).count() == 0:
        radars = [
            RadarStation(id="rad-001", station_code="CHN-DWR", name="Chennai Doppler Radar", latitude=13.0827, longitude=80.2707, elevation_m=45.0, status="ONLINE", max_range_km=250.0, is_demo=True),
            RadarStation(id="rad-002", station_code="BLR-DWR", name="Bengaluru Radar Station", latitude=12.9716, longitude=77.5946, elevation_m=920.0, status="ONLINE", max_range_km=250.0, is_demo=True),
            RadarStation(id="rad-003", station_code="HYD-DWR", name="Hyderabad Radar Station", latitude=17.3850, longitude=78.4867, elevation_m=540.0, status="OFFLINE", max_range_km=250.0, is_demo=True),
            RadarStation(id="rad-004", station_code="MPT-DWR", name="Machilipatnam Coastal DWR", latitude=16.1800, longitude=81.1300, elevation_m=15.0, status="ONLINE", max_range_km=250.0, is_demo=True),
        ]
        db.add_all(radars)

    # 3. Storm Cells
    if db.query(StormCell).count() == 0:
        cells = [
            StormCell(
                id="cell-001", cell_code="CELL-001", latitude=13.0827, longitude=80.2707,
                intensity_dbz=54.5, severity_level="SEVERE", thunderstorm_prob=0.88,
                lightning_prob=0.82, direction_cardinal="NE", bearing_deg=45.0,
                speed_kmh=22.0, confidence=0.92, is_demo=True
            ),
            StormCell(
                id="cell-002", cell_code="CELL-002", latitude=12.9716, longitude=77.5946,
                intensity_dbz=46.0, severity_level="HIGH", thunderstorm_prob=0.74,
                lightning_prob=0.65, direction_cardinal="ENE", bearing_deg=67.5,
                speed_kmh=18.5, confidence=0.89, is_demo=True
            ),
            StormCell(
                id="cell-003", cell_code="CELL-003", latitude=16.1800, longitude=81.1300,
                intensity_dbz=58.0, severity_level="CRITICAL", thunderstorm_prob=0.94,
                lightning_prob=0.91, direction_cardinal="NE", bearing_deg=40.0,
                speed_kmh=26.0, confidence=0.95, is_demo=True
            ),
            StormCell(
                id="cell-004", cell_code="CELL-004", latitude=17.3850, longitude=78.4867,
                intensity_dbz=38.0, severity_level="MODERATE", thunderstorm_prob=0.52,
                lightning_prob=0.40, direction_cardinal="NNE", bearing_deg=22.5,
                speed_kmh=15.0, confidence=0.85, is_demo=True
            )
        ]
        db.add_all(cells)

    # 4. Lightning Strikes
    if db.query(LightningStrike).count() == 0:
        now = datetime.utcnow()
        strikes = []
        for i in range(25):
            strikes.append(LightningStrike(
                id=f"lgt-seed-{i+1}",
                latitude=13.0827 + (i * 0.015 - 0.15),
                longitude=80.2707 + (i * 0.012 - 0.12),
                peak_current_ka=round(18.0 + i * 2.1, 1),
                type="CG" if i % 2 == 0 else "IC",
                polarity="+" if i % 3 != 0 else "-",
                confidence=0.94,
                is_demo=True,
                timestamp=now - timedelta(minutes=i*2)
            ))
        db.add_all(strikes)

    # 5. Data Sources
    if db.query(DataSource).count() == 0:
        sources = [
            DataSource(id="ds-01", name="IMD Doppler Radar Network", type="RADAR", provider="DemoRadarProvider", status="ONLINE", is_demo=True, latency_seconds=3, quality_flag="GOOD"),
            DataSource(id="ds-02", name="MOSDAC INSAT-3DR Satellite Feed", type="SATELLITE", provider="DemoSatelliteProvider", status="ONLINE", is_demo=True, latency_seconds=12, quality_flag="GOOD"),
            DataSource(id="ds-03", name="IMD Lightning Detection System", type="LIGHTNING", provider="DemoLightningProvider", status="ONLINE", is_demo=True, latency_seconds=1, quality_flag="GOOD"),
            DataSource(id="ds-04", name="IMD Numerical Weather Prediction", type="NWP", provider="DemoWeatherProvider", status="ONLINE", is_demo=True, latency_seconds=5, quality_flag="GOOD"),
        ]
        db.add_all(sources)

    # 6. Default Severe Alerts
    if db.query(Alert).count() == 0:
        now = datetime.utcnow()
        alerts = [
            Alert(
                id="alt-001", alert_code="ALT-IMD-2026-CHN01", category="THUNDERSTORM",
                severity="CRITICAL", location_name="Chennai Coastal & Urban Sector",
                latitude=13.0827, longitude=80.2707, thunderstorm_prob=0.94,
                lightning_prob=0.91, confidence=0.95,
                message="Critical severe convective thunderstorm cell detected moving northeast. Expect intense lightning flashes and sudden wind gusts exceeding 65 km/h.",
                recommended_action="Activate civil defense protocols, delay airport departures, alert fishermen off Bay of Bengal.",
                status="ACTIVE", is_demo=True, created_at=now, expires_at=now + timedelta(hours=3)
            ),
            Alert(
                id="alt-002", alert_code="ALT-IMD-2026-MPT02", category="LIGHTNING",
                severity="SEVERE", location_name="Machilipatnam Coastal Delta",
                latitude=16.1800, longitude=81.1300, thunderstorm_prob=0.88,
                lightning_prob=0.85, confidence=0.92,
                message="Rapid surge in intra-cloud and cloud-to-ground lightning strike frequency observed over Machilipatnam sector.",
                recommended_action="Instruct outdoor workers to take immediate shelter, suspend high-elevation construction.",
                status="ACTIVE", is_demo=True, created_at=now, expires_at=now + timedelta(hours=2)
            )
        ]
        db.add_all(alerts)

    db.commit()
