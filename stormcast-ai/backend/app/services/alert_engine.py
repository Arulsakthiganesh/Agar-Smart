from datetime import datetime, timedelta
import uuid
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.entities import Alert

class AlertEngine:
    def __init__(self, db: Session):
        self.db = db

    def evaluate_and_generate_alerts(self, predictions: List[Dict[str, Any]]) -> List[Alert]:
        generated_alerts = []
        now = datetime.utcnow()

        for pred in predictions:
            ts_prob = pred.get("thunderstorm_prob", 0.0)
            lgt_prob = pred.get("lightning_prob", 0.0)
            conf = pred.get("confidence", 0.0)
            loc_name = pred.get("location_name", "Unknown Area")
            lat = pred.get("latitude", 0.0)
            lon = pred.get("longitude", 0.0)
            is_demo = pred.get("is_demo", True)

            # Check if active unexpired alert already exists for location to suppress duplicates
            existing = self.db.query(Alert).filter(
                Alert.location_name == loc_name,
                Alert.status == "ACTIVE",
                Alert.expires_at > now
            ).first()

            severity = None
            category = "THUNDERSTORM"
            message = ""
            action = ""

            if ts_prob >= 0.90 and lgt_prob >= 0.80 and conf >= 0.70:
                severity = "CRITICAL" if lgt_prob >= 0.85 else "SEVERE"
                message = f"Critical severe convective thunderstorm with high lightning activity approaching {loc_name} within 30 minutes."
                action = "Issue immediate public warning, activate local emergency response center, recommend seeking indoor shelter."
            elif ts_prob >= 0.80 and conf >= 0.70:
                severity = "HIGH"
                message = f"High probability of severe thunderstorm initiation near {loc_name}."
                action = "Alert civil defense authorities, monitor live radar and satellite feeds closely."
            elif ts_prob >= 0.60 or lgt_prob >= 0.60:
                severity = "MODERATE"
                message = f"Moderate lightning & thunderstorm risk detected for {loc_name}."
                action = "Notify local weather safety officer and airport control."

            if severity:
                if existing:
                    # Update existing alert severity if escalated
                    if self._severity_rank(severity) > self._severity_rank(existing.severity):
                        existing.severity = severity
                        existing.message = message
                        existing.expires_at = now + timedelta(hours=2)
                        self.db.commit()
                        self.db.refresh(existing)
                        generated_alerts.append(existing)
                else:
                    code = f"ALT-IMD-{int(now.timestamp())}-{random_code()}"
                    alert = Alert(
                        id=str(uuid.uuid4()),
                        alert_code=code,
                        category=category,
                        severity=severity,
                        location_name=loc_name,
                        latitude=lat,
                        longitude=lon,
                        thunderstorm_prob=ts_prob,
                        lightning_prob=lgt_prob,
                        confidence=conf,
                        message=message,
                        recommended_action=action,
                        status="ACTIVE",
                        is_demo=is_demo,
                        created_at=now,
                        expires_at=now + timedelta(hours=2)
                    )
                    self.db.add(alert)
                    self.db.commit()
                    self.db.refresh(alert)
                    generated_alerts.append(alert)

        return generated_alerts

    def _severity_rank(self, sev: str) -> int:
        ranks = {"LOW": 1, "MODERATE": 2, "HIGH": 3, "SEVERE": 4, "CRITICAL": 5}
        return ranks.get(sev.upper(), 0)

def random_code() -> str:
    import random
    return f"{random.randint(100, 999)}"
