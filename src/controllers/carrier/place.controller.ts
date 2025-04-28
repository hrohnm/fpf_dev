import { Request, Response, NextFunction } from 'express';
import { PlaceService } from '../../services/place.service';
import { FacilityService } from '../../services/facility.service';
import { ApiError } from '../../utils/api-error';
import { logger } from '../../utils/logger';

const placeService = new PlaceService();
const facilityService = new FacilityService();

export class PlaceController {
  /**
   * Get all places for a facility
   */
  async getPlacesByFacility(req: Request, res: Response, next: NextFunction) {
    try {
      const { facilityId } = req.params;
      const { page, limit, categoryId, isOccupied, genderSuitability, sortBy, sortOrder } = req.query;

      // Check if the facility belongs to one of the user's carriers
      const userCarrierIds = req.user.carrierIds || [];
      const facility = await facilityService.getFacilityById(facilityId);
      
      if (!userCarrierIds.includes(facility.carrierId)) {
        throw new ApiError(403, 'You do not have permission to access this facility');
      }

      const places = await placeService.getPlacesByFacilityId(facilityId, {
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        categoryId: categoryId as string,
        isOccupied: isOccupied === 'true' ? true : isOccupied === 'false' ? false : undefined,
        genderSuitability: genderSuitability as 'male' | 'female' | 'all',
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc',
      });

      res.json(places);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a place by ID
   */
  async getPlaceById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const place = await placeService.getPlaceById(id);

      // Check if the place belongs to one of the user's carriers
      const userCarrierIds = req.user.carrierIds || [];
      const facility = await facilityService.getFacilityById(place.facilityId);
      
      if (!userCarrierIds.includes(facility.carrierId)) {
        throw new ApiError(403, 'You do not have permission to access this place');
      }

      res.json(place);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new place
   */
  async createPlace(req: Request, res: Response, next: NextFunction) {
    try {
      const { facilityId, categoryId, name, isOccupied, genderSuitability, minAge, maxAge, notes } = req.body;

      // Check if the facility belongs to one of the user's carriers
      const userCarrierIds = req.user.carrierIds || [];
      const facility = await facilityService.getFacilityById(facilityId);
      
      if (!userCarrierIds.includes(facility.carrierId)) {
        throw new ApiError(403, 'You do not have permission to create places for this facility');
      }

      const place = await placeService.createPlace({
        facilityId,
        categoryId,
        name,
        isOccupied: isOccupied || false,
        genderSuitability: genderSuitability || 'all',
        minAge: minAge || 0,
        maxAge: maxAge || 27,
        notes,
      });

      res.status(201).json(place);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a place
   */
  async updatePlace(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, isOccupied, genderSuitability, minAge, maxAge, notes } = req.body;

      // Get the place to check permissions
      const place = await placeService.getPlaceById(id);
      
      // Check if the place belongs to one of the user's carriers
      const userCarrierIds = req.user.carrierIds || [];
      const facility = await facilityService.getFacilityById(place.facilityId);
      
      if (!userCarrierIds.includes(facility.carrierId)) {
        throw new ApiError(403, 'You do not have permission to update this place');
      }

      const updatedPlace = await placeService.updatePlace(id, {
        name,
        isOccupied,
        genderSuitability,
        minAge,
        maxAge,
        notes,
      });

      res.json(updatedPlace);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Toggle place occupation status
   */
  async togglePlaceOccupation(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Get the place to check permissions
      const place = await placeService.getPlaceById(id);
      
      // Check if the place belongs to one of the user's carriers
      const userCarrierIds = req.user.carrierIds || [];
      const facility = await facilityService.getFacilityById(place.facilityId);
      
      if (!userCarrierIds.includes(facility.carrierId)) {
        throw new ApiError(403, 'You do not have permission to update this place');
      }

      const updatedPlace = await placeService.togglePlaceOccupation(id);

      res.json(updatedPlace);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update place gender suitability
   */
  async updatePlaceGenderSuitability(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { genderSuitability } = req.body;

      if (!genderSuitability || !['male', 'female', 'all'].includes(genderSuitability)) {
        throw new ApiError(400, 'Invalid gender suitability value');
      }

      // Get the place to check permissions
      const place = await placeService.getPlaceById(id);
      
      // Check if the place belongs to one of the user's carriers
      const userCarrierIds = req.user.carrierIds || [];
      const facility = await facilityService.getFacilityById(place.facilityId);
      
      if (!userCarrierIds.includes(facility.carrierId)) {
        throw new ApiError(403, 'You do not have permission to update this place');
      }

      const updatedPlace = await placeService.updatePlaceGenderSuitability(id, genderSuitability);

      res.json(updatedPlace);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a place
   */
  async deletePlace(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Get the place to check permissions
      const place = await placeService.getPlaceById(id);
      
      // Check if the place belongs to one of the user's carriers
      const userCarrierIds = req.user.carrierIds || [];
      const facility = await facilityService.getFacilityById(place.facilityId);
      
      if (!userCarrierIds.includes(facility.carrierId)) {
        throw new ApiError(403, 'You do not have permission to delete this place');
      }

      await placeService.deletePlace(id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get place statistics for a facility
   */
  async getPlaceStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      const { facilityId } = req.params;

      // Check if the facility belongs to one of the user's carriers
      const userCarrierIds = req.user.carrierIds || [];
      const facility = await facilityService.getFacilityById(facilityId);
      
      if (!userCarrierIds.includes(facility.carrierId)) {
        throw new ApiError(403, 'You do not have permission to access this facility');
      }

      const statistics = await placeService.getPlaceStatistics(facilityId);

      res.json(statistics);
    } catch (error) {
      next(error);
    }
  }
}
