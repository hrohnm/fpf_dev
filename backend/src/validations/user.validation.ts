import Joi from 'joi';

// User ID validation schema
export const userIdSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    'string.guid': 'Ungültige Benutzer-ID',
    'string.empty': 'Benutzer-ID ist erforderlich',
    'any.required': 'Benutzer-ID ist erforderlich',
  }),
});

// Create user validation schema
export const createUserSchema = Joi.object({
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
  firstName: Joi.string().required().messages({
    'string.empty': 'Vorname ist erforderlich',
    'any.required': 'Vorname ist erforderlich',
  }),
  lastName: Joi.string().required().messages({
    'string.empty': 'Nachname ist erforderlich',
    'any.required': 'Nachname ist erforderlich',
  }),
  role: Joi.string().valid('admin', 'carrier', 'manager', 'leadership').required().messages({
    'any.only': 'Ungültige Rolle',
    'string.empty': 'Rolle ist erforderlich',
    'any.required': 'Rolle ist erforderlich',
  }),
  isActive: Joi.boolean().default(true),
  carrierIds: Joi.array().items(Joi.string().uuid()).optional(),
});

// Update user validation schema
export const updateUserSchema = Joi.object({
  email: Joi.string().email().optional().messages({
    'string.email': 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
  }),
  password: Joi.string().min(8).optional().messages({
    'string.min': 'Passwort muss mindestens 8 Zeichen lang sein',
  }),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  role: Joi.string().valid('admin', 'carrier', 'manager', 'leadership').optional().messages({
    'any.only': 'Ungültige Rolle',
  }),
  isActive: Joi.boolean().optional(),
  carrierIds: Joi.array().items(Joi.string().uuid()).optional(),
}).min(1).messages({
  'object.min': 'Mindestens ein Feld muss aktualisiert werden',
});

// User query validation schema
export const userQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    'number.base': 'Seite muss eine Zahl sein',
    'number.integer': 'Seite muss eine ganze Zahl sein',
    'number.min': 'Seite muss mindestens 1 sein',
  }),
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    'number.base': 'Limit muss eine Zahl sein',
    'number.integer': 'Limit muss eine ganze Zahl sein',
    'number.min': 'Limit muss mindestens 1 sein',
    'number.max': 'Limit darf maximal 100 sein',
  }),
  search: Joi.string().optional(),
  role: Joi.string().valid('admin', 'carrier', 'manager', 'leadership').optional().messages({
    'any.only': 'Ungültige Rolle',
  }),
  isActive: Joi.boolean().optional(),
  sortBy: Joi.string().valid('firstName', 'lastName', 'email', 'role', 'createdAt').default('createdAt').messages({
    'any.only': 'Ungültiges Sortierfeld',
  }),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc').messages({
    'any.only': 'Ungültige Sortierreihenfolge',
  }),
});
