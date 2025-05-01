import Joi from 'joi';

// Hour ID schema
export const hourIdSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    'string.guid': 'Ungültige ID',
  }),
});

// Hour query schema
export const hourQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  categoryId: Joi.string().uuid().optional().messages({
    'string.guid': 'Ungültige Kategorie-ID',
  }),
  genderSuitability: Joi.string().valid('male', 'female', 'all').optional(),
  minAvailableHours: Joi.number().integer().min(0).optional(),
  sortBy: Joi.string().valid('name', 'totalHours', 'availableHours', 'lastUpdated').optional(),
  sortOrder: Joi.string().valid('asc', 'desc').optional(),
});

// Create hour schema
export const createHourSchema = Joi.object({
  facilityId: Joi.string().uuid().required().messages({
    'string.guid': 'Ungültige Einrichtungs-ID',
    'any.required': 'Einrichtungs-ID ist erforderlich',
  }),
  categoryId: Joi.string().uuid().required().messages({
    'string.guid': 'Ungültige Kategorie-ID',
    'any.required': 'Kategorie-ID ist erforderlich',
  }),
  name: Joi.string().min(1).max(255).required().messages({
    'string.empty': 'Name ist erforderlich',
    'string.max': 'Name darf maximal 255 Zeichen lang sein',
    'any.required': 'Name ist erforderlich',
  }),
  totalHours: Joi.number().integer().min(0).required().messages({
    'number.base': 'Gesamtstunden müssen eine Zahl sein',
    'number.min': 'Gesamtstunden müssen mindestens 0 sein',
    'any.required': 'Gesamtstunden sind erforderlich',
  }),
  availableHours: Joi.number().integer().min(0).required().messages({
    'number.base': 'Verfügbare Stunden müssen eine Zahl sein',
    'number.min': 'Verfügbare Stunden müssen mindestens 0 sein',
    'any.required': 'Verfügbare Stunden sind erforderlich',
  }),
  genderSuitability: Joi.string().valid('male', 'female', 'all').required(),
  minAge: Joi.number().integer().min(0).max(25).required().messages({
    'number.base': 'Mindestalter muss eine Zahl sein',
    'number.min': 'Mindestalter muss mindestens 0 sein',
    'number.max': 'Mindestalter darf maximal 25 sein',
    'any.required': 'Mindestalter ist erforderlich',
  }),
  maxAge: Joi.number().integer().min(0).max(27).required().messages({
    'number.base': 'Höchstalter muss eine Zahl sein',
    'number.min': 'Höchstalter muss mindestens 0 sein',
    'number.max': 'Höchstalter darf maximal 27 sein',
    'any.required': 'Höchstalter ist erforderlich',
  }),
  notes: Joi.string().optional(),
}).custom((value, helpers) => {
  if (value.availableHours > value.totalHours) {
    return helpers.error('custom.availableHours', {
      message: 'Verfügbare Stunden können nicht größer als Gesamtstunden sein',
    });
  }
  if (value.minAge > value.maxAge) {
    return helpers.error('custom.minAge', {
      message: 'Mindestalter muss kleiner oder gleich dem Höchstalter sein',
    });
  }
  return value;
});

