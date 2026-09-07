const { getDb } = require('../config/firebase');
const logger = require('../config/logger');

const updateSensors = async (req, res, next) => {
  try {
    const {
      machineId,
      userId,
      temperature,
      humidity,
      batteryPercentage,
      batteryVoltage,
      solarVoltage,
      solarWattage,
      smokeDetected,
      powerSource,
      timestamp
    } = req.body;

    const db = getDb();
    const sensorId = 'sns_' + Date.now();

    const sensorData = {
      sensorId,
      machineId,
      userId,
      temperature,
      humidity,
      batteryPercentage,
      batteryVoltage,
      solarVoltage,
      solarWattage,
      smokeDetected,
      powerSource,
      timestamp: timestamp || Date.now()
    };

    // Save to Firebase Realtime DB
    try {
      await db.ref(`sensors/${machineId}/latest`).set(sensorData);
      await db.ref(`sensors/${machineId}/history/${sensorId}`).set(sensorData);
      await db.ref(`machines/${machineId}`).update({
        lastUpdate: Date.now(),
        status: smokeDetected ? 'ERROR' : (temperature > 60 ? 'WARNING' : 'ACTIVE')
      });
    } catch (e) {
      logger.warn('Firebase sensor update store failed, working in offline/standalone mode');
    }

    // Safety checks & Alert triggering
    const alertsToCreate = [];

    if (temperature > 60) {
      alertsToCreate.push({
        alertId: 'alt_' + Date.now() + '_temp',
        machineId,
        type: 'TEMP_HIGH',
        category: 'Temperature',
        message: `High temperature warning: ${temperature}°C exceeds maximum threshold (60°C)`,
        severity: 'critical',
        createdAt: Date.now()
      });
    } else if (temperature < 20) {
      alertsToCreate.push({
        alertId: 'alt_' + Date.now() + '_temp_low',
        machineId,
        type: 'TEMP_LOW',
        category: 'Temperature',
        message: `Low temperature alert: ${temperature}°C is below minimum drying threshold (20°C)`,
        severity: 'warning',
        createdAt: Date.now()
      });
    }

    if (smokeDetected) {
      alertsToCreate.push({
        alertId: 'alt_' + Date.now() + '_smoke',
        machineId,
        type: 'SMOKE_DETECTED',
        category: 'Smoke',
        message: 'CRITICAL: Smoke detected in drying chamber! Emergency shutdown engaged.',
        severity: 'critical',
        createdAt: Date.now()
      });
    }

    if (batteryPercentage < 20 && powerSource === 'Battery') {
      alertsToCreate.push({
        alertId: 'alt_' + Date.now() + '_bat',
        machineId,
        type: 'BATTERY_LOW',
        category: 'Battery',
        message: `Battery low (${batteryPercentage}%). Please connect solar or backup grid power.`,
        severity: 'warning',
        createdAt: Date.now()
      });
    }

    // Save alerts to Firebase if present
    for (const alert of alertsToCreate) {
      try {
        await db.ref(`alerts/${machineId}/${alert.alertId}`).set(alert);
        await db.ref(`alerts/${machineId}/active/${alert.alertId}`).set(alert);
      } catch (err) {
        logger.error('Failed to create alert in Firebase:', err);
      }
    }

    logger.info(`Sensor update processed for machine ${machineId}: Temp=${temperature}°C, Humidity=${humidity}%, Bat=${batteryPercentage}%`);

    res.status(200).json({
      success: true,
      sensorId,
      alertsTriggered: alertsToCreate.length
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateSensors
};
