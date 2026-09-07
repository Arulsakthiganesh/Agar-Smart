const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: errorMessage
        }
      });
    }
    next();
  };
};

// Common validation schemas
const schemas = {
  register: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long'
    }),
    phone: Joi.string().required(),
    shgName: Joi.string().required(),
    location: Joi.string().required(),
    language: Joi.string().valid('en', 'ta', 'hi').default('en')
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  refreshToken: Joi.object({
    refreshToken: Joi.string().required()
  }),

  sensorUpdate: Joi.object({
    machineId: Joi.string().required(),
    userId: Joi.string().required(),
    temperature: Joi.number().min(-10).max(100).required(),
    humidity: Joi.number().min(0).max(100).required(),
    batteryPercentage: Joi.number().min(0).max(100).required(),
    batteryVoltage: Joi.number().min(0).max(50).required(),
    solarVoltage: Joi.number().min(0).max(100).required(),
    solarWattage: Joi.number().min(0).max(500).required(),
    smokeDetected: Joi.boolean().required(),
    powerSource: Joi.string().valid('Solar', 'Battery', 'Grid').required(),
    timestamp: Joi.number().required().custom((value, helpers) => {
      const now = Date.now();
      // Allow up to 1 min old or max 1 min in future
      if (Math.abs(now - value) > 60000) {
        return helpers.message('Timestamp must be recent (not older than 1 minute)');
      }
      return value;
    })
  }),

  machineRegister: Joi.object({
    userId: Joi.string().required(),
    machineName: Joi.string().required(),
    location: Joi.string().required(),
    serialNumber: Joi.string().required()
  }),

  cycleStart: Joi.object({
    machineId: Joi.string().required(),
    targetTemp: Joi.number().min(20).max(60).required(),
    targetHumidity: Joi.number().min(0).max(100).required(),
    maxDuration: Joi.number().positive().required()
  }),

  cycleUpdateStage: Joi.object({
    stage: Joi.string().valid('Drying', 'Cooling', 'Fragrance', 'Packing').required(),
    temperature: Joi.number().required(),
    humidity: Joi.number().required(),
    data: Joi.object().optional()
  }),

  cycleComplete: Joi.object({
    finalHumidity: Joi.number().min(0).max(100).required(),
    packetsProduced: Joi.number().min(0).required(),
    qualityScore: Joi.number().min(1).max(10).required(),
    notes: Joi.string().allow('', null)
  }),

  controlStartDrying: Joi.object({
    machineId: Joi.string().required(),
    targetTemp: Joi.number().min(20).max(60).required()
  }),

  controlStop: Joi.object({
    machineId: Joi.string().required()
  }),

  emergencyShutdown: Joi.object({
    machineId: Joi.string().required(),
    reason: Joi.string().required()
  }),

  createAlert: Joi.object({
    machineId: Joi.string().required(),
    type: Joi.string().required(),
    category: Joi.string().valid('Temperature', 'Humidity', 'Smoke', 'Battery', 'System').required(),
    message: Joi.string().required(),
    severity: Joi.string().valid('critical', 'warning', 'info').required()
  }),

  userPreferences: Joi.object({
    language: Joi.string().valid('en', 'ta', 'hi').required(),
    theme: Joi.string().valid('light', 'dark', 'system').required(),
    notificationSound: Joi.boolean().required(),
    thresholds: Joi.object({
      maxTemp: Joi.number().default(60),
      minBattery: Joi.number().default(20)
    }).required()
  })
};

module.exports = {
  validate,
  schemas
};
