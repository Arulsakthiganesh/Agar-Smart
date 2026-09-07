const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
const logger = require('./logger');

let isMockMode = false;

class MockDbRef {
  constructor(pathStr = '') {
    this.pathStr = pathStr;
  }
  ref(p) {
    return new MockDbRef(`${this.pathStr}/${p}`);
  }
  async set(val) { return true; }
  async update(val) { return true; }
  async remove() { return true; }
  async once() {
    return {
      exists: () => false,
      val: () => null
    };
  }
  orderByChild() { return this; }
  equalTo() { return this; }
  on() {}
}

let dbInstance = null;

function initFirebase() {
  if (process.env.NODE_ENV === 'test') {
    isMockMode = true;
    dbInstance = new MockDbRef();
    return { admin, db: dbInstance, isMockMode: true };
  }

  const saPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || path.join(__dirname, '../../config/firebase-service-account.json');
  const databaseURL = process.env.FIREBASE_DATABASE_URL || 'https://solar-agarbatti-default-rtdb.firebaseio.com/';

  try {
    if (fs.existsSync(saPath)) {
      if (admin.apps.length === 0) {
        const serviceAccount = require(saPath);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: databaseURL
        });
      }
      dbInstance = admin.database();
      logger.info('Firebase Admin initialized with service account.');
    } else {
      isMockMode = true;
      dbInstance = new MockDbRef();
      logger.warn(`Firebase service account not found at ${saPath}. Running in offline mock mode.`);
    }
  } catch (error) {
    isMockMode = true;
    dbInstance = new MockDbRef();
    logger.warn('Failed to initialize Firebase Admin SDK. Falling back to mock database.', error.message);
  }

  return { admin, db: dbInstance, isMockMode };
}

initFirebase();

module.exports = {
  admin,
  getDb: () => dbInstance || new MockDbRef(),
  isMockMode: () => isMockMode
};

