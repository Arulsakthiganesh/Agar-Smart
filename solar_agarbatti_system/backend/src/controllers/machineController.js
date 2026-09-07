const { getDb } = require('../config/firebase');
const logger = require('../config/logger');

const localMachines = new Map();

const registerMachine = async (req, res, next) => {
  try {
    const { userId, machineName, location, serialNumber } = req.body;
    const db = getDb();
    const machineId = 'mch_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);

    const newMachine = {
      machineId,
      userId,
      machineName,
      location,
      serialNumber,
      status: 'IDLE',
      lastUpdate: Date.now(),
      currentCycle: null,
      createdAt: Date.now()
    };

    try {
      await db.ref(`machines/${machineId}`).set(newMachine);
      await db.ref(`users/${userId}/machines/${machineId}`).set(true);
    } catch (e) {
      logger.warn('Firebase store failed, saving machine locally');
    }
    localMachines.set(machineId, newMachine);

    logger.info(`Registered new machine ${machineId} for user ${userId}`);

    res.status(201).json({
      success: true,
      machineId,
      machine: newMachine
    });
  } catch (error) {
    next(error);
  }
};

const getMachine = async (req, res, next) => {
  try {
    const { machineId } = req.params;
    const db = getDb();
    let machine = null;

    try {
      const snapshot = await db.ref(`machines/${machineId}`).once('value');
      if (snapshot.exists()) {
        machine = snapshot.val();
      }
    } catch (e) {
      logger.warn('Firebase fetch machine failed, checking local memory');
    }

    if (!machine) {
      machine = localMachines.get(machineId);
    }

    if (!machine) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'MACHINE_NOT_FOUND',
          message: `Machine with ID ${machineId} not found`
        }
      });
    }

    res.status(200).json({
      success: true,
      machineId: machine.machineId,
      status: machine.status || 'ACTIVE',
      lastUpdate: machine.lastUpdate || Date.now(),
      currentCycle: machine.currentCycle || null,
      details: machine
    });
  } catch (error) {
    next(error);
  }
};

const getUserMachines = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const db = getDb();
    const result = [];

    try {
      const snapshot = await db.ref('machines').orderByChild('userId').equalTo(userId).once('value');
      if (snapshot.exists()) {
        const val = snapshot.val();
        Object.values(val).forEach((m) => {
          result.push({
            machineId: m.machineId,
            name: m.machineName,
            status: m.status || 'ACTIVE',
            location: m.location,
            lastUpdate: m.lastUpdate
          });
        });
      }
    } catch (e) {
      logger.warn('Firebase fetch user machines failed, checking local memory');
    }

    if (result.length === 0) {
      for (const m of localMachines.values()) {
        if (m.userId === userId) {
          result.push({
            machineId: m.machineId,
            name: m.machineName,
            status: m.status || 'ACTIVE',
            location: m.location,
            lastUpdate: m.lastUpdate
          });
        }
      }
    }

    // Default sample machine if user has none for fast demo setup
    if (result.length === 0) {
      const demoMachine = {
        machineId: 'mch_solar_agarbatti_01',
        name: 'SHG Solar Agarbatti Dryer #1',
        status: 'ACTIVE',
        location: 'Madurai SHG Hub',
        lastUpdate: Date.now()
      };
      result.push(demoMachine);
      localMachines.set(demoMachine.machineId, { ...demoMachine, userId });
    }

    res.status(200).json({
      success: true,
      machines: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerMachine,
  getMachine,
  getUserMachines
};
