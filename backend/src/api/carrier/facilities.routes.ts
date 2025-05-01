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
  facilityIdSchema,
  facilityIdParamSchema
} from '../../validations/facility.validation';
import { carrierAccessMiddleware } from '../../middlewares/carrier-access.middleware';
import {
  getPlacesByFacility,
  getPlaceStatistics,
  bulkCreatePlaces,
  createPlace
} from '../../controllers/carrier/place.controller';
import {
  placeQuerySchema,
  bulkCreatePlacesSchema,
  createPlaceSchema
} from '../../validations/place.validation';

const router = Router();

// Apply carrier access middleware to all facility routes
router.use(carrierAccessMiddleware);

// Facility routes
router.get('/', getFacilities);
router.get('/:id', validate(facilityIdParamSchema, 'params'), getFacilityById);
router.post('/', validate(createFacilitySchema), createFacility);
router.put('/:id', validate(facilityIdParamSchema, 'params'), validate(updateFacilitySchema), updateFacility);
router.delete('/:id', validate(facilityIdParamSchema, 'params'), deleteFacility);

// Place routes for facilities
router.get('/:facilityId/places', validate(facilityIdSchema, 'params'), validate(placeQuerySchema, 'query'), getPlacesByFacility);
router.get('/:facilityId/places/statistics', validate(facilityIdSchema, 'params'), getPlaceStatistics);
router.post('/:facilityId/places', validate(facilityIdSchema, 'params'), validate(createPlaceSchema), createPlace);
router.post('/:facilityId/places/bulk', validate(facilityIdSchema, 'params'), validate(bulkCreatePlacesSchema), bulkCreatePlaces);

export default router;
