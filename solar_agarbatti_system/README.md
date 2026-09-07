# Smart Solar-Powered Agarbatti Drying & Packaging System

An end-to-end IoT real-time monitoring and control dashboard connecting rural women Self Help Group (SHG) artisans with IoT solar drying hardware.

## System Architecture

```
 [ ESP32 IoT Sensors & Hardware ]
   - DHT22 (Temp & Moisture)
   - MQ-2 (Smoke Alarm)
   - INA219 (Battery Voltage)
   - ADS1115 (Solar Panel ADC)
   - PWM Fan / Heater / Pump Relays
         │
         │ (Bluetooth Low Energy / BLE)
         ▼
 [ Flutter Mobile App ]  ◀───▶  [ Real-Time Web Dashboard ]
 (iOS / Android)               (HTML5/CSS3 Glassmorphism/Chart.js)
         │                                 │
         │ (REST API & Realtime DB)        │ (REST API & WebSockets)
         └────────────────┬────────────────┘
                          ▼
 [ Node.js Backend API (Express + Firebase Admin) ]
   - JWT Auth & Refresh Tokens
   - Sensor Data Validation (20-60°C bounds check)
   - Winston Structured Logger
   - Rate Limiter & Security Headers
         │
         ▼
 [ Firebase Realtime Database ]
   - `/machines/{machineId}`
   - `/sensors/{machineId}/latest`
   - `/cycles/{cycleId}`
   - `/alerts/{machineId}`
   - `/users/{userId}`
   - `/analytics/{machineId}/daily`
```

---

## Hardware Pinout (ESP32)

| Component | ESP32 Pin | Function |
|---|---|---|
| **DHT22** | GPIO 4 | Temperature & Humidity Sensor |
| **MQ-2** | GPIO 34 | Analog Smoke Sensor Input |
| **PWM Fan** | GPIO 25 | Airflow Speed Control (PWM Channel 0) |
| **Heater Relay** | GPIO 26 | Heating Chamber Relay |
| **Fragrance Pump** | GPIO 27 | Fragrance Spray Actuator |
| **Packaging Motor** | GPIO 14 | Agarbatti Packaging Motor Relay |
| **Buzzer** | GPIO 12 | Emergency Audio Alarm |
| **I2C SDA / SCL** | GPIO 21 / 22 | INA219 Battery & ADS1115 Solar Sensor Bus |

---

## Getting Started

### 1. Node.js Backend API
```bash
cd backend
npm install
npm test       # Run automated Jest unit tests
npm start      # Starts server on http://localhost:5000
```

### 2. Real-Time Web Monitoring Dashboard
```bash
cd web_dashboard
npm install
npm start      # Starts web dashboard on http://localhost:3000
```

### 3. Flutter Mobile Application
```bash
cd flutter_app
flutter pub get
flutter run
```

### 4. ESP32 Firmware
1. Open `esp32_firmware/Agarbatti_Solar_System.ino` in Arduino IDE.
2. Install dependencies: `DHT sensor library`, `Adafruit INA219`, `Adafruit ADS1X15`.
3. Select board `ESP32 Dev Module` and flash to device.

---

## Key Safety & Accessibility Features

- **High-Contrast Rural Typography**: Built specifically with minimum 16pt font sizes for readability in field conditions.
- **Regional Languages**: Native English, Tamil (`ta`), and Hindi (`hi`) translation support.
- **Dual-Layer Offline Resilience**: ESP32 stores up to 100 historical readings in EEPROM during disconnection; Flutter mobile app queues pending updates to local SQLite until cloud sync restores.
- **Overheat & Smoke Safety Shutdown**: Hardware and backend auto-trip all heating elements if chamber temperature exceeds 60°C or smoke is detected.
