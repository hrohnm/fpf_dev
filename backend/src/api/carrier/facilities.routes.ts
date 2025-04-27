import { Router } from 'express';
import { 
  getFacilities, 
  getFacilityById, 
  createFacility, 
  updateFacility, 
  deleteFacility 
} from '../../controllers/carrier/facility.controller';
import { validate } from '../../middlewares/validation.middleware';
import { 
  createFacilitySchema, 
  updateFacilitySchema, 
  facilityIdSchema 
} from '../../validations/facility.validation';
import { carrierAccessMiddleware } from '../../middlewares/carrier-access.middleware';

const router = Router();

// Apply carrier access middleware to all facility routes
router.use(carrierAccessMiddleware);

// Facility routes
router.get('/', getFacilities);
router.get('/:id', validate(facilityIdSchema, 'params'), getFacilityById);
router.post('/', validate(createFacilitySchema), createFacility);
router.put('/:id', validate(facilityIdSchema, 'params'), validate(updateFacilitySchema), updateFacility);
router.delete('/:id', validate(facilityIdSchema, 'params'), deleteFacility);

export default router;
