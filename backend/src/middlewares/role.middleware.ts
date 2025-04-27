import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../utils/http-exception';

/**
 * Middleware to check if the user has the required role
 * @param roles Array of allowed roles
 */
export const roleMiddleware = (roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Check if user exists on the request
      if (!req.user) {
        throw new HttpException(401, 'Authentication required');
      }
      
      // Check if user has one of the required roles
      if (!roles.includes(req.user.role)) {
        throw new HttpException(403, 'Insufficient permissions');
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};
