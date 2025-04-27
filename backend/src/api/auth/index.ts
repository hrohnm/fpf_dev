import { Router } from 'express';
import { login, register, refreshToken, forgotPassword, resetPassword, changePassword } from '../../controllers/auth/auth.controller';
import { validate } from '../../middlewares/validation.middleware';
import { loginSchema, registerSchema, refreshTokenSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema } from '../../validations/auth.validation';

const router = Router();

// Auth routes
router.post('/login', validate(loginSchema), login);
router.post('/register', validate(registerSchema), register);
router.post('/refresh-token', validate(refreshTokenSchema), refreshToken);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.post('/change-password', validate(changePasswordSchema), changePassword);

export default router;
