import { Place, Facility, Category } from '../models';
import { PlaceAttributes, PlaceCreationAttributes } from '../models/place.model';
import { Op } from 'sequelize';
import { ApiError } from '../utils/api-error';
import { logger } from '../utils/logger';

export class PlaceService {
  /**
   * Get all places with pagination, filtering, and sorting
   */
  async getAllPlaces(options: {
    page?: number;
    limit?: number;
    facilityId?: string;
    categoryId?: string;
    isOccupied?: boolean;
    genderSuitability?: 'male' | 'female' | 'all';
    minAge?: number;
    maxAge?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    try {
      const {
        page = 1,
        limit = 10,
        facilityId,
        categoryId,
        isOccupied,
        genderSuitability,
        minAge,
        maxAge,
        search,
        sortBy = 'name',
        sortOrder = 'asc',
      } = options;

      const offset = (page - 1) * limit;

      // Build where clause
      const where: any = {};

      if (facilityId) {
        where.facilityId = facilityId;
      }

      if (categoryId) {
        where.categoryId = categoryId;
      }

      if (isOccupied !== undefined) {
        where.isOccupied = isOccupied;
      }

      if (genderSuitability) {
        where.genderSuitability = genderSuitability;
      }

      if (minAge !== undefined) {
        where.maxAge = { [Op.gte]: minAge };
      }

      if (maxAge !== undefined) {
        where.minAge = { [Op.lte]: maxAge };
      }

      if (search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { notes: { [Op.iLike]: `%${search}%` } },
        ];
      }

      // Get places with pagination
      const { count, rows } = await Place.findAndCountAll({
        where,
        include: [
          {
            model: Facility,
            as: 'facility',
            attributes: ['id', 'name', 'carrierId'],
          },
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name'],
          },
        ],
        order: [[sortBy, sortOrder]],
        limit,
        offset,
      });

      return {
        data: rows,
        meta: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      logger.error('Error getting places:', error);
      throw new ApiError(500, 'Failed to get places');
    }
  }

  /**
   * Get places by facility ID
   */
  async getPlacesByFacilityId(facilityId: string, options: {
    page?: number;
    limit?: number;
    categoryId?: string;
    isOccupied?: boolean;
    genderSuitability?: 'male' | 'female' | 'all';
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    try {
      const {
        page = 1,
        limit = 10,
        categoryId,
        isOccupied,
        genderSuitability,
        sortBy = 'name',
        sortOrder = 'asc',
      } = options;

      const offset = (page - 1) * limit;

      // Build where clause
      const where: any = { facilityId };

      if (categoryId) {
        where.categoryId = categoryId;
      }

      if (isOccupied !== undefined) {
        where.isOccupied = isOccupied;
      }

      if (genderSuitability) {
        where.genderSuitability = genderSuitability;
      }

      // Get places with pagination
      const { count, rows } = await Place.findAndCountAll({
        where,
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name'],
          },
        ],
        order: [[sortBy, sortOrder]],
        limit,
        offset,
      });

      return {
        data: rows,
        meta: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      logger.error(`Error getting places for facility ${facilityId}:`, error);
      throw new ApiError(500, 'Failed to get places for facility');
    }
  }