// Update hour schema
export const updateHourSchema = Joi.object({
  name: Joi.string().min(1).max(255).required().messages({
    'string.empty': 'Name ist erforderlich',
    'string.max': 'Name darf maximal 255 Zeichen lang sein',
    'any.required': 'Name ist erforderlich',
  }),
  totalHours: Joi.number().integer().min(0).required().messages({
    'number.base': 'Gesamtstunden müssen eine Zahl sein',
    'number.min': 'Gesamtstunden müssen mindestens 0 sein',
    'any.required': 'Gesamtstunden sind erforderlich',
  }),
  availableHours: Joi.number().integer().min(0).required().messages({
    'number.base': 'Verfügbare Stunden müssen eine Zahl sein',
    'number.min': 'Verfügbare Stunden müssen mindestens 0 sein',
    'any.required': 'Verfügbare Stunden sind erforderlich',
  }),
  genderSuitability: Joi.string().valid('male', 'female', 'all').required(),
  minAge: Joi.number().integer().min(0).max(25).required().messages({
    'number.base': 'Mindestalter muss eine Zahl sein',
    'number.min': 'Mindestalter muss mindestens 0 sein',
    'number.max': 'Mindestalter darf maximal 25 sein',
    'any.required': 'Mindestalter ist erforderlich',
  }),
  maxAge: Joi.number().integer().min(0).max(27).required().messages({
    'number.base': 'Höchstalter muss eine Zahl sein',
    'number.min': 'Höchstalter muss mindestens 0 sein',
    'number.max': 'Höchstalter darf maximal 27 sein',
    'any.required': 'Höchstalter ist erforderlich',
  }),
  notes: Joi.string().optional(),
}).custom((value, helpers) => {
  if (value.availableHours > value.totalHours) {
    return helpers.error('custom.availableHours', {
      message: 'Verfügbare Stunden können nicht größer als Gesamtstunden sein',
    });
  }
  if (value.minAge > value.maxAge) {
    return helpers.error('custom.minAge', {
      message: 'Mindestalter muss kleiner oder gleich dem Höchstalter sein',
    });
  }
  return value;
});

// Update available hours schema
export const updateAvailableHoursSchema = Joi.object({
  availableHours: Joi.number().integer().min(0).required().messages({
    'number.base': 'Verfügbare Stunden müssen eine Zahl sein',
    'number.min': 'Verfügbare Stunden müssen mindestens 0 sein',
    'any.required': 'Verfügbare Stunden sind erforderlich',
  }),
});

// Bulk create hour schema
export const bulkCreateHourSchema = Joi.object({
  categoryId: Joi.string().uuid().required().messages({
    'string.guid': 'Ungültige Kategorie-ID',
    'any.required': 'Kategorie-ID ist erforderlich',
  }),
  name: Joi.string().min(1).max(255).optional().messages({
    'string.max': 'Name darf maximal 255 Zeichen lang sein',
  }),
  totalHours: Joi.number().integer().min(1).required().messages({
    'number.base': 'Gesamtstunden müssen eine Zahl sein',
    'number.min': 'Gesamtstunden müssen mindestens 1 sein',
    'any.required': 'Gesamtstunden sind erforderlich',
  }),
  availableHours: Joi.number().integer().min(0).required().messages({
    'number.base': 'Verfügbare Stunden müssen eine Zahl sein',
    'number.min': 'Verfügbare Stunden müssen mindestens 0 sein',
    'any.required': 'Verfügbare Stunden sind erforderlich',
  }),
  genderSuitability: Joi.string().valid('male', 'female', 'all').required(),
  minAge: Joi.number().integer().min(0).max(25).required().messages({
    'number.base': 'Mindestalter muss eine Zahl sein',
    'number.min': 'Mindestalter muss mindestens 0 sein',
    'number.max': 'Mindestalter darf maximal 25 sein',
    'any.required': 'Mindestalter ist erforderlich',
  }),
  maxAge: Joi.number().integer().min(0).max(27).required().messages({
    'number.base': 'Höchstalter muss eine Zahl sein',
    'number.min': 'Höchstalter muss mindestens 0 sein',
    'number.max': 'Höchstalter darf maximal 27 sein',
    'any.required': 'Höchstalter ist erforderlich',
  }),
}).custom((value, helpers) => {
  if (value.availableHours > value.totalHours) {
    return helpers.error('custom.availableHours', {
      message: 'Verfügbare Stunden können nicht größer als Gesamtstunden sein',
    });
  }
  if (value.minAge > value.maxAge) {
    return helpers.error('custom.minAge', {
      message: 'Mindestalter muss kleiner oder gleich dem Höchstalter sein',
    });
  }
  return value;
});
