import { Router } from 'express';
import { validate } from '../../middlewares/validation.middleware';
import { carrierAccessMiddleware } from '../../middlewares/carrier-access.middleware';
import {
  getHoursByFacility,
  getHourById,
  createHour,
  updateHour,
  deleteHour,
  updateAvailableHours,
  getHourStatistics,
  bulkCreateHours
} from '../../controllers/carrier/hour.controller';
import {
  hourIdSchema,
  createHourSchema,
  updateHourSchema,
  hourQuerySchema,
  bulkCreateHourSchema,
  updateAvailableHoursSchema
} from '../../validations/hour.validation';
import { facilityIdSchema } from '../../validations/facility.validation';

const router = Router();

// Apply carrier access middleware to all hour routes
router.use(carrierAccessMiddleware);

// Get hours by facility with pagination and filtering
router.get(
  '/facility/:facilityId',
  validate(facilityIdSchema, 'params'),
  validate(hourQuerySchema, 'query'),
  getHoursByFacility
);

// Get hour by ID
router.get(
  '/:id',
  validate(hourIdSchema, 'params'),
  getHourById
);

// Create a new hour entry
router.post(
  '/',
  validate(createHourSchema),
  createHour
);

// Update an hour entry
router.put(
  '/:id',
  validate(hourIdSchema, 'params'),
  validate(updateHourSchema),
  updateHour
);

// Delete an hour entry
router.delete(
  '/:id',
  validate(hourIdSchema, 'params'),
  deleteHour
);

// Update available hours
router.patch(
  '/:id/available',
  validate(hourIdSchema, 'params'),
  validate(updateAvailableHoursSchema),
  updateAvailableHours
);

// Get hour statistics for a facility
router.get(
  '/statistics/:facilityId',
  validate(facilityIdSchema, 'params'),
  getHourStatistics
);

// Bulk create hours
router.post(
  '/bulk/:facilityId',
  validate(facilityIdSchema, 'params'),
  validate(bulkCreateHourSchema),
  bulkCreateHours
);

export default router;
