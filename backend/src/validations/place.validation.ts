import Joi from 'joi';

// Place ID validation schema
export const placeIdSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    'string.guid': 'Ungültige Platz-ID',
    'string.empty': 'Platz-ID ist erforderlich',
    'any.required': 'Platz-ID ist erforderlich',
  }),
});

// Create place validation schema
export const createPlaceSchema = Joi.object({
  facilityId: Joi.string().uuid().optional().messages({
    'string.guid': 'Ungültige Einrichtungs-ID',
    'string.empty': 'Einrichtungs-ID ist erforderlich',
  }),
  categoryId: Joi.string().uuid().required().messages({
    'string.guid': 'Ungültige Kategorie-ID',
    'string.empty': 'Kategorie-ID ist erforderlich',
    'any.required': 'Kategorie-ID ist erforderlich',
  }),
  name: Joi.string().required().messages({
    'string.empty': 'Name ist erforderlich',
    'any.required': 'Name ist erforderlich',
  }),
  isOccupied: Joi.boolean().default(false),
  genderSuitability: Joi.string().valid('male', 'female', 'all').default('all').messages({
    'any.only': 'Ungültige Geschlechtseignung',
  }),
  minAge: Joi.number().integer().min(0).max(25).default(0).messages({
    'number.base': 'Mindestalter muss eine Zahl sein',
    'number.integer': 'Mindestalter muss eine ganze Zahl sein',
    'number.min': 'Mindestalter muss mindestens 0 sein',
    'number.max': 'Mindestalter darf maximal 25 sein',
  }),
  maxAge: Joi.number().integer().min(0).max(27).default(18).messages({
    'number.base': 'Höchstalter muss eine Zahl sein',
    'number.integer': 'Höchstalter muss eine ganze Zahl sein',
    'number.min': 'Höchstalter muss mindestens 0 sein',
    'number.max': 'Höchstalter darf maximal 27 sein',
  }),
  notes: Joi.string().optional().allow(''),
}).unknown(true);

// Update place validation schema
export const updatePlaceSchema = Joi.object({
  categoryId: Joi.string().uuid().optional().messages({
    'string.guid': 'Ungültige Kategorie-ID',
  }),
  name: Joi.string().optional(),
  isOccupied: Joi.boolean().optional(),
  genderSuitability: Joi.string().valid('male', 'female', 'all').optional().messages({
    'any.only': 'Ungültige Geschlechtseignung',
  }),
  minAge: Joi.number().integer().min(0).max(25).optional().messages({
    'number.base': 'Mindestalter muss eine Zahl sein',
    'number.integer': 'Mindestalter muss eine ganze Zahl sein',
    'number.min': 'Mindestalter muss mindestens 0 sein',
    'number.max': 'Mindestalter darf maximal 25 sein',
  }),
  maxAge: Joi.number().integer().min(0).max(27).optional().messages({
    'number.base': 'Höchstalter muss eine Zahl sein',
    'number.integer': 'Höchstalter muss eine ganze Zahl sein',
    'number.min': 'Höchstalter muss mindestens 0 sein',
    'number.max': 'Höchstalter darf maximal 27 sein',
  }),
  notes: Joi.string().optional().allow(''),
}).min(1).messages({
  'object.min': 'Mindestens ein Feld muss aktualisiert werden',
}).unknown(true);

// Bulk create places validation schema
export const bulkCreatePlacesSchema = Joi.object({
  categoryId: Joi.string().uuid().required().messages({
    'string.guid': 'Ungültige Kategorie-ID',
    'string.empty': 'Kategorie-ID ist erforderlich',
    'any.required': 'Kategorie-ID ist erforderlich',
  }),
  genderSuitability: Joi.string().valid('male', 'female', 'all').default('all').messages({
    'any.only': 'Ungültige Geschlechtseignung',
  }),
  minAge: Joi.number().integer().min(0).max(25).default(0).messages({
    'number.base': 'Mindestalter muss eine Zahl sein',
    'number.integer': 'Mindestalter muss eine ganze Zahl sein',
    'number.min': 'Mindestalter muss mindestens 0 sein',
    'number.max': 'Mindestalter darf maximal 25 sein',
  }),
  maxAge: Joi.number().integer().min(0).max(27).default(18).messages({
    'number.base': 'Höchstalter muss eine Zahl sein',
    'number.integer': 'Höchstalter muss eine ganze Zahl sein',
    'number.min': 'Höchstalter muss mindestens 0 sein',
    'number.max': 'Höchstalter darf maximal 27 sein',
  }),
}).unknown(true);

// Place query validation schema
export const placeQuerySchema = Joi.object({
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
  categoryId: Joi.string().uuid().optional().messages({
    'string.guid': 'Ungültige Kategorie-ID',
  }),
  isOccupied: Joi.boolean().optional(),
  genderSuitability: Joi.string().valid('male', 'female', 'all').optional().messages({
    'any.only': 'Ungültige Geschlechtseignung',
  }),
  sortBy: Joi.string().valid('name', 'createdAt', 'lastUpdated').default('name').messages({
    'any.only': 'Ungültiges Sortierfeld',
  }),
  sortOrder: Joi.string().valid('asc', 'desc').default('asc').messages({
    'any.only': 'Ungültige Sortierreihenfolge',
  }),
});
