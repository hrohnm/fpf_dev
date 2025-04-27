import Joi from 'joi';

// Search validation schema
export const searchSchema = Joi.object({
  categoryIds: Joi.array().items(Joi.string().uuid()).optional(),
  genderSuitability: Joi.string().valid('male', 'female', 'all').optional(),
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
  city: Joi.string().optional(),
  postalCode: Joi.string().optional(),
  radius: Joi.number().min(0).max(500).optional().messages({
    'number.base': 'Radius muss eine Zahl sein',
    'number.min': 'Radius muss mindestens 0 sein',
    'number.max': 'Radius darf maximal 500 sein',
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
  sortBy: Joi.string().valid('distance', 'availablePlaces', 'lastUpdated').default('lastUpdated').messages({
    'any.only': 'Ungültiges Sortierfeld',
  }),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc').messages({
    'any.only': 'Ungültige Sortierreihenfolge',
  }),
});

// Category search validation schema
export const categorySearchSchema = Joi.object({
  categoryId: Joi.string().uuid().required().messages({
    'string.guid': 'Ungültige Kategorie-ID',
    'string.empty': 'Kategorie-ID ist erforderlich',
    'any.required': 'Kategorie-ID ist erforderlich',
  }),
});
