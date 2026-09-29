from datetime import datetime, timedelta
from typing import Dict, Any, List
from ai.models.nowcast_models import ThunderstormModel, LightningModel, StormMovementModel

class NowcastPredictorEngine:
    def __init__(self):
        self.ts_model = ThunderstormModel()
        self.lgt_model = LightningModel()
        self.mov_model = StormMovementModel()

    def run_nowcast(self, location_name: str, lat: float, lon: float, weather_features: Dict[str, Any], is_demo: bool = True) -> List[Dict[str, Any]]:
        ts_res = self.ts_model.predict(weather_features)
        lgt_features = {**weather_features, "thunderstorm_probability": ts_res["thunderstorm_probability"]}
        lgt_res = self.lgt_model.predict(lgt_features)
        mov_res = self.mov_model.predict(weather_features)

        base_ts_prob = ts_res["thunderstorm_probability"]
        base_lgt_prob = lgt_res["lightning_probability"]
        now = datetime.utcnow()

        predictions = []
        horizons = [15, 30, 45, 60]

        for h in horizons:
            # Multi-horizon temporal progression (convective storm decay/growth curve)
            factor = 1.0 + (0.08 if h <= 30 else -0.05 * (h - 30) / 15)
            h_ts_prob = round(min(0.98, max(0.05, base_ts_prob * factor)), 2)
            h_lgt_prob = round(min(0.95, max(0.02, base_lgt_prob * factor)), 2)

            # Determine Risk Level based on thresholds
            if h_ts_prob >= 0.88 and h_lgt_prob >= 0.80:
                risk_level = "CRITICAL"
            elif h_ts_prob >= 0.80 or h_lgt_prob >= 0.70:
                risk_level = "SEVERE"
            elif h_ts_prob >= 0.60 or h_lgt_prob >= 0.50:
                risk_level = "HIGH"
            elif h_ts_prob >= 0.35:
                risk_level = "MODERATE"
            else:
                risk_level = "LOW"

            predictions.append({
                "id": f"prd-{int(now.timestamp())}-{h}m-{int(lat*100)}",
                "location_name": location_name,
                "latitude": lat,
                "longitude": lon,
                "horizon_minutes": h,
                "thunderstorm_prob": h_ts_prob,
                "lightning_prob": h_lgt_prob,
                "risk_level": risk_level,
                "storm_direction": mov_res["direction_cardinal"],
                "storm_speed_kmh": mov_res["speed_kmh"],
                "confidence": ts_res["confidence"],
                "is_demo": is_demo,
                "created_at": now,
                "valid_until": now + timedelta(minutes=h)
            })

        return predictions
