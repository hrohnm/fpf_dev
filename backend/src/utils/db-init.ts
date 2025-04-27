import { sequelize } from '../models';
import logger from './logger';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

/**
 * Initialize the database by running migrations and seeds
 */
export const initializeDatabase = async (): Promise<boolean> => {
  try {
    logger.info('Initializing database...');
    
    // Check if database exists and is accessible
    try {
      await sequelize.authenticate();
      logger.info('Database connection established successfully.');
    } catch (error) {
      logger.error('Unable to connect to the database:', error);
      return false;
    }
    
    // Run migrations
    logger.info('Running database migrations...');
    try {
      await execPromise('npx sequelize-cli db:migrate');
      logger.info('Migrations completed successfully.');
    } catch (error) {
      logger.error('Error running migrations:', error);
      return false;
    }
    
    // Check if we need to seed the database
    const shouldSeed = process.env.DB_SEED === 'true';
    if (shouldSeed) {
      logger.info('Seeding database with initial data...');
      try {
        await execPromise('npx sequelize-cli db:seed:all');
        logger.info('Database seeding completed successfully.');
      } catch (error) {
        logger.error('Error seeding database:', error);
        return false;
      }
    }
    
    logger.info('Database initialization completed successfully.');
    return true;
  } catch (error) {
    logger.error('Database initialization failed:', error);
    return false;
  }
};

export default initializeDatabase;
