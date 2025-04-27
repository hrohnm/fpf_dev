import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { Availability } from '../../models/availability.model';
import { Facility } from '../../models/facility.model';
import { Category } from '../../models/category.model';
import { CarrierUser } from '../../models/carrier-user.model';
import { HttpException } from '../../utils/http-exception';
import { SystemLog } from '../../models/system-log.model';
import sequelize from '../../config/db.config';

/**
 * Get all availabilities with pagination and filtering
 * @route GET /api/carrier/availability
 */
export const getAvailabilities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = 1,
      limit = 10,
      facilityId,
      categoryId,
      sortBy = 'lastUpdated',
      sortOrder = 'desc',
    } = req.query;

    const userId = req.user?.id;

    if (!userId) {
      throw new HttpException(401, 'Unauthorized');
    }

    // Get carrier IDs associated with the user
    const carrierUsers = await CarrierUser.findAll({
      where: { userId }
    });

    const carrierIds = carrierUsers.map(cu => cu.carrierId);

    if (carrierIds.length === 0) {
      return res.json({
        data: [],
        meta: {
          total: 0,
          page: Number(page),
          limit: Number(limit),
          totalPages: 0,
        },
      });
    }

    // Get facilities for this carrier
    const facilities = await Facility.findAll({
      attributes: ['id'],
      where: {
        carrierId: {
          [Op.in]: carrierIds
        }
      }
    });

    const facilityIds = facilities.map(f => f.id);

    // Build query conditions
    const whereConditions: any = {
      facilityId: {
        [Op.in]: facilityIds
      }
    };

    if (facilityId) {
      // Check if the facility belongs to the carrier
      const facilityExists = facilityIds.includes(facilityId as string);
      if (!facilityExists) {
        throw new HttpException(403, 'Sie haben keinen Zugriff auf diese Einrichtung');
      }
      whereConditions.facilityId = facilityId;
    }

    if (categoryId) {
      whereConditions.categoryId = categoryId;
    }

    // Calculate pagination
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Get availabilities with pagination
    const { count, rows: availabilities } = await Availability.findAndCountAll({
      where: whereConditions,
      order: [[sortBy as string, sortOrder as string]],
      limit: limitNumber,
      offset,
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

    // Calculate total pages
    const totalPages = Math.ceil(count / limitNumber);

    res.json({
      data: availabilities,
      meta: {
        total: count,
        page: pageNumber,
        limit: limitNumber,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get availability by ID
 * @route GET /api/carrier/availability/:id
 */
export const getAvailabilityById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new HttpException(401, 'Unauthorized');
    }

    // Find availability by ID
    const availability = await Availability.findByPk(id, {
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

    if (!availability) {
      throw new HttpException(404, 'Verfügbarkeit nicht gefunden');
    }

    // Check if user has access to this facility
    const carrierUsers = await CarrierUser.findAll({
      where: { userId }
    });

    const carrierIds = carrierUsers.map(cu => cu.carrierId);
    
    const facility = await Facility.findByPk(availability.facilityId);
    
    if (!facility) {
      throw new HttpException(404, 'Einrichtung nicht gefunden');
    }

    if (!carrierIds.includes(facility.carrierId)) {
      throw new HttpException(403, 'Sie haben keinen Zugriff auf diese Einrichtung');
    }

    res.json(availability);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new availability
 * @route POST /api/carrier/availability
 */
export const createAvailability = async (req: Request, res: Response, next: NextFunction) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      facilityId,
      categoryId,
      availablePlaces,
      totalPlaces,
      genderSuitability,
      minAge,
      maxAge,
      notes,
    } = req.body;

    const userId = req.user?.id;

    if (!userId) {
      throw new HttpException(401, 'Unauthorized');
    }

    // Check if user has access to this facility
    const facility = await Facility.findByPk(facilityId);
    
    if (!facility) {
      throw new HttpException(404, 'Einrichtung nicht gefunden');
    }

    const carrierUsers = await CarrierUser.findAll({
      where: { userId }
    });

    const carrierIds = carrierUsers.map(cu => cu.carrierId);

    if (!carrierIds.includes(facility.carrierId)) {
      throw new HttpException(403, 'Sie haben keinen Zugriff auf diese Einrichtung');
    }

    // Check if category exists
    const category = await Category.findByPk(categoryId);
    
    if (!category) {
      throw new HttpException(404, 'Kategorie nicht gefunden');
    }

    // Check if availability already exists for this facility and category
    const existingAvailability = await Availability.findOne({
      where: {
        facilityId,
        categoryId,
      },
    });

    if (existingAvailability) {
      throw new HttpException(400, 'Es existiert bereits eine Verfügbarkeit für diese Einrichtung und Kategorie');
    }

    // Create availability
    const availability = await Availability.create(
      {
        facilityId,
        categoryId,
        availablePlaces,
        totalPlaces,
        genderSuitability,
        minAge,
        maxAge,
        notes,
        lastUpdated: new Date(),
      },
      { transaction }
    );

    // Log availability creation
    await SystemLog.create(
      {
        userId,
        action: 'create',
        entity: 'availability',
        entityId: availability.id,
        details: { facilityId, categoryId, availablePlaces },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
      { transaction }
    );

    await transaction.commit();

    // Fetch the created availability with associations
    const createdAvailability = await Availability.findByPk(availability.id, {
      include: [
        {
          model: Facility,
          as: 'facility',
          attributes: ['id', 'name'],
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
    });

    res.status(201).json(createdAvailability);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

/**
 * Update an availability
 * @route PUT /api/carrier/availability/:id
 */
export const updateAvailability = async (req: Request, res: Response, next: NextFunction) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const {
      availablePlaces,
      totalPlaces,
      genderSuitability,
      minAge,
      maxAge,
      notes,
    } = req.body;

    const userId = req.user?.id;

    if (!userId) {
      throw new HttpException(401, 'Unauthorized');
    }

    // Find availability by ID
    const availability = await Availability.findByPk(id);
    
    if (!availability) {
      throw new HttpException(404, 'Verfügbarkeit nicht gefunden');
    }

    // Check if user has access to this facility
    const facility = await Facility.findByPk(availability.facilityId);
    
    if (!facility) {
      throw new HttpException(404, 'Einrichtung nicht gefunden');
    }

    const carrierUsers = await CarrierUser.findAll({
      where: { userId }
    });

    const carrierIds = carrierUsers.map(cu => cu.carrierId);

    if (!carrierIds.includes(facility.carrierId)) {
      throw new HttpException(403, 'Sie haben keinen Zugriff auf diese Einrichtung');
    }

    // Update availability
    await availability.update(
      {
        availablePlaces,
        totalPlaces,
        genderSuitability,
        minAge,
        maxAge,
        notes,
        lastUpdated: new Date(),
      },
      { transaction }
    );

    // Log availability update
    await SystemLog.create(
      {
        userId,
        action: 'update',
        entity: 'availability',
        entityId: availability.id,
        details: { facilityId: availability.facilityId, categoryId: availability.categoryId, availablePlaces },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
      { transaction }
    );

    await transaction.commit();

    // Fetch the updated availability with associations
    const updatedAvailability = await Availability.findByPk(id, {
      include: [
        {
          model: Facility,
          as: 'facility',
          attributes: ['id', 'name'],
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
    });

    res.json(updatedAvailability);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

/**
 * Delete an availability
 * @route DELETE /api/carrier/availability/:id
 */
export const deleteAvailability = async (req: Request, res: Response, next: NextFunction) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new HttpException(401, 'Unauthorized');
    }

    // Find availability by ID
    const availability = await Availability.findByPk(id);
    
    if (!availability) {
      throw new HttpException(404, 'Verfügbarkeit nicht gefunden');
    }

    // Check if user has access to this facility
    const facility = await Facility.findByPk(availability.facilityId);
    
    if (!facility) {
      throw new HttpException(404, 'Einrichtung nicht gefunden');
    }

    const carrierUsers = await CarrierUser.findAll({
      where: { userId }
    });

    const carrierIds = carrierUsers.map(cu => cu.carrierId);

    if (!carrierIds.includes(facility.carrierId)) {
      throw new HttpException(403, 'Sie haben keinen Zugriff auf diese Einrichtung');
    }

    // Log availability deletion
    await SystemLog.create(
      {
        userId,
        action: 'delete',
        entity: 'availability',
        entityId: availability.id,
        details: { facilityId: availability.facilityId, categoryId: availability.categoryId },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
      { transaction }
    );

    // Delete availability
    await availability.destroy({ transaction });

    await transaction.commit();

    res.status(204).end();
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

/**
 * Bulk update availabilities
 * @route PUT /api/carrier/availability/bulk
 */
export const bulkUpdateAvailabilities = async (req: Request, res: Response, next: NextFunction) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { availabilities } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new HttpException(401, 'Unauthorized');
    }

    if (!Array.isArray(availabilities) || availabilities.length === 0) {
      throw new HttpException(400, 'Keine Verfügbarkeiten zum Aktualisieren angegeben');
    }

    // Get carrier IDs associated with the user
    const carrierUsers = await CarrierUser.findAll({
      where: { userId }
    });

    const carrierIds = carrierUsers.map(cu => cu.carrierId);

    // Get facilities for this carrier
    const facilities = await Facility.findAll({
      where: {
        carrierId: {
          [Op.in]: carrierIds
        }
      }
    });

    const facilityIds = facilities.map(f => f.id);

    // Check if all facilities belong to the carrier
    for (const item of availabilities) {
      if (!facilityIds.includes(item.facilityId)) {
        throw new HttpException(403, 'Sie haben keinen Zugriff auf eine oder mehrere Einrichtungen');
      }
    }

    // Update availabilities
    const updatedAvailabilities = [];

    for (const item of availabilities) {
      const { id, availablePlaces } = item;

      // Find availability by ID
      const availability = await Availability.findByPk(id);
      
      if (!availability) {
        continue; // Skip if not found
      }

      // Update availability
      await availability.update(
        {
          availablePlaces,
          lastUpdated: new Date(),
        },
        { transaction }
      );

      // Log availability update
      await SystemLog.create(
        {
          userId,
          action: 'update',
          entity: 'availability',
          entityId: availability.id,
          details: { facilityId: availability.facilityId, categoryId: availability.categoryId, availablePlaces },
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
        },
        { transaction }
      );

      updatedAvailabilities.push(availability);
    }

    await transaction.commit();

    res.json({
      message: `${updatedAvailabilities.length} Verfügbarkeiten aktualisiert`,
      updatedCount: updatedAvailabilities.length,
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};
