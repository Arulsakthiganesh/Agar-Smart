const { getDb } = require('../config/firebase');
const logger = require('../config/logger');

const localAlerts = new Map();

const createAlert = async (req, res, next) => {
  try {
    const { machineId, type, category, message, severity } = req.body;
    const db = getDb();
    const alertId = 'alt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    const createdAt = Date.now();

    const alertData = {
      alertId,
      machineId,
      type,
      category,
      message,
      severity,
      acknowledged: false,
      createdAt
    };

    try {
      await db.ref(`alerts/${machineId}/${alertId}`).set(alertData);
      await db.ref(`alerts/${machineId}/active/${alertId}`).set(alertData);
    } catch (e) {
      logger.warn('Firebase alert create store failed');
    }
    localAlerts.set(alertId, alertData);

    logger.warn(`Alert created for machine ${machineId}: [${severity.toUpperCase()}] ${message}`);

    res.status(201).json({
      success: true,
      alertId,
      alert: alertData
    });
  } catch (error) {
    next(error);
  }
};

const getPendingAlerts = async (req, res, next) => {
  try {
    const { machineId } = req.params;
    const db = getDb();
    const result = [];

    try {
      const snapshot = await db.ref(`alerts/${machineId}/active`).once('value');
      if (snapshot.exists()) {
        const val = snapshot.val();
        Object.values(val).forEach((alt) => {
          if (!alt.acknowledged) {
            result.push({
              alertId: alt.alertId,
              type: alt.type,
              category: alt.category,
              message: alt.message,
              severity: alt.severity,
              createdAt: alt.createdAt
            });
          }
        });
      }
    } catch (e) {
      logger.warn('Firebase fetch pending alerts failed');
    }

    if (result.length === 0) {
      for (const alt of localAlerts.values()) {
        if (alt.machineId === machineId && !alt.acknowledged) {
          result.push({
            alertId: alt.alertId,
            type: alt.type,
            category: alt.category,
            message: alt.message,
            severity: alt.severity,
            createdAt: alt.createdAt
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      alerts: result
    });
  } catch (error) {
    next(error);
  }
};

const acknowledgeAlert = async (req, res, next) => {
  try {
    const { alertId } = req.params;
    const db = getDb();

    let foundMachineId = null;

    for (const alt of localAlerts.values()) {
      if (alt.alertId === alertId) {
        alt.acknowledged = true;
        foundMachineId = alt.machineId;
        break;
      }
    }

    try {
      if (foundMachineId) {
        await db.ref(`alerts/${foundMachineId}/active/${alertId}`).remove();
        await db.ref(`alerts/${foundMachineId}/${alertId}`).update({
          acknowledged: true,
          acknowledgedAt: Date.now()
        });
      }
    } catch (e) {
      logger.warn('Firebase remove active alert failed');
    }

    logger.info(`Acknowledged alert ${alertId}`);

    res.status(200).json({
      success: true,
      alertId,
      message: 'Alert acknowledged successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAlert,
  getPendingAlerts,
  acknowledgeAlert
};
