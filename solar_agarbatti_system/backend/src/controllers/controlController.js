const { getDb } = require('../config/firebase');
const logger = require('../config/logger');

const startDrying = async (req, res, next) => {
  try {
    const { machineId, targetTemp } = req.body;
    const db = getDb();
    const commandId = 'cmd_' + Date.now();

    const commandPayload = {
      commandId,
      action: 'START_DRYING',
      targetTemp,
      status: 'command_pending',
      timestamp: Date.now()
    };

    try {
      await db.ref(`control/${machineId}/command`).set(commandPayload);
      await db.ref(`machines/${machineId}`).update({ status: 'ACTIVE' });
    } catch (e) {
      logger.warn('Firebase set control command failed');
    }

    logger.info(`Command issued for machine ${machineId}: START_DRYING (Target: ${targetTemp}°C)`);

    res.status(200).json({
      success: true,
      commandId,
      message: 'Command broadcasted via Firebase for BLE pick up'
    });
  } catch (error) {
    next(error);
  }
};

const stopDrying = async (req, res, next) => {
  try {
    const { machineId } = req.body;
    const db = getDb();
    const commandId = 'cmd_' + Date.now();

    const commandPayload = {
      commandId,
      action: 'STOP',
      status: 'command_pending',
      timestamp: Date.now()
    };

    try {
      await db.ref(`control/${machineId}/command`).set(commandPayload);
      await db.ref(`machines/${machineId}`).update({ status: 'IDLE' });
    } catch (e) {
      logger.warn('Firebase set stop command failed');
    }

    logger.info(`Command issued for machine ${machineId}: STOP`);

    res.status(200).json({
      success: true,
      commandId
    });
  } catch (error) {
    next(error);
  }
};

const emergencyShutdown = async (req, res, next) => {
  try {
    const { machineId, reason } = req.body;
    const db = getDb();
    const commandId = 'cmd_emg_' + Date.now();
    const timestamp = Date.now();

    const commandPayload = {
      commandId,
      action: 'EMERGENCY_SHUTDOWN',
      reason,
      status: 'command_pending',
      timestamp
    };

    try {
      await db.ref(`control/${machineId}/command`).set(commandPayload);
      await db.ref(`machines/${machineId}`).update({ status: 'EMERGENCY_STOP' });
      await db.ref(`alerts/${machineId}/alt_${timestamp}`).set({
        alertId: `alt_${timestamp}`,
        machineId,
        type: 'EMERGENCY_SHUTDOWN',
        category: 'System',
        message: `EMERGENCY SHUTDOWN TRIGGERED: ${reason}`,
        severity: 'critical',
        createdAt: timestamp
      });
    } catch (e) {
      logger.warn('Firebase set emergency command failed');
    }

    logger.error(`EMERGENCY SHUTDOWN ON MACHINE ${machineId}: ${reason}`);

    res.status(200).json({
      success: true,
      timestamp,
      message: 'Emergency shutdown signal dispatched'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startDrying,
  stopDrying,
  emergencyShutdown
};
