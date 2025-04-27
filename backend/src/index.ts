import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import logger from './utils/logger';
import initializeDatabase from './utils/db-init';

const PORT = process.env.PORT || 4000;

// Start the server after initializing the database
const startServer = async () => {
  try {
    // Initialize database (run migrations and seeds)
    const dbInitialized = await initializeDatabase();
    if (!dbInitialized) {
      logger.error('Failed to initialize the database. Exiting...');
      process.exit(1);
    }

    // Start the server
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`API is available at http://localhost:${PORT}${process.env.API_PREFIX || '/api'}`);
    });
  } catch (error) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();

// Handle uncaught exceptions
process.on('uncaughtException', error => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
