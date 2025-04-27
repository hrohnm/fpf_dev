import { Router } from 'express';
import {
  getAvailabilities,
  getAvailabilityById,
  createAvailability,
  updateAvailability,
  deleteAvailability,
  bulkUpdateAvailabilities
} from '../../controllers/carrier/availability.controller';
import { validate } from '../../middlewares/validation.middleware';
import { carrierAccessMiddleware } from '../../middlewares/carrier-access.middleware';

const router = Router();

// Apply carrier access middleware to all availability routes
router.use(carrierAccessMiddleware);

// Availability routes
router.get('/', getAvailabilities);
router.get('/:id', getAvailabilityById);
router.post('/', createAvailability);
router.put('/:id', updateAvailability);
router.delete('/:id', deleteAvailability);
router.put('/bulk/update', bulkUpdateAvailabilities);

export default router;
