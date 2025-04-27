import { Request, Response, NextFunction } from 'express';
import { Carrier } from '../../models/carrier.model';
import { Facility } from '../../models/facility.model';
import { HttpException } from '../../utils/http-exception';
import sequelize from '../../config/db.config';
import { Op } from 'sequelize';

/**
 * Get all carriers with pagination and filtering
 * @route GET /api/admin/carriers
 */
export const getCarriers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      isActive,
      sortBy = 'name',
      sortOrder = 'asc',
    } = req.query;

    // Build filter conditions
    const whereClause: any = {};

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { contactPerson: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } },
        { city: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (isActive !== undefined) {
      whereClause.isActive = isActive === 'true';
    }

    // Calculate pagination
    const offset = (Number(page) - 1) * Number(limit);

    // Get carriers with pagination
    const { count, rows } = await Carrier.findAndCountAll({
      where: whereClause,
      order: [[sortBy as string, sortOrder as string]],
      limit: Number(limit),
      offset,
      include: [
        {
          model: Facility,
          as: 'facilities',
          attributes: ['id', 'name'],
        },
      ],
    });

    // Calculate total pages
    const totalPages = Math.ceil(count / Number(limit));

    res.json({
      data: rows,
      meta: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all carriers without pagination (for dropdowns)
 * @route GET /api/admin/carriers/all
 */
export const getAllCarriers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const carriers = await Carrier.findAll({
      order: [['name', 'ASC']],
      attributes: ['id', 'name'],
    });

    res.json(carriers);
  } catch (error) {
    next(error);
  }
};

/**
 * Get carrier by ID
 * @route GET /api/admin/carriers/:id
 */
export const getCarrierById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const carrier = await Carrier.findByPk(id, {
      include: [
        {
          model: Facility,
          as: 'facilities',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!carrier) {
      throw new HttpException(404, 'Träger nicht gefunden');
    }

    res.json(carrier);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new carrier
 * @route POST /api/admin/carriers
 */
export const createCarrier = async (req: Request, res: Response, next: NextFunction) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      name,
      description,
      contactPerson,
      email,
      phone,
      address,
      city,
      postalCode,
      isPremium,
      isActive,
    } = req.body;

    // Create carrier
    const carrier = await Carrier.create(
      {
        name,
        description,
        contactPerson,
        email,
        phone,
        address,
        city,
        postalCode,
        isPremium: isPremium !== undefined ? isPremium : false,
        isActive: isActive !== undefined ? isActive : true,
      },
      { transaction }
    );

    await transaction.commit();

    res.status(201).json(carrier);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

/**
 * Update a carrier
 * @route PUT /api/admin/carriers/:id
 */
export const updateCarrier = async (req: Request, res: Response, next: NextFunction) => {
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
      isPremium,
      isActive,
    } = req.body;

    // Find carrier
    const carrier = await Carrier.findByPk(id);

    if (!carrier) {
      throw new HttpException(404, 'Träger nicht gefunden');
    }

    // Update carrier
    await carrier.update(
      {
        name: name !== undefined ? name : carrier.name,
        description: description !== undefined ? description : carrier.description,
        contactPerson: contactPerson !== undefined ? contactPerson : carrier.contactPerson,
        email: email !== undefined ? email : carrier.email,
        phone: phone !== undefined ? phone : carrier.phone,
        address: address !== undefined ? address : carrier.address,
        city: city !== undefined ? city : carrier.city,
        postalCode: postalCode !== undefined ? postalCode : carrier.postalCode,
        isPremium: isPremium !== undefined ? isPremium : carrier.isPremium,
        isActive: isActive !== undefined ? isActive : carrier.isActive,
      },
      { transaction }
    );

    await transaction.commit();

    // Get updated carrier
    const updatedCarrier = await Carrier.findByPk(id, {
      include: [
        {
          model: Facility,
          as: 'facilities',
          attributes: ['id', 'name'],
        },
      ],
    });

    res.json(updatedCarrier);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

/**
 * Delete a carrier
 * @route DELETE /api/admin/carriers/:id
 */
export const deleteCarrier = async (req: Request, res: Response, next: NextFunction) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;

    // Find carrier
    const carrier = await Carrier.findByPk(id);

    if (!carrier) {
      throw new HttpException(404, 'Träger nicht gefunden');
    }

    // Check if carrier has facilities
    const facilities = await Facility.findAll({
      where: { carrierId: id },
    });

    if (facilities.length > 0) {
      throw new HttpException(400, 'Träger kann nicht gelöscht werden, da er Einrichtungen hat');
    }

    // Delete carrier
    await carrier.destroy({ transaction });

    await transaction.commit();

    res.status(204).send();
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};
