require('dotenv').config();
const app = require('./app');
const logger = require('./config/logger');
const { setupFirebaseListeners } = require('./listeners/firebaseListeners');

const PORT = process.env.PORT || 5000;

// Initialize Realtime Database listeners
setupFirebaseListeners();

const server = app.listen(PORT, () => {
  logger.info(`=======================================================`);
  logger.info(`Solar Agarbatti Drying & Packaging System API Running`);
  logger.info(`Environment : ${process.env.NODE_ENV || 'development'}`);
  logger.info(`Server Port : ${PORT}`);
  logger.info(`Health Check: http://localhost:${PORT}/health`);
  logger.info(`=======================================================`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received. Shutting down HTTP server gracefully...');
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
