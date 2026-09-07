const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const sensorController = require('../controllers/sensorController');
const machineController = require('../controllers/machineController');
const cycleController = require('../controllers/cycleController');
const controlController = require('../controllers/controlController');
const alertController = require('../controllers/alertController');
const analyticsController = require('../controllers/analyticsController');
const userController = require('../controllers/userController');

const { authenticateToken } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

// ==========================================
// 1. AUTHENTICATION ENDPOINTS
// ==========================================
router.post('/auth/register', validate(schemas.register), authController.register);
router.post('/auth/login', validate(schemas.login), authController.login);
router.post('/auth/refresh', validate(schemas.refreshToken), authController.refresh);

// ==========================================
// 2. REAL-TIME SENSOR DATA ENDPOINTS
// ==========================================
router.post('/sensors/update', authenticateToken, validate(schemas.sensorUpdate), sensorController.updateSensors);

// ==========================================
// 3. MACHINE MANAGEMENT ENDPOINTS
// ==========================================
router.post('/machines/register', authenticateToken, validate(schemas.machineRegister), machineController.registerMachine);
router.get('/machines/:machineId', authenticateToken, machineController.getMachine);
router.get('/machines/user/:userId/all', authenticateToken, machineController.getUserMachines);

// ==========================================
// 4. DRYING CYCLE ENDPOINTS
// ==========================================
router.post('/cycles/start', authenticateToken, validate(schemas.cycleStart), cycleController.startCycle);
router.get('/cycles/:cycleId', authenticateToken, cycleController.getCycle);
router.post('/cycles/:cycleId/update-stage', authenticateToken, validate(schemas.cycleUpdateStage), cycleController.updateStage);
router.post('/cycles/:cycleId/complete', authenticateToken, validate(schemas.cycleComplete), cycleController.completeCycle);

// ==========================================
// 5. SYSTEM CONTROL ENDPOINTS
// ==========================================
router.post('/control/start-drying', authenticateToken, validate(schemas.controlStartDrying), controlController.startDrying);
router.post('/control/stop', authenticateToken, validate(schemas.controlStop), controlController.stopDrying);
router.post('/control/emergency-shutdown', authenticateToken, validate(schemas.emergencyShutdown), controlController.emergencyShutdown);

// ==========================================
// 6. ALERT SYSTEM ENDPOINTS
// ==========================================
router.post('/alerts/create', authenticateToken, validate(schemas.createAlert), alertController.createAlert);
router.get('/alerts/:machineId/pending', authenticateToken, alertController.getPendingAlerts);
router.post('/alerts/:alertId/acknowledge', authenticateToken, alertController.acknowledgeAlert);

// ==========================================
// 7. ANALYTICS & REPORTING ENDPOINTS
// ==========================================
router.get('/analytics/:machineId/daily', authenticateToken, analyticsController.getDailyAnalytics);
router.get('/analytics/:machineId/trends', authenticateToken, analyticsController.getTrendsAnalytics);

// ==========================================
// 8. USER PREFERENCES ENDPOINTS
// ==========================================
router.get('/user/:userId/preferences', authenticateToken, userController.getPreferences);
router.put('/user/:userId/preferences', authenticateToken, validate(schemas.userPreferences), userController.updatePreferences);

module.exports = router;
