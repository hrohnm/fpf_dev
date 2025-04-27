import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

/**
 * Generate a JWT token for a user
 * @param user User object
 * @returns JWT token
 */
export const generateToken = (user: User): string => {
  const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_key';
  const expiresIn = process.env.JWT_EXPIRATION || '1h';

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, jwtSecret);
};

/**
 * Generate a refresh token for a user
 * @param user User object
 * @returns Refresh token
 */
export const generateRefreshToken = (user: User): string => {
  const refreshSecret = process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret';

  const payload = {
    id: user.id,
  };

  return jwt.sign(payload, refreshSecret);
};

/**
 * Verify a JWT token
 * @param token JWT token
 * @returns Decoded token payload or null if invalid
 */
export const verifyToken = (token: string): any | null => {
  try {
    const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_key';
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    return null;
  }
};

/**
 * Verify a refresh token
 * @param token Refresh token
 * @returns Decoded token payload or null if invalid
 */
export const verifyRefreshToken = (token: string): any | null => {
  try {
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret';
    return jwt.verify(token, refreshSecret);
  } catch (error) {
    return null;
  }
};
