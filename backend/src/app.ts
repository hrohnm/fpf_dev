import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import path from 'path';
import rateLimit from 'express-rate-limit';

import apiRoutes from './api';
import { errorMiddleware } from './middlewares/error.middleware';
import logger from './utils/logger';

// Create Express app
const app = express();

// Set up middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Request logging
app.use(
  morgan(process.env.LOG_FORMAT || 'dev', {
    stream: {
      write: message => logger.http(message.trim()),
    },
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API routes
const apiPrefix = process.env.API_PREFIX || '/api';
app.use(apiPrefix, apiRoutes);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mock dashboard data endpoint for testing
app.get(`${apiPrefix}/admin/dashboard`, (_req: Request, res: Response) => {
  res.status(200).json({
    totalFacilities: 25,
    totalCarriers: 8,
    totalAvailablePlaces: 47,
    occupancyRate: 78.5,
    recentUpdates: [
      {
        facilityId: '123e4567-e89b-12d3-a456-426614174020',
        facilityName: 'Beispieleinrichtung',
        categoryId: '123e4567-e89b-12d3-a456-426614174050',
        categoryName: 'Heimerziehung (§ 34 SGB VIII)',
        availablePlaces: 3,
        lastUpdated: new Date().toISOString()
      }
    ]
  });
});

// Mock dashboard data endpoint for carrier
app.get(`${apiPrefix}/carrier/dashboard`, (_req: Request, res: Response) => {
  res.status(200).json({
    totalFacilities: 5,
    totalAvailablePlaces: 12,
    occupancyRate: 65.7,
    recentUpdates: [
      {
        facilityId: '123e4567-e89b-12d3-a456-426614174020',
        facilityName: 'Beispieleinrichtung',
        categoryId: '123e4567-e89b-12d3-a456-426614174050',
        categoryName: 'Heimerziehung (§ 34 SGB VIII)',
        availablePlaces: 3,
        lastUpdated: new Date().toISOString()
      }
    ]
  });
});

// Mock dashboard data endpoint for manager
app.get(`${apiPrefix}/manager/dashboard`, (_req: Request, res: Response) => {
  res.status(200).json({
    totalFacilities: 25,
    totalCarriers: 8,
    totalAvailablePlaces: 47,
    favorites: [
      {
        facilityId: '123e4567-e89b-12d3-a456-426614174020',
        facilityName: 'Beispieleinrichtung',
        carrierId: '123e4567-e89b-12d3-a456-426614174010',
        carrierName: 'Beispielträger'
      }
    ],
    recentUpdates: [
      {
        facilityId: '123e4567-e89b-12d3-a456-426614174020',
        facilityName: 'Beispieleinrichtung',
        categoryId: '123e4567-e89b-12d3-a456-426614174050',
        categoryName: 'Heimerziehung (§ 34 SGB VIII)',
        availablePlaces: 3,
        lastUpdated: new Date().toISOString()
      }
    ]
  });
});

// Mock dashboard data endpoint for leadership
app.get(`${apiPrefix}/leadership/dashboard`, (_req: Request, res: Response) => {
  res.status(200).json({
    totalFacilities: 25,
    totalCarriers: 8,
    totalAvailablePlaces: 47,
    occupancyRate: 78.5,
    usersByRole: [
      { role: 'admin', count: 2 },
      { role: 'carrier', count: 15 },
      { role: 'manager', count: 30 },
      { role: 'leadership', count: 5 }
    ],
    categoryDistribution: [
      {
        categoryId: '123e4567-e89b-12d3-a456-426614174050',
        categoryName: 'Heimerziehung (§ 34 SGB VIII)',
        availablePlaces: 20,
        totalPlaces: 100,
        occupancyRate: 80.0
      },
      {
        categoryId: '123e4567-e89b-12d3-a456-426614174051',
        categoryName: 'Erziehungsbeistand (§ 30 SGB VIII)',
        availablePlaces: 15,
        totalPlaces: 50,
        occupancyRate: 70.0
      }
    ],
    recentUpdates: [
      {
        facilityId: '123e4567-e89b-12d3-a456-426614174020',
        facilityName: 'Beispieleinrichtung',
        categoryId: '123e4567-e89b-12d3-a456-426614174050',
        categoryName: 'Heimerziehung (§ 34 SGB VIII)',
        availablePlaces: 3,
        lastUpdated: new Date().toISOString()
      }
    ]
  });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Not Found' });
});

// Error handling middleware
app.use(errorMiddleware);

export default app;
