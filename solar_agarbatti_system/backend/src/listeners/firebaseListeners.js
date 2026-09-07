const { getDb } = require('../config/firebase');
const logger = require('../config/logger');

function setupFirebaseListeners() {
  const db = getDb();
  if (!db) {
    logger.warn('Firebase DB connection not available for active listeners');
    return;
  }

  logger.info('Initializing Firebase Realtime DB listeners...');

  try {
    // 1. Listen to machine status updates
    db.ref('machines').on('child_changed', (snapshot) => {
      const machine = snapshot.val();
      logger.info(`[FB Listener] Machine ${snapshot.key} status updated: ${machine.status}`);
    });

    // 2. Listen to latest sensor readings
    db.ref('sensors').on('child_changed', (snapshot) => {
      const latestSensorData = snapshot.val() ? snapshot.val().latest : null;
      if (latestSensorData) {
        logger.info(`[FB Listener] Sensor updated for ${snapshot.key}: Temp=${latestSensorData.temperature}°C`);
      }
    });

    // 3. Listen to cycle stage updates
    db.ref('cycles').on('child_changed', (snapshot) => {
      const cycle = snapshot.val();
      if (cycle && cycle.currentStage) {
        logger.info(`[FB Listener] Cycle ${snapshot.key} changed stage to: ${cycle.currentStage}`);
      }
    });

    // 4. Listen to new active alerts
    db.ref('alerts').on('child_added', (snapshot) => {
      logger.warn(`[FB Listener] New active alert for machine: ${snapshot.key}`);
    });

    // 5. Listen to control commands queued for BLE
    db.ref('control').on('child_changed', (snapshot) => {
      const command = snapshot.val() ? snapshot.val().command : null;
      if (command && command.status === 'command_pending') {
        logger.info(`[FB Listener] Pending BLE command for machine ${snapshot.key}: ${command.action}`);
      }
    });

    logger.info('All Firebase Realtime DB listeners successfully registered.');
  } catch (err) {
    logger.error('Error setting up Firebase listeners:', err);
  }
}

module.exports = { setupFirebaseListeners };
