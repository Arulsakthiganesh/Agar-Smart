const { getDb } = require('../config/firebase');
const logger = require('../config/logger');

const localPreferences = new Map();

const getPreferences = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const db = getDb();
    let prefs = null;

    try {
      const snapshot = await db.ref(`users/${userId}/preferences`).once('value');
      if (snapshot.exists()) {
        prefs = snapshot.val();
      }
    } catch (e) {
      logger.warn('Firebase fetch preferences failed');
    }

    if (!prefs) {
      prefs = localPreferences.get(userId) || {
        language: 'en',
        theme: 'dark',
        notificationSound: true,
        alertThresholds: {
          maxTemp: 60,
          minBattery: 20
        }
      };
    }

    res.status(200).json({
      success: true,
      userId,
      preferences: prefs
    });
  } catch (error) {
    next(error);
  }
};

const updatePreferences = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { language, theme, notificationSound, thresholds } = req.body;
    const db = getDb();

    const updatedPrefs = {
      language,
      theme,
      notificationSound,
      alertThresholds: thresholds,
      updatedAt: Date.now()
    };

    try {
      await db.ref(`users/${userId}/preferences`).set(updatedPrefs);
      await db.ref(`users/${userId}/language`).set(language);
    } catch (e) {
      logger.warn('Firebase update preferences failed');
    }
    localPreferences.set(userId, updatedPrefs);

    logger.info(`Updated preferences for user ${userId}: lang=${language}, theme=${theme}`);

    res.status(200).json({
      success: true,
      userId,
      preferences: updatedPrefs
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPreferences,
  updatePreferences
};
