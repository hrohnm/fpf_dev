import Joi from 'joi';

// Login validation schema
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
    'string.empty': 'E-Mail ist erforderlich',
    'any.required': 'E-Mail ist erforderlich',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Passwort muss mindestens 8 Zeichen lang sein',
    'string.empty': 'Passwort ist erforderlich',
    'any.required': 'Passwort ist erforderlich',
  }),
});

// Register validation schema
export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
    'string.empty': 'E-Mail ist erforderlich',
    'any.required': 'E-Mail ist erforderlich',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Passwort muss mindestens 8 Zeichen lang sein',
    'string.empty': 'Passwort ist erforderlich',
    'any.required': 'Passwort ist erforderlich',
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwörter stimmen nicht überein',
    'string.empty': 'Passwortbestätigung ist erforderlich',
    'any.required': 'Passwortbestätigung ist erforderlich',
  }),
  firstName: Joi.string().required().messages({
    'string.empty': 'Vorname ist erforderlich',
    'any.required': 'Vorname ist erforderlich',
  }),
  lastName: Joi.string().required().messages({
    'string.empty': 'Nachname ist erforderlich',
    'any.required': 'Nachname ist erforderlich',
  }),
  role: Joi.string().valid('admin', 'carrier', 'manager', 'leadership').default('manager').messages({
    'any.only': 'Ungültige Rolle',
  }),
});

// Refresh token validation schema
export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'string.empty': 'Refresh-Token ist erforderlich',
    'any.required': 'Refresh-Token ist erforderlich',
  }),
});

// Forgot password validation schema
export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
    'string.empty': 'E-Mail ist erforderlich',
    'any.required': 'E-Mail ist erforderlich',
  }),
});

// Reset password validation schema
export const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    'string.empty': 'Token ist erforderlich',
    'any.required': 'Token ist erforderlich',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Passwort muss mindestens 8 Zeichen lang sein',
    'string.empty': 'Passwort ist erforderlich',
    'any.required': 'Passwort ist erforderlich',
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwörter stimmen nicht überein',
    'string.empty': 'Passwortbestätigung ist erforderlich',
    'any.required': 'Passwortbestätigung ist erforderlich',
  }),
});

// Change password validation schema
export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().messages({
    'string.empty': 'Altes Passwort ist erforderlich',
    'any.required': 'Altes Passwort ist erforderlich',
  }),
  newPassword: Joi.string().min(8).required().messages({
    'string.min': 'Neues Passwort muss mindestens 8 Zeichen lang sein',
    'string.empty': 'Neues Passwort ist erforderlich',
    'any.required': 'Neues Passwort ist erforderlich',
  }),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'Passwörter stimmen nicht überein',
    'string.empty': 'Passwortbestätigung ist erforderlich',
    'any.required': 'Passwortbestätigung ist erforderlich',
  }),
});
