import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { HttpException } from '../utils/http-exception';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

/**
 * Middleware to authenticate requests using JWT
 */
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HttpException(401, 'Authentication token is missing');
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the token
    const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_key';
    const decoded = jwt.verify(token, jwtSecret) as { id: string };
    
    // Find the user
    const user = await User.findByPk(decoded.id);
    if (!user) {
      throw new HttpException(401, 'Invalid authentication token');
    }
    
    // Check if user is active
    if (!user.isActive) {
      throw new HttpException(403, 'User account is deactivated');
    }
    
    // Attach the user to the request object
    req.user = user;
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new HttpException(401, 'Invalid authentication token'));
    } else {
      next(error);
    }
  }
};
