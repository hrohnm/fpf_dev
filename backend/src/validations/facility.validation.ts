import Joi from 'joi';

// Facility ID validation schema for URL parameter facilityId
export const facilityIdSchema = Joi.object({
  facilityId: Joi.string().uuid().required().messages({
    'string.guid': 'Ungültige Einrichtungs-ID',
    'string.empty': 'Einrichtungs-ID ist erforderlich',
    'any.required': 'Einrichtungs-ID ist erforderlich',
  }),
});

// Facility ID validation schema for URL parameter id
export const facilityIdParamSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    'string.guid': 'Ungültige Einrichtungs-ID',
    'string.empty': 'Einrichtungs-ID ist erforderlich',
    'any.required': 'Einrichtungs-ID ist erforderlich',
  }),
});

// Create facility validation schema
export const createFacilitySchema = Joi.object({
  carrierId: Joi.string().uuid().required().messages({
    'string.guid': 'Ungültige Träger-ID',
    'string.empty': 'Träger-ID ist erforderlich',
    'any.required': 'Träger-ID ist erforderlich',
  }),
  name: Joi.string().required().messages({
    'string.empty': 'Name ist erforderlich',
    'any.required': 'Name ist erforderlich',
  }),
  description: Joi.string().optional().allow(''),
  contactPerson: Joi.string().required().messages({
    'string.empty': 'Ansprechpartner ist erforderlich',
    'any.required': 'Ansprechpartner ist erforderlich',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
    'string.empty': 'E-Mail ist erforderlich',
    'any.required': 'E-Mail ist erforderlich',
  }),
  phone: Joi.string().required().messages({
    'string.empty': 'Telefonnummer ist erforderlich',
    'any.required': 'Telefonnummer ist erforderlich',
  }),
  address: Joi.string().required().messages({
    'string.empty': 'Adresse ist erforderlich',
    'any.required': 'Adresse ist erforderlich',
  }),
  city: Joi.string().required().messages({
    'string.empty': 'Stadt ist erforderlich',
    'any.required': 'Stadt ist erforderlich',
  }),
  postalCode: Joi.string().required().messages({
    'string.empty': 'Postleitzahl ist erforderlich',
    'any.required': 'Postleitzahl ist erforderlich',
  }),
  latitude: Joi.number().min(-90).max(90).optional().messages({
    'number.base': 'Breitengrad muss eine Zahl sein',
    'number.min': 'Breitengrad muss zwischen -90 und 90 liegen',
    'number.max': 'Breitengrad muss zwischen -90 und 90 liegen',
  }),
  longitude: Joi.number().min(-180).max(180).optional().messages({
    'number.base': 'Längengrad muss eine Zahl sein',
    'number.min': 'Längengrad muss zwischen -180 und 180 liegen',
    'number.max': 'Längengrad muss zwischen -180 und 180 liegen',
  }),
  openingHours: Joi.string().optional().allow(''),
  maxCapacity: Joi.number().integer().min(1).required().messages({
    'number.base': 'Maximale Kapazität muss eine Zahl sein',
    'number.integer': 'Maximale Kapazität muss eine ganze Zahl sein',
    'number.min': 'Maximale Kapazität muss mindestens 1 sein',
    'any.required': 'Maximale Kapazität ist erforderlich',
  }),
});

// Update facility validation schema
export const updateFacilitySchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional().allow(''),
  contactPerson: Joi.string().optional(),
  email: Joi.string().email().optional().messages({
    'string.email': 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
  }),
  phone: Joi.string().optional(),
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  postalCode: Joi.string().optional(),
  latitude: Joi.number().min(-90).max(90).optional().messages({
    'number.base': 'Breitengrad muss eine Zahl sein',
    'number.min': 'Breitengrad muss zwischen -90 und 90 liegen',
    'number.max': 'Breitengrad muss zwischen -90 und 90 liegen',
  }),
  longitude: Joi.number().min(-180).max(180).optional().messages({
    'number.base': 'Längengrad muss eine Zahl sein',
    'number.min': 'Längengrad muss zwischen -180 und 180 liegen',
    'number.max': 'Längengrad muss zwischen -180 und 180 liegen',
  }),
  openingHours: Joi.string().optional().allow(''),
  maxCapacity: Joi.number().integer().min(1).optional().messages({
    'number.base': 'Maximale Kapazität muss eine Zahl sein',
    'number.integer': 'Maximale Kapazität muss eine ganze Zahl sein',
    'number.min': 'Maximale Kapazität muss mindestens 1 sein',
  }),
  isActive: Joi.boolean().optional(),
}).min(1).messages({
  'object.min': 'Mindestens ein Feld muss aktualisiert werden',
});

// Facility query validation schema
export const facilityQuerySchema = Joi.object({
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
  carrierId: Joi.string().uuid().optional().messages({
    'string.guid': 'Ungültige Träger-ID',
  }),
  city: Joi.string().optional(),
  postalCode: Joi.string().optional(),
  isActive: Joi.boolean().optional(),
  sortBy: Joi.string().valid('name', 'city', 'maxCapacity', 'createdAt').default('createdAt').messages({
    'any.only': 'Ungültiges Sortierfeld',
  }),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc').messages({
    'any.only': 'Ungültige Sortierreihenfolge',
  }),
});
