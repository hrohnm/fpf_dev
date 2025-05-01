import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { Hour } from '../../models/hour.model';
import { Facility } from '../../models/facility.model';
import { Category } from '../../models/category.model';
import { CarrierUser } from '../../models/carrier-user.model';
import { HttpException } from '../../utils/http-exception';
import { SystemLog } from '../../models/system-log.model';
import sequelize from '../../config/db.config';

/**
 * Get hours by facility with pagination and filtering
 * @route GET /api/carrier/hours/facility/:facilityId
 */
export const getHoursByFacility = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { facilityId } = req.params;
    const {
      page = 1,
      limit = 10,
      categoryId,
      genderSuitability,
      minAvailableHours,
      sortBy = 'name',
      sortOrder = 'asc',
    } = req.query;

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

    // Build where clause
    const whereClause: any = {
      facilityId,
    };

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    if (genderSuitability) {
      whereClause.genderSuitability = genderSuitability;
    }

    if (minAvailableHours) {
      whereClause.availableHours = {
        [Op.gte]: Number(minAvailableHours),
      };
    }

    // Calculate pagination
    const offset = (Number(page) - 1) * Number(limit);
    
    // Get hours with pagination
    const { count, rows } = await Hour.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'unitType'],
        },
      ],
      order: [[sortBy as string, sortOrder as string]],
      limit: Number(limit),
      offset,
    });

    // Return paginated results
    res.json({
      data: rows,
      meta: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get hour by ID
 * @route GET /api/carrier/hours/:id
 */
export const getHourById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const userId = req.user?.id;

    if (!userId) {
      throw new HttpException(401, 'Unauthorized');
    }

    // Get hour with category
    const hour = await Hour.findByPk(id, {
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'unitType'],
        },
      ],
    });
    
    if (!hour) {
      throw new HttpException(404, 'Stunden nicht gefunden');
    }

    // Check if user has access to this facility
    const facility = await Facility.findByPk(hour.facilityId);
    
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

    res.json(hour);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new hour entry
 * @route POST /api/carrier/hours
 */