  /**
   * Get a place by ID
   */
  async getPlaceById(id: string) {
    try {
      const place = await Place.findByPk(id, {
        include: [
          {
            model: Facility,
            as: 'facility',
            attributes: ['id', 'name', 'carrierId'],
          },
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name'],
          },
        ],
      });

      if (!place) {
        throw new ApiError(404, 'Place not found');
      }

      return place;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`Error getting place ${id}:`, error);
      throw new ApiError(500, 'Failed to get place');
    }
  }

  /**
   * Create a new place
   */
  async createPlace(data: PlaceCreationAttributes) {
    try {
      // Check if facility exists
      const facility = await Facility.findByPk(data.facilityId);
      if (!facility) {
        throw new ApiError(404, 'Facility not found');
      }

      // Check if category exists
      const category = await Category.findByPk(data.categoryId);
      if (!category) {
        throw new ApiError(404, 'Category not found');
      }

      // Check if the facility has reached its maximum capacity
      const placesCount = await Place.count({ where: { facilityId: data.facilityId } });
      if (placesCount >= facility.maxCapacity) {
        throw new ApiError(400, `Cannot add more places. Facility has reached its maximum capacity of ${facility.maxCapacity} places.`);
      }

      // Create the place
      const place = await Place.create(data);

      return place;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error('Error creating place:', error);
      throw new ApiError(500, 'Failed to create place');
    }
  }

  /**
   * Update a place
   */
  async updatePlace(id: string, data: Partial<PlaceAttributes>) {
    try {
      const place = await Place.findByPk(id);
      if (!place) {
        throw new ApiError(404, 'Place not found');
      }

      // Update the place
      await place.update(data);

      return place;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`Error updating place ${id}:`, error);
      throw new ApiError(500, 'Failed to update place');
    }
  }

  /**
   * Toggle place occupation status
   */
  async togglePlaceOccupation(id: string) {
    try {
      const place = await Place.findByPk(id);
      if (!place) {
        throw new ApiError(404, 'Place not found');
      }

      // Toggle the occupation status
      await place.update({ isOccupied: !place.isOccupied });

      return place;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`Error toggling place occupation ${id}:`, error);
      throw new ApiError(500, 'Failed to toggle place occupation');
    }
  }

  /**
   * Update place gender suitability
   */
  async updatePlaceGenderSuitability(id: string, genderSuitability: 'male' | 'female' | 'all') {
    try {
      const place = await Place.findByPk(id);
      if (!place) {
        throw new ApiError(404, 'Place not found');
      }

      // Update the gender suitability
      await place.update({ genderSuitability });

      return place;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`Error updating place gender suitability ${id}:`, error);
      throw new ApiError(500, 'Failed to update place gender suitability');
    }
  }

  /**
   * Delete a place
   */
  async deletePlace(id: string) {
    try {
      const place = await Place.findByPk(id);
      if (!place) {
        throw new ApiError(404, 'Place not found');
      }

      await place.destroy();

      return { success: true };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`Error deleting place ${id}:`, error);
      throw new ApiError(500, 'Failed to delete place');
    }
  }

  /**
   * Get place statistics for a facility
   */
  async getPlaceStatistics(facilityId: string) {
    try {
      const facility = await Facility.findByPk(facilityId);
      if (!facility) {
        throw new ApiError(404, 'Facility not found');
      }

      const totalPlaces = await Place.count({ where: { facilityId } });
      const occupiedPlaces = await Place.count({ where: { facilityId, isOccupied: true } });
      const availablePlaces = totalPlaces - occupiedPlaces;

      // Get places by gender suitability
      const malePlaces = await Place.count({ where: { facilityId, genderSuitability: 'male' } });
      const femalePlaces = await Place.count({ where: { facilityId, genderSuitability: 'female' } });
      const allGenderPlaces = await Place.count({ where: { facilityId, genderSuitability: 'all' } });

      // Get places by category
      const placesByCategory = await Place.findAll({
        attributes: [
          'categoryId',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
        ],
        where: { facilityId },
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['name'],
          },
        ],
        group: ['categoryId', 'category.id', 'category.name'],
        raw: true,
        nest: true,
      });

      return {
        totalPlaces,
        occupiedPlaces,
        availablePlaces,
        occupancyRate: totalPlaces > 0 ? (occupiedPlaces / totalPlaces) * 100 : 0,
        genderDistribution: {
          male: malePlaces,
          female: femalePlaces,
          all: allGenderPlaces,
        },
        placesByCategory,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`Error getting place statistics for facility ${facilityId}:`, error);
      throw new ApiError(500, 'Failed to get place statistics');
    }
  }
}
