import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../backend")))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import unittest
import app.models.entities
from app.database.session import SessionLocal, Base, engine
from app.api.router import (
    get_system_health, get_dashboard_summary, get_latest_predictions,
    get_radar_stations, get_ai_models
)
from app.db_init import init_db

class TestStormcastBackend(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        try:
            init_db(db)
        finally:
            db.close()

    def setUp(self):
        self.db = SessionLocal()

    def tearDown(self):
        self.db.close()

    def test_system_health(self):
        health = get_system_health()
        self.assertEqual(health["api_status"], "ONLINE")
        self.assertEqual(health["database_status"], "ONLINE")
        self.assertIn("cpu_usage_pct", health)

    def test_dashboard_summary(self):
        summary = get_dashboard_summary(db=self.db)
        self.assertGreaterEqual(summary["active_storm_cells_count"], 1)
        self.assertIn(summary["data_mode"], ["DEMO", "REAL"])

    def test_latest_predictions(self):
        preds = get_latest_predictions(db=self.db)
        self.assertIsInstance(preds, list)
        self.assertGreaterEqual(len(preds), 1)

    def test_radar_stations(self):
        radars = get_radar_stations(db=self.db)
        self.assertGreaterEqual(len(radars), 3)

    def test_ai_models(self):
        models = get_ai_models()
        self.assertEqual(len(models), 3)
        self.assertEqual(models[0]["status"], "VALIDATED")

if __name__ == "__main__":
    unittest.main()
