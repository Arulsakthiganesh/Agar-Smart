import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../backend")))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "OPERATIONAL"
    assert data["platform"] == "STORMCAST AI"

def test_system_health():
    response = client.get("/api/system/health")
    assert response.status_code == 200
    data = response.json()
    assert data["api_status"] == "ONLINE"
    assert data["database_status"] == "ONLINE"
    assert "cpu_usage_pct" in data

def test_dashboard_summary():
    response = client.get("/api/dashboard/summary")
    assert response.status_code == 200
    data = response.json()
    assert "active_storm_cells_count" in data
    assert "latest_lightning_strikes" in data
    assert data["data_mode"] == "DEMO"

def test_latest_predictions():
    response = client.get("/api/predictions/latest")
    assert response.status_code == 200
    preds = response.json()
    assert isinstance(preds, list)
    if len(preds) > 0:
        p = preds[0]
        assert "thunderstorm_prob" in p
        assert "horizon_minutes" in p
        assert p["is_demo"] is True

def test_radar_stations():
    response = client.get("/api/radar")
    assert response.status_code == 200
    radars = response.json()
    assert len(radars) >= 3

def test_ai_models():
    response = client.get("/api/models")
    assert response.status_code == 200
    models = response.json()
    assert len(models) == 3
    assert models[0]["status"] == "VALIDATED"