export const createHour = async (req: Request, res: Response, next: NextFunction) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      facilityId,
      categoryId,
      name,
      totalHours,
      availableHours,
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

    // Check if category exists and is of type 'hours'
    const category = await Category.findByPk(categoryId);
    
    if (!category) {
      throw new HttpException(404, 'Kategorie nicht gefunden');
    }

    if (category.unitType !== 'hours') {
      throw new HttpException(400, 'Diese Kategorie ist nicht für Stunden geeignet');
    }

    // Create hour
    const hour = await Hour.create(
      {
        facilityId,
        categoryId,
        name,
        totalHours,
        availableHours,
        genderSuitability,
        minAge,
        maxAge,
        notes,
        lastUpdated: new Date(),
      },
      { transaction }
    );

    // Log hour creation
    await SystemLog.create(
      {
        userId,
        action: 'create',
        entity: 'hour',
        entityId: hour.id,
        details: { facilityId, categoryId, name },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
      { transaction }
    );

    await transaction.commit();

    // Return created hour
    res.status(201).json(hour);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

/**
 * Update an hour entry
 * @route PUT /api/carrier/hours/:id
 */
export const updateHour = async (req: Request, res: Response, next: NextFunction) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const {
      name,
      totalHours,
      availableHours,
      genderSuitability,
      minAge,
      maxAge,
      notes,
    } = req.body;

    const userId = req.user?.id;

    if (!userId) {
      throw new HttpException(401, 'Unauthorized');
    }

    // Find hour by ID
    const hour = await Hour.findByPk(id);
    
    if (!hour) {
      throw new HttpException(404, 'Stunden nicht gefunden');
    }

    // Check if user has access to this facility
    const facility = await Facility.findByPk(hour.facilityId);
    
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

    // Update hour
    await hour.update(
      {
        name,
        totalHours,
        availableHours,
        genderSuitability,
        minAge,
        maxAge,
        notes,
        lastUpdated: new Date(),
      },
      { transaction }
    );

    // Log hour update
    await SystemLog.create(
      {
        userId,
        action: 'update',
        entity: 'hour',
        entityId: hour.id,
        details: { facilityId: hour.facilityId, categoryId: hour.categoryId, name },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
      { transaction }
    );

    await transaction.commit();

    // Return updated hour
    res.json(hour);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

/**
 * Delete an hour entry
 * @route DELETE /api/carrier/hours/:id
 */
export const deleteHour = async (req: Request, res: Response, next: NextFunction) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;

    const userId = req.user?.id;

    if (!userId) {
      throw new HttpException(401, 'Unauthorized');
    }

    // Find hour by ID
    const hour = await Hour.findByPk(id);
    
    if (!hour) {
      throw new HttpException(404, 'Stunden nicht gefunden');
    }

    // Check if user has access to this facility
    const facility = await Facility.findByPk(hour.facilityId);
    
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

    // Store hour details for logging
    const hourDetails = {
      facilityId: hour.facilityId,
      categoryId: hour.categoryId,
      name: hour.name,
    };

    // Delete hour
    await hour.destroy({ transaction });

    // Log hour deletion
    await SystemLog.create(
      {
        userId,
        action: 'delete',
        entity: 'hour',
        entityId: id,
        details: hourDetails,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
      { transaction }
    );

    await transaction.commit();

    // Return success
    res.status(204).end();
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

/**
 * Bulk create hours
 * @route POST /api/carrier/hours/bulk/:facilityId
 */
export const bulkCreateHours = async (req: Request, res: Response, next: NextFunction) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { facilityId } = req.params;
    const {
      categoryId,
      totalHours,
      availableHours,
      genderSuitability,
      minAge,
      maxAge,
      name,
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

    // Check if category exists and is of type 'hours'
    const category = await Category.findByPk(categoryId);
    
    if (!category) {
      throw new HttpException(404, 'Kategorie nicht gefunden');
    }

    if (category.unitType !== 'hours') {
      throw new HttpException(400, 'Diese Kategorie ist nicht für Stunden geeignet');
    }

    // Create hour
    const hour = await Hour.create(
      {
        facilityId,
        categoryId,
        name: name || `${category.name} Stunden`,
        totalHours,
        availableHours,
        genderSuitability,
        minAge,
        maxAge,
        lastUpdated: new Date(),
      },
      { transaction }
    );

    // Log hour creation
    await SystemLog.create(
      {
        userId,
        action: 'create',
        entity: 'hour',
        entityId: hour.id,
        details: { facilityId, categoryId, name: hour.name },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
      { transaction }
    );

    await transaction.commit();

    // Return created hour
    res.status(201).json({
      success: true,
      hour,
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

/**
 * Update available hours
 * @route PATCH /api/carrier/hours/:id/available
 */
export const updateAvailableHours = async (req: Request, res: Response, next: NextFunction) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { availableHours } = req.body;

    const userId = req.user?.id;

    if (!userId) {
      throw new HttpException(401, 'Unauthorized');
    }

    // Find hour by ID
    const hour = await Hour.findByPk(id);
    
    if (!hour) {
      throw new HttpException(404, 'Stunden nicht gefunden');
    }

    // Check if user has access to this facility
    const facility = await Facility.findByPk(hour.facilityId);
    
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

    // Validate available hours
    if (availableHours < 0) {
      throw new HttpException(400, 'Verfügbare Stunden können nicht negativ sein');
    }

    if (availableHours > hour.totalHours) {
      throw new HttpException(400, 'Verfügbare Stunden können nicht größer als Gesamtstunden sein');
    }

    // Update hour
    await hour.update(
      {
        availableHours,
        lastUpdated: new Date(),
      },
      { transaction }
    );

    // Log hour update
    await SystemLog.create(
      {
        userId,
        action: 'update',
        entity: 'hour',
        entityId: hour.id,
        details: { facilityId: hour.facilityId, categoryId: hour.categoryId, availableHours },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
      { transaction }
    );

    await transaction.commit();

    // Return updated hour
    res.json(hour);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

/**
 * Get hour statistics for a facility
 * @route GET /api/carrier/hours/statistics/:facilityId
 */
export const getHourStatistics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { facilityId } = req.params;

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

    // Get total hours
    const totalHoursResult = await Hour.sum('totalHours', {
      where: { facilityId },
    });
    const totalHours = totalHoursResult || 0;

    // Get available hours
    const availableHoursResult = await Hour.sum('availableHours', {
      where: { facilityId },
    });
    const availableHours = availableHoursResult || 0;

    // Get hours by gender suitability
    const maleOnlyHours = await Hour.sum('totalHours', {
      where: { facilityId, genderSuitability: 'male' },
    }) || 0;
    const femaleOnlyHours = await Hour.sum('totalHours', {
      where: { facilityId, genderSuitability: 'female' },
    }) || 0;
    const allGenderHours = await Hour.sum('totalHours', {
      where: { facilityId, genderSuitability: 'all' },
    }) || 0;

    // Get hours by category
    const hoursByCategory = await Hour.findAll({
      attributes: ['categoryId', [sequelize.fn('SUM', sequelize.col('totalHours')), 'total']],
      where: { facilityId },
      group: ['categoryId'],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['name'],
        },
      ],
    });

    // Return statistics
    return res.json({
      totalHours,
      availableHours,
      usedHours: totalHours - availableHours,
      utilizationRate: totalHours > 0 ? Math.round(((totalHours - availableHours) / totalHours) * 100) : 0,
      genderDistribution: {
        maleOnly: maleOnlyHours,
        femaleOnly: femaleOnlyHours,
        allGender: allGenderHours,
      },
      categoryDistribution: hoursByCategory.map((item: any) => ({
        categoryId: item.categoryId,
        categoryName: item.category.name,
        total: parseInt(item.get('total')),
      })),
    });
  } catch (error) {
    next(error);
  }
};
