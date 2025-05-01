import { Router } from 'express';
import { validate } from '../../middlewares/validation.middleware';
import { carrierAccessMiddleware } from '../../middlewares/carrier-access.middleware';
import {
  getPlacesByFacility,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
  togglePlaceOccupation,
  updatePlaceGenderSuitability,
  getPlaceStatistics,
  bulkCreatePlaces
} from '../../controllers/carrier/place.controller';
import {
  placeIdSchema,
  createPlaceSchema,
  updatePlaceSchema,
  placeQuerySchema,
  bulkCreatePlacesSchema
} from '../../validations/place.validation';
import { facilityIdSchema } from '../../validations/facility.validation';

const router = Router();

// Apply carrier access middleware to all place routes
router.use(carrierAccessMiddleware);

// Place routes
// Support both old and new routes
router.get('/facilities/:facilityId/places', validate(facilityIdSchema, 'params'), validate(placeQuerySchema, 'query'), getPlacesByFacility);
router.get('/facility/:facilityId/places', validate(facilityIdSchema, 'params'), validate(placeQuerySchema, 'query'), getPlacesByFacility);

router.get('/:id', validate(placeIdSchema, 'params'), getPlaceById);
router.post('/', validate(createPlaceSchema), createPlace);

router.post('/facilities/:facilityId/bulk', validate(facilityIdSchema, 'params'), validate(bulkCreatePlacesSchema), bulkCreatePlaces);
router.post('/bulk/:facilityId', validate(facilityIdSchema, 'params'), validate(bulkCreatePlacesSchema), bulkCreatePlaces);

router.put('/:id', validate(placeIdSchema, 'params'), validate(updatePlaceSchema), updatePlace);
router.delete('/:id', validate(placeIdSchema, 'params'), deletePlace);
router.patch('/:id/toggle-occupation', validate(placeIdSchema, 'params'), togglePlaceOccupation);
router.patch('/:id/gender-suitability', validate(placeIdSchema, 'params'), updatePlaceGenderSuitability);

router.get('/facilities/:facilityId/statistics', validate(facilityIdSchema, 'params'), getPlaceStatistics);
router.get('/statistics/:facilityId', validate(facilityIdSchema, 'params'), getPlaceStatistics);

export default router;
