# API Documentation - Solar Agarbatti Monitoring System

Base URL: `http://localhost:5000/api`

---

## 1. Authentication Endpoints

### Register User
- **POST** `/auth/register`
- **Request Body**:
```json
{
  "name": "Lakshmi Devi",
  "email": "lakshmi@shg.org",
  "password": "Password123",
  "phone": "+919876543210",
  "shgName": "Annai Women SHG",
  "location": "Madurai, Tamil Nadu",
  "language": "ta"
}
```
- **Response**:
```json
{
  "success": true,
  "userId": "usr_1788490638016_g3nhn",
  "token": "eyJhbGciOiJIUzI1Ni...",
  "refreshToken": "eyJhbGciOiJIUzI1Ni..."
}
```

### Login User
- **POST** `/auth/login`
- **Request Body**:
```json
{
  "email": "lakshmi@shg.org",
  "password": "Password123"
}
```

---

## 2. Real-Time Telemetry Endpoints

### Ingest Sensor Metrics
- **POST** `/sensors/update`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "machineId": "mch_solar_agarbatti_01",
  "userId": "usr_1788490638016_g3nhn",
  "temperature": 38.5,
  "humidity": 24.2,
  "batteryPercentage": 88,
  "batteryVoltage": 25.4,
  "solarVoltage": 34.2,
  "solarWattage": 180,
  "smokeDetected": false,
  "powerSource": "Solar",
  "timestamp": 1788490638000
}
```
- **Response**:
```json
{
  "success": true,
  "sensorId": "sns_1788490638000",
  "alertsTriggered": 0
}
```

---

## 3. Drying Cycle Management

### Start Cycle
- **POST** `/cycles/start`
- **Request Body**:
```json
{
  "machineId": "mch_solar_agarbatti_01",
  "targetTemp": 45,
  "targetHumidity": 20,
  "maxDuration": 45
}
```

### Complete Cycle
- **POST** `/cycles/:cycleId/complete`
- **Request Body**:
```json
{
  "finalHumidity": 18.5,
  "packetsProduced": 450,
  "qualityScore": 9.5,
  "notes": "Excellent fragrance retention"
}
```

---

## 4. Control Commands

### Emergency Shutdown
- **POST** `/control/emergency-shutdown`
- **Request Body**:
```json
{
  "machineId": "mch_solar_agarbatti_01",
  "reason": "Overheat alert or manual artisan trigger"
}
```
