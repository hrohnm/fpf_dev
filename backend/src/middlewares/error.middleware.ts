import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../utils/http-exception';
import logger from '../utils/logger';

/**
 * Global error handling middleware
 */
export const errorMiddleware = (
  error: HttpException,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || 'Something went wrong';
    const details: any = error.details || {};

    // Log the error
    logger.error(`[${status}] ${message}`, {
      details,
      stack: error.stack,
    });

    // Send the error response
    res.status(status).json({
      status,
      message,
      ...(Object.keys(details).length > 0 && { details }),
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
  } catch (err) {
    // If error handling fails, send a generic error
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
    });
  }
};
