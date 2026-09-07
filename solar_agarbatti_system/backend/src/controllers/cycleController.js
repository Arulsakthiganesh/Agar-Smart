const { getDb } = require('../config/firebase');
const logger = require('../config/logger');

const localCycles = new Map();

const startCycle = async (req, res, next) => {
  try {
    const { machineId, targetTemp, targetHumidity, maxDuration } = req.body;
    const db = getDb();
    const cycleId = 'cyc_' + Date.now();
    const startTime = Date.now();

    const newCycle = {
      cycleId,
      machineId,
      targetTemp,
      targetHumidity,
      maxDurationMinutes: maxDuration,
      stage: 'Drying', // Stages: Drying -> Cooling -> Fragrance -> Packing
      progress: 0,
      startTime,
      endTime: null,
      status: 'RUNNING',
      metricsHistory: []
    };

    try {
      await db.ref(`cycles/${cycleId}`).set(newCycle);
      await db.ref(`machines/${machineId}`).update({
        currentCycle: cycleId,
        status: 'ACTIVE'
      });
      await db.ref(`cycles/${cycleId}/currentStage`).set('Drying');
    } catch (e) {
      logger.warn('Firebase cycle start store failed, using memory store');
    }
    localCycles.set(cycleId, newCycle);

    logger.info(`Started drying cycle ${cycleId} on machine ${machineId}`);

    res.status(201).json({
      success: true,
      cycleId,
      startTime
    });
  } catch (error) {
    next(error);
  }
};

const getCycle = async (req, res, next) => {
  try {
    const { cycleId } = req.params;
    const db = getDb();
    let cycle = null;

    try {
      const snapshot = await db.ref(`cycles/${cycleId}`).once('value');
      if (snapshot.exists()) {
        cycle = snapshot.val();
      }
    } catch (e) {
      logger.warn('Firebase fetch cycle failed, checking local memory');
    }

    if (!cycle) {
      cycle = localCycles.get(cycleId);
    }

    if (!cycle) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'CYCLE_NOT_FOUND',
          message: `Cycle with ID ${cycleId} not found`
        }
      });
    }

    const elapsedMs = Date.now() - cycle.startTime;
    const totalMs = cycle.maxDurationMinutes * 60 * 1000;
    const calculatedProgress = cycle.status === 'COMPLETED' ? 100 : Math.min(99, Math.round((elapsedMs / totalMs) * 100));
    const timeRemainingMinutes = cycle.status === 'COMPLETED' ? 0 : Math.max(0, Math.round((totalMs - elapsedMs) / 60000));

    res.status(200).json({
      success: true,
      cycleId: cycle.cycleId,
      stage: cycle.stage,
      progress: calculatedProgress,
      timeRemainingMinutes,
      status: cycle.status,
      metrics: {
        targetTemp: cycle.targetTemp,
        targetHumidity: cycle.targetHumidity,
        startTime: cycle.startTime,
        endTime: cycle.endTime
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateStage = async (req, res, next) => {
  try {
    const { cycleId } = req.params;
    const { stage, temperature, humidity, data } = req.body;
    const db = getDb();

    let cycle = localCycles.get(cycleId);

    try {
      await db.ref(`cycles/${cycleId}`).update({
        stage,
        lastTemperature: temperature,
        lastHumidity: humidity,
        lastUpdate: Date.now()
      });
      await db.ref(`cycles/${cycleId}/currentStage`).set(stage);
    } catch (e) {
      logger.warn('Firebase update stage failed');
    }

    if (cycle) {
      cycle.stage = stage;
      cycle.lastTemperature = temperature;
      cycle.lastHumidity = humidity;
    }

    logger.info(`Updated cycle ${cycleId} stage to ${stage}`);

    res.status(200).json({
      success: true,
      cycleId,
      stage
    });
  } catch (error) {
    next(error);
  }
};

const completeCycle = async (req, res, next) => {
  try {
    const { cycleId } = req.params;
    const { finalHumidity, packetsProduced, qualityScore, notes } = req.body;
    const db = getDb();

    const endTime = Date.now();
    let cycle = localCycles.get(cycleId);
    const startTime = cycle ? cycle.startTime : (endTime - 3600000);
    const durationMinutes = Math.round((endTime - startTime) / 60000);

    const summary = {
      cycleId,
      status: 'COMPLETED',
      stage: 'Packing',
      endTime,
      durationMinutes,
      finalHumidity,
      packetsProduced,
      qualityScore,
      notes: notes || 'Completed successfully'
    };

    try {
      await db.ref(`cycles/${cycleId}`).update(summary);
      if (cycle) {
        await db.ref(`machines/${cycle.machineId}`).update({
          currentCycle: null,
          status: 'IDLE'
        });
      }
    } catch (e) {
      logger.warn('Firebase complete cycle failed');
    }

    if (cycle) {
      Object.assign(cycle, summary);
    }

    logger.info(`Completed drying cycle ${cycleId}: ${packetsProduced} packets, score ${qualityScore}/10`);

    res.status(200).json({
      success: true,
      cycleId,
      duration: `${durationMinutes} minutes`,
      summary
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startCycle,
  getCycle,
  updateStage,
  completeCycle
};
