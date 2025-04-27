import { Request, Response, NextFunction } from 'express';
import { CarrierUser } from '../models/carrier-user.model';
import { HttpException } from '../utils/http-exception';

/**
 * Middleware to check if the user has access to the carrier's resources
 */
export const carrierAccessMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    // Skip for admin users
    if (req.user?.role === 'admin') {
      return next();
    }

    // Get carrier ID from request
    const carrierId = req.body.carrierId || req.query.carrierId || req.params.carrierId;
    
    // If no carrier ID is provided, continue (will be handled by the controller)
    if (!carrierId) {
      return next();
    }
    
    // Check if user has access to the carrier
    const hasAccess = await CarrierUser.findOne({
      where: {
        userId: req.user?.id,
        carrierId,
      },
    });
    
    if (!hasAccess) {
      throw new HttpException(403, 'You do not have access to this carrier');
    }
    
    next();
  } catch (error) {
    next(error);
  }
};
