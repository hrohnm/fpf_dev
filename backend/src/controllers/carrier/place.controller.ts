import { Request, Response } from 'express';
import { Op, Transaction } from 'sequelize';
import { Place } from '../../models/place.model';
import { Facility } from '../../models/facility.model';
import { Category } from '../../models/category.model';
import sequelize from '../../config/db.config';
import logger from '../../utils/logger';
import { getPaginationParams } from '../../utils/pagination';

/**
 * Get places by facility ID
 */
export const getPlacesByFacility = async (req: Request, res: Response) => {
  try {
    const { facilityId } = req.params;
    const { page, limit, offset, sortBy, sortOrder } = getPaginationParams(req.query);

    // Build filter conditions
    const whereConditions: any = {
      facilityId,
    };

    // Apply additional filters if provided
    if (req.query.categoryId) {
      whereConditions.categoryId = req.query.categoryId;
    }

    if (req.query.isOccupied !== undefined) {
      whereConditions.isOccupied = req.query.isOccupied === 'true';
    }

    if (req.query.genderSuitability) {
      whereConditions.genderSuitability = req.query.genderSuitability;
    }

    // Check if facility exists and belongs to the carrier
    const facility = await Facility.findByPk(facilityId);
    if (!facility) {
      return res.status(404).json({ message: 'Facility not found' });
    }

    // Get places with pagination
    const { count, rows } = await Place.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
      order: [[sortBy || 'name', sortOrder || 'ASC']],
      limit,
      offset,
    });

    // Return paginated results
    return res.json({
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    logger.error('Error getting places by facility:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get place by ID
 */
export const getPlaceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const place = await Place.findByPk(id, {
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    return res.json(place);
  } catch (error) {
    logger.error('Error getting place by ID:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Create a new place
 */
export const createPlace = async (req: Request, res: Response) => {
  try {
    // Get facilityId from params or body
    const facilityId = req.params.facilityId || req.body.facilityId;
    const { categoryId, name, isOccupied, genderSuitability, minAge, maxAge, notes } = req.body;

    if (!facilityId) {
      return res.status(400).json({ message: 'Facility ID is required' });
    }

    // Check if facility exists and belongs to the carrier
    const facility = await Facility.findByPk(facilityId);
    if (!facility) {
      return res.status(404).json({ message: 'Facility not found' });
    }

    // Check if category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if facility has reached max capacity
    const placesCount = await Place.count({ where: { facilityId } });
    if (facility.maxCapacity && placesCount >= facility.maxCapacity) {
      return res.status(400).json({ message: 'Facility has reached maximum capacity' });
    }

    // Create new place
    const place = await Place.create({
      facilityId,
      categoryId,
      name,
      isOccupied: isOccupied || false,
      genderSuitability: genderSuitability || 'all',
      minAge: minAge || 0,
      maxAge: maxAge || 18,
      notes,
      lastUpdated: new Date(),
    });

    // Return created place
    return res.status(201).json(place);
  } catch (error) {
    logger.error('Error creating place:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Update a place
 */
export const updatePlace = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { categoryId, name, isOccupied, genderSuitability, minAge, maxAge, notes } = req.body;

    // Find place
    const place = await Place.findByPk(id);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    // Check if category exists if provided
    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
    }

    // Update place
    await place.update({
      categoryId: categoryId || place.categoryId,
      name: name || place.name,
      isOccupied: isOccupied !== undefined ? isOccupied : place.isOccupied,
      genderSuitability: genderSuitability || place.genderSuitability,
      minAge: minAge !== undefined ? minAge : place.minAge,
      maxAge: maxAge !== undefined ? maxAge : place.maxAge,
      notes: notes !== undefined ? notes : place.notes,
    });

    // Return updated place
    return res.json(place);
  } catch (error) {
    logger.error('Error updating place:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Delete a place
 */
export const deletePlace = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Find place
    const place = await Place.findByPk(id);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    // Delete place
    await place.destroy();

    return res.status(204).send();
  } catch (error) {
    logger.error('Error deleting place:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Toggle place occupation status
 */
export const togglePlaceOccupation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Find place
    const place = await Place.findByPk(id);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    // Toggle occupation status
    await place.update({
      isOccupied: !place.isOccupied,
    });

    // Return updated place
    return res.json(place);
  } catch (error) {
    logger.error('Error toggling place occupation:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Update place gender suitability
 */
export const updatePlaceGenderSuitability = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { genderSuitability } = req.body;

    // Validate gender suitability
    if (!['male', 'female', 'all'].includes(genderSuitability)) {
      return res.status(400).json({ message: 'Invalid gender suitability value' });
    }

    // Find place
    const place = await Place.findByPk(id);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    // Update gender suitability
    await place.update({
      genderSuitability,
    });

    // Return updated place
    return res.json(place);
  } catch (error) {
    logger.error('Error updating place gender suitability:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get place statistics for a facility
 */
export const getPlaceStatistics = async (req: Request, res: Response) => {
  try {
    const { facilityId } = req.params;

    // Check if facility exists and belongs to the carrier
    const facility = await Facility.findByPk(facilityId);
    if (!facility) {
      return res.status(404).json({ message: 'Facility not found' });
    }

    // Get total places count
    const totalPlaces = await Place.count({ where: { facilityId } });

    // Get occupied places count
    const occupiedPlaces = await Place.count({ where: { facilityId, isOccupied: true } });

    // Get available places count
    const availablePlaces = totalPlaces - occupiedPlaces;

    // Get places by gender suitability
    const maleOnlyPlaces = await Place.count({ where: { facilityId, genderSuitability: 'male' } });
    const femaleOnlyPlaces = await Place.count({ where: { facilityId, genderSuitability: 'female' } });
    const allGenderPlaces = await Place.count({ where: { facilityId, genderSuitability: 'all' } });

    // Get places by category
    const placesByCategory = await Place.findAll({
      attributes: ['categoryId', [sequelize.fn('COUNT', sequelize.col('Place.id')), 'count']],
      where: { facilityId },
      group: ['categoryId', 'category.id'],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
    });

    // Return statistics
    return res.json({
      totalPlaces,
      occupiedPlaces,
      availablePlaces,
      occupancyRate: totalPlaces > 0 ? Math.round((occupiedPlaces / totalPlaces) * 100) : 0,
      genderDistribution: {
        maleOnly: maleOnlyPlaces,
        femaleOnly: femaleOnlyPlaces,
        allGender: allGenderPlaces,
      },
      categoryDistribution: placesByCategory.map((item: any) => ({
        categoryId: item.categoryId,
        categoryName: item.category.name,
        count: item.get('count'),
      })),
    });
  } catch (error) {
    logger.error('Error getting place statistics:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Bulk create places for a facility
 */
export const bulkCreatePlaces = async (req: Request, res: Response) => {
  let transaction: Transaction | undefined;

  try {
    const { facilityId } = req.params;
    const { categoryId, genderSuitability, minAge, maxAge } = req.body;

    // Log the request body for debugging
    console.log('Bulk create places request body:', req.body);

    // Validate required fields
    if (!categoryId) {
      return res.status(400).json({ message: 'Category ID is required' });
    }

    // Check if facility exists and belongs to the carrier
    const facility = await Facility.findByPk(facilityId);
    if (!facility) {
      return res.status(404).json({ message: 'Facility not found' });
    }

    // Check if category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check facility capacity
    console.log('Facility:', facility.toJSON());

    // If maxCapacity is not defined, set a default value
    if (!facility.maxCapacity) {
      console.log('Setting default maxCapacity to 20');
      facility.maxCapacity = 20;
      await facility.save();
    }

    // Get current places count
    const currentPlacesCount = await Place.count({ where: { facilityId } });

    // Calculate how many places we can create
    const placesToCreate = facility.maxCapacity - currentPlacesCount;
    console.log('Places to create:', placesToCreate, 'maxCapacity:', facility.maxCapacity, 'currentPlacesCount:', currentPlacesCount);

    if (placesToCreate <= 0) {
      return res.status(400).json({ message: 'Facility has reached maximum capacity' });
    }

    // Get the count from the request body or default to 1
    const actualPlacesToCreate = req.body.count || 1;

    // Start transaction
    transaction = await sequelize.transaction();

    // Create places
    const placesData = [];
    for (let i = 1; i <= actualPlacesToCreate; i++) {
      placesData.push({
        facilityId,
        categoryId,
        name: `Platz ${currentPlacesCount + i}`,
        isOccupied: false,
        genderSuitability: genderSuitability || 'all',
        minAge: minAge !== undefined ? minAge : 0,
        maxAge: maxAge !== undefined ? maxAge : 18,
        lastUpdated: new Date(),
      });
    }

    // Bulk create places
    const createdPlaces = await Place.bulkCreate(placesData, { transaction });

    // Commit transaction
    await transaction.commit();

    // Return success
    return res.status(201).json({
      message: `${createdPlaces.length} places created successfully`,
      count: createdPlaces.length,
      data: createdPlaces,
    });
  } catch (error) {
    // Rollback transaction if it exists
    if (transaction) {
      await transaction.rollback();
    }

    logger.error('Error bulk creating places:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
