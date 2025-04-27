import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { Facility } from '../../models/facility.model';
import { Carrier } from '../../models/carrier.model';
import { FacilityImage } from '../../models/facility-image.model';
import { Availability } from '../../models/availability.model';
import { Category } from '../../models/category.model';
import { CarrierUser } from '../../models/carrier-user.model';
import { HttpException } from '../../utils/http-exception';
import { SystemLog } from '../../models/system-log.model';
import sequelize from '../../config/db.config';

/**
 * Get all facilities with pagination and filtering
 * @route GET /api/carrier/facilities
 */
export const getFacilities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      carrierId,
      city,
      postalCode,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // Build query conditions
    const whereConditions: any = {};
    
    if (search) {
      whereConditions[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { contactPerson: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } },
      ];
    }
    
    if (carrierId) {
      whereConditions.carrierId = carrierId;
    } else if (req.user?.role === 'carrier') {
      // If user is a carrier, only show facilities from carriers they are associated with
      const carrierIds = await CarrierUser.findAll({
        where: { userId: req.user.id },
        attributes: ['carrierId'],
      }).then(associations => associations.map(a => a.carrierId));
      
      whereConditions.carrierId = { [Op.in]: carrierIds };
    }
    
    if (city) {
      whereConditions.city = { [Op.iLike]: `%${city}%` };
    }
    
    if (postalCode) {
      whereConditions.postalCode = { [Op.iLike]: `%${postalCode}%` };
    }
    
    if (isActive !== undefined) {
      whereConditions.isActive = isActive === 'true';
    }

    // Calculate pagination
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Get facilities with pagination
    const { count, rows: facilities } = await Facility.findAndCountAll({
      where: whereConditions,
      order: [[sortBy as string, sortOrder as string]],
      limit: limitNumber,
      offset,
      include: [
        {
          model: Carrier,
          as: 'carrier',
          attributes: ['id', 'name'],
        },
        {
          model: FacilityImage,
          as: 'images',
          attributes: ['id', 'url', 'caption', 'isMain'],
          where: { isMain: true },
          required: false,
          limit: 1,
        },
        {
          model: Availability,
          as: 'availabilities',
          attributes: ['id', 'categoryId', 'availablePlaces', 'lastUpdated'],
          include: [
            {
              model: Category,
              as: 'category',
              attributes: ['id', 'name'],
            },
          ],
          required: false,
        },
      ],
    });

    // Calculate total pages
    const totalPages = Math.ceil(count / limitNumber);

    res.json({
      data: facilities,
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
 * Get facility by ID
 * @route GET /api/carrier/facilities/:id
 */
export const getFacilityById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Find facility by ID
    const facility = await Facility.findByPk(id, {
      include: [
        {
          model: Carrier,
          as: 'carrier',
          attributes: ['id', 'name'],
        },
        {
          model: FacilityImage,
          as: 'images',
          attributes: ['id', 'url', 'caption', 'isMain'],
        },
        {
          model: Availability,
          as: 'availabilities',
          include: [
            {
              model: Category,
              as: 'category',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
    });

    if (!facility) {
      throw new HttpException(404, 'Einrichtung nicht gefunden');
    }

    // Check if user has access to this facility
    if (req.user?.role === 'carrier') {
      const hasAccess = await CarrierUser.findOne({
        where: {
          userId: req.user.id,
          carrierId: facility.carrierId,
        },
      });

      if (!hasAccess) {
        throw new HttpException(403, 'Sie haben keinen Zugriff auf diese Einrichtung');
      }
    }

    res.json(facility);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new facility
 * @route POST /api/carrier/facilities
 */
export const createFacility = async (req: Request, res: Response, next: NextFunction) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      carrierId,
      name,
      description,
      contactPerson,
      email,
      phone,
      address,
      city,
      postalCode,
      latitude,
      longitude,
      openingHours,
      maxCapacity,
    } = req.body;

    // Check if user has access to this carrier
    if (req.user?.role === 'carrier') {
      const hasAccess = await CarrierUser.findOne({
        where: {
          userId: req.user.id,
          carrierId,
        },
      });

      if (!hasAccess) {
        throw new HttpException(403, 'Sie haben keinen Zugriff auf diesen Träger');
      }
    }

    // Create facility
    const facility = await Facility.create(
      {
        carrierId,
        name,
        description,
        contactPerson,
        email,
        phone,
        address,
        city,
        postalCode,
        latitude,
        longitude,
        openingHours,
        maxCapacity,
        isActive: true,
      },
      { transaction }
    );

    // Log facility creation
    await SystemLog.create(
      {
        userId: req.user?.id,
        action: 'create',
        entity: 'facility',
        entityId: facility.id,
        details: { name, carrierId },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
      { transaction }
    );

    await transaction.commit();

    // Fetch the created facility with associations
    const createdFacility = await Facility.findByPk(facility.id, {
      include: [
        {
          model: Carrier,
          as: 'carrier',
          attributes: ['id', 'name'],
        },
      ],
    });

    res.status(201).json(createdFacility);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

/**
 * Update a facility
 * @route PUT /api/carrier/facilities/:id
 */
export const updateFacility = async (req: Request, res: Response, next: NextFunction) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const {
      name,
      description,
      contactPerson,
      email,
      phone,
      address,
      city,
      postalCode,
      latitude,
      longitude,
      openingHours,
      maxCapacity,
      isActive,
    } = req.body;

    // Find facility by ID
    const facility = await Facility.findByPk(id);
    if (!facility) {
      throw new HttpException(404, 'Einrichtung nicht gefunden');
    }

    // Check if user has access to this facility
    if (req.user?.role === 'carrier') {
      const hasAccess = await CarrierUser.findOne({
        where: {
          userId: req.user.id,
          carrierId: facility.carrierId,
        },
      });

      if (!hasAccess) {
        throw new HttpException(403, 'Sie haben keinen Zugriff auf diese Einrichtung');
      }
    }

    // Update facility
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (contactPerson !== undefined) updateData.contactPerson = contactPerson;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (postalCode !== undefined) updateData.postalCode = postalCode;
    if (latitude !== undefined) updateData.latitude = latitude;
    if (longitude !== undefined) updateData.longitude = longitude;
    if (openingHours !== undefined) updateData.openingHours = openingHours;
    if (maxCapacity !== undefined) updateData.maxCapacity = maxCapacity;
    if (isActive !== undefined) updateData.isActive = isActive;

    await facility.update(updateData, { transaction });

    // Log facility update
    await SystemLog.create(
      {
        userId: req.user?.id,
        action: 'update',
        entity: 'facility',
        entityId: id,
        details: updateData,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
      { transaction }
    );

    await transaction.commit();

    // Fetch the updated facility with associations
    const updatedFacility = await Facility.findByPk(id, {
      include: [
        {
          model: Carrier,
          as: 'carrier',
          attributes: ['id', 'name'],
        },
        {
          model: FacilityImage,
          as: 'images',
          attributes: ['id', 'url', 'caption', 'isMain'],
        },
        {
          model: Availability,
          as: 'availabilities',
          include: [
            {
              model: Category,
              as: 'category',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
    });

    res.json(updatedFacility);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

/**
 * Delete a facility
 * @route DELETE /api/carrier/facilities/:id
 */
export const deleteFacility = async (req: Request, res: Response, next: NextFunction) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;

    // Find facility by ID
    const facility = await Facility.findByPk(id);
    if (!facility) {
      throw new HttpException(404, 'Einrichtung nicht gefunden');
    }

    // Check if user has access to this facility
    if (req.user?.role === 'carrier') {
      const hasAccess = await CarrierUser.findOne({
        where: {
          userId: req.user.id,
          carrierId: facility.carrierId,
        },
      });

      if (!hasAccess) {
        throw new HttpException(403, 'Sie haben keinen Zugriff auf diese Einrichtung');
      }
    }

    // Delete facility images
    await FacilityImage.destroy({
      where: { facilityId: id },
      transaction,
    });

    // Delete facility availabilities
    await Availability.destroy({
      where: { facilityId: id },
      transaction,
    });

    // Delete facility
    await facility.destroy({ transaction });

    // Log facility deletion
    await SystemLog.create(
      {
        userId: req.user?.id,
        action: 'delete',
        entity: 'facility',
        entityId: id,
        details: { name: facility.name, carrierId: facility.carrierId },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
      { transaction }
    );

    await transaction.commit();

    res.status(204).send();
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};
