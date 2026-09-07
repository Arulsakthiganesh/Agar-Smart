/**
 * ESP32 Hardware Simulator Script for Smart Solar Agarbatti System
 * 
 * Simulates an ESP32 micro-controller posting real-time telemetry over HTTP/WebSocket 
 * when operating without physical hardware attached.
 * 
 * Usage: node scripts/simulate_esp32.js
 */

const http = require('http');

const API_HOST = process.env.API_HOST || 'localhost';
const API_PORT = process.env.API_PORT || 5000;
const MACHINE_ID = 'mch_solar_agarbatti_01';

console.log('====================================================');
console.log(' Starting ESP32 Agarbatti Hardware Simulator');
console.log(` Target Backend: http://${API_HOST}:${API_PORT}`);
console.log(` Simulated Machine ID: ${MACHINE_ID}`);
console.log(' Press Ctrl+C to stop simulation.');
console.log('====================================================\n');

// Simulated state variables
let temp = 34.0;
let humidity = 45.0;
let batteryPct = 95.0;
let batteryVolts = 25.4;
let solarVolts = 34.5;
let solarWatts = 195.0;
let cycleStage = 'DRYING';

// Simulated step loop every 5 seconds
setInterval(() => {
  // Simulate temperature rising gradually during drying
  if (temp < 48.0) {
    temp += (Math.random() * 0.8);
  } else {
    temp -= (Math.random() * 0.5);
  }

  // Simulate moisture dropping as sticks dry
  if (humidity > 18.0) {
    humidity -= (Math.random() * 0.7);
  }

  // Random fluctuation in solar power
  solarVolts = +(32.0 + Math.random() * 4.0).toFixed(1);
  solarWatts = +(solarVolts * (5.0 + Math.random())).toFixed(1);

  // Occasional slight battery drain if solar drops below threshold
  batteryPct = Math.max(15, +(batteryPct - 0.1).toFixed(1));
  batteryVolts = +(21.0 + (batteryPct / 100) * 8.4).toFixed(1);

  const payload = JSON.stringify({
    machineId: MACHINE_ID,
    userId: 'usr_demo_artisan',
    temperature: +temp.toFixed(1),
    humidity: +humidity.toFixed(1),
    batteryPercentage: batteryPct,
    batteryVoltage: batteryVolts,
    solarVoltage: solarVolts,
    solarWattage: solarWatts,
    smokeDetected: false,
    powerSource: solarVolts > 30 ? 'Solar' : 'Battery',
    timestamp: Date.now()
  });

  const options = {
    hostname: API_HOST,
    port: API_PORT,
    path: '/api/sensors/update',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
      // Mock authorization bearer token for simulator
      'Authorization': 'Bearer mock_simulator_token'
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log(`[${new Date().toLocaleTimeString()}] Sent Telemetry: Temp=${temp.toFixed(1)}°C, Hum=${humidity.toFixed(1)}%, Solar=${solarWatts}W | Response HTTP ${res.statusCode}`);
    });
  });

  req.on('error', (e) => {
    console.log(`[${new Date().toLocaleTimeString()}] Telemetry push error: ${e.message}`);
  });

  req.write(payload);
  req.end();
}, 5000);
