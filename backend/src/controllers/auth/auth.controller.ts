import { Request, Response, NextFunction } from 'express';
import { User } from '../../models/user.model';
import { comparePassword } from '../../utils/password';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { HttpException } from '../../utils/http-exception';
import { SystemLog } from '../../models/system-log.model';
import logger from '../../utils/logger';

/**
 * Login controller
 * @route POST /api/auth/login
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new HttpException(401, 'Ungültige E-Mail oder Passwort');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new HttpException(403, 'Ihr Konto wurde deaktiviert');
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException(401, 'Ungültige E-Mail oder Passwort');
    }

    // Generate tokens
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Log login
    await SystemLog.create({
      userId: user.id,
      action: 'login',
      entity: 'user',
      entityId: user.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Return user data and tokens
    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Register controller
 * @route POST /api/auth/register
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new HttpException(409, 'E-Mail wird bereits verwendet');
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: role || 'manager',
      isActive: true,
    });

    // Generate tokens
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Log registration
    await SystemLog.create({
      userId: user.id,
      action: 'register',
      entity: 'user',
      entityId: user.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Return user data and tokens
    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh token controller
 * @route POST /api/auth/refresh-token
 */
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken: refreshTokenFromBody } = req.body;

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshTokenFromBody);
    if (!decoded) {
      throw new HttpException(401, 'Ungültiger oder abgelaufener Refresh-Token');
    }

    // Find user
    const user = await User.findByPk(decoded.id);
    if (!user || !user.isActive) {
      throw new HttpException(401, 'Benutzer nicht gefunden oder deaktiviert');
    }

    // Generate new tokens
    const token = generateToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Return new tokens
    res.json({
      token,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Forgot password controller
 * @route POST /api/auth/forgot-password
 */
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Don't reveal that the user doesn't exist
      return res.json({
        message: 'Wenn ein Konto mit dieser E-Mail existiert, wurde eine E-Mail mit Anweisungen zum Zurücksetzen des Passworts gesendet.',
      });
    }

    // In a real application, you would generate a reset token and send an email
    // For this example, we'll just log it
    logger.info(`Password reset requested for user: ${user.id}`);

    // Log password reset request
    await SystemLog.create({
      userId: user.id,
      action: 'forgot-password',
      entity: 'user',
      entityId: user.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      message: 'Wenn ein Konto mit dieser E-Mail existiert, wurde eine E-Mail mit Anweisungen zum Zurücksetzen des Passworts gesendet.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password controller
 * @route POST /api/auth/reset-password
 */
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, password } = req.body;

    // In a real application, you would verify the reset token
    // For this example, we'll just log it
    logger.info(`Password reset with token: ${token}`);

    res.json({
      message: 'Passwort wurde erfolgreich zurückgesetzt.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Change password controller
 * @route POST /api/auth/change-password
 */
export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new HttpException(401, 'Nicht authentifiziert');
    }

    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      throw new HttpException(404, 'Benutzer nicht gefunden');
    }

    // Verify old password
    const isPasswordValid = await comparePassword(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new HttpException(400, 'Altes Passwort ist falsch');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Log password change
    await SystemLog.create({
      userId: user.id,
      action: 'change-password',
      entity: 'user',
      entityId: user.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      message: 'Passwort wurde erfolgreich geändert.',
    });
  } catch (error) {
    next(error);
  }
};
