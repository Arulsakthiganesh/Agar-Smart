const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../config/firebase');
const logger = require('../config/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_agarbatti_2026_solar_app';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'super_secret_refresh_key_agarbatti_2026_solar_app';

// Local memory fallback cache for offline or dev mock DB mode
const localUsersDb = new Map();

const generateTokens = (user) => {
  const payload = { userId: user.userId, email: user.email, shgName: user.shgName };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { token, refreshToken };
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, shgName, location, language } = req.body;
    const db = getDb();

    // Check duplicate email
    let userExists = false;
    try {
      const snapshot = await db.ref('users').orderByChild('email').equalTo(email.toLowerCase()).once('value');
      userExists = snapshot.exists();
    } catch (e) {
      // Fallback local check
      for (const u of localUsersDb.values()) {
        if (u.email === email.toLowerCase()) {
          userExists = true;
          break;
        }
      }
    }

    if (userExists) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'An account with this email already exists'
        }
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userId = 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);

    const newUser = {
      userId,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      shgName,
      location,
      language: language || 'en',
      createdAt: Date.now()
    };

    // Save to Firebase Realtime Database
    try {
      await db.ref(`users/${userId}`).set(newUser);
    } catch (e) {
      logger.warn('Firebase save failed, falling back to local memory DB');
    }
    localUsersDb.set(userId, newUser);

    const { token, refreshToken } = generateTokens(newUser);

    logger.info(`User registered successfully: ${email} (${userId})`);

    res.status(201).json({
      success: true,
      userId,
      token,
      refreshToken,
      user: {
        userId,
        name: newUser.name,
        email: newUser.email,
        shgName: newUser.shgName,
        location: newUser.location,
        language: newUser.language
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const db = getDb();
    let user = null;

    try {
      const snapshot = await db.ref('users').orderByChild('email').equalTo(email.toLowerCase()).once('value');
      if (snapshot.exists()) {
        const val = snapshot.val();
        user = Object.values(val)[0];
      }
    } catch (e) {
      logger.warn('Firebase query failed, checking local memory DB');
    }

    if (!user) {
      for (const u of localUsersDb.values()) {
        if (u.email === email.toLowerCase()) {
          user = u;
          break;
        }
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }

    const { token, refreshToken } = generateTokens(user);

    logger.info(`User logged in: ${email}`);

    res.status(200).json({
      success: true,
      userId: user.userId,
      token,
      refreshToken,
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        shgName: user.shgName,
        location: user.location,
        language: user.language || 'en'
      }
    });
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'INVALID_REFRESH_TOKEN',
            message: 'Refresh token is invalid or expired'
          }
        });
      }

      const newToken = jwt.sign(
        { userId: decoded.userId, email: decoded.email, shgName: decoded.shgName },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(200).json({
        success: true,
        token: newToken
      });
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refresh
};
