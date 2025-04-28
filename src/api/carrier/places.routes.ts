import { Router } from 'express';
import { PlaceController } from '../../controllers/carrier/place.controller';
import { authenticateJWT } from '../../middleware/auth.middleware';
import { validateCarrierRole } from '../../middleware/role.middleware';

const router = Router();
const placeController = new PlaceController();

// Apply authentication and role middleware to all routes
router.use(authenticateJWT, validateCarrierRole);

// Get places by facility
router.get('/facilities/:facilityId/places', placeController.getPlacesByFacility);

// Get place statistics for a facility
router.get('/facilities/:facilityId/places/statistics', placeController.getPlaceStatistics);

// Get a place by ID
router.get('/places/:id', placeController.getPlaceById);

// Create a new place
router.post('/places', placeController.createPlace);

// Update a place
router.put('/places/:id', placeController.updatePlace);

// Toggle place occupation status
router.patch('/places/:id/toggle-occupation', placeController.togglePlaceOccupation);

// Update place gender suitability
router.patch('/places/:id/gender-suitability', placeController.updatePlaceGenderSuitability);

// Delete a place
router.delete('/places/:id', placeController.deletePlace);

export default router;
