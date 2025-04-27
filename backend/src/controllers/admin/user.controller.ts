import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { User } from '../../models/user.model';
import { Carrier } from '../../models/carrier.model';
import { CarrierUser } from '../../models/carrier-user.model';
import { HttpException } from '../../utils/http-exception';
import { SystemLog } from '../../models/system-log.model';
import sequelize from '../../config/db.config';

/**
 * Get all users with pagination and filtering
 * @route GET /api/admin/users
 */
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      role,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // Build query conditions
    const whereConditions: any = {};
    
    if (search) {
      whereConditions[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }
    
    if (role) {
      whereConditions.role = role;
    }
    
    if (isActive !== undefined) {
      whereConditions.isActive = isActive === 'true';
    }

    // Calculate pagination
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Get users with pagination
    const { count, rows: users } = await User.findAndCountAll({
      where: whereConditions,
      order: [[sortBy as string, sortOrder as string]],
      limit: limitNumber,
      offset,
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Carrier,
          through: { attributes: [] },
          attributes: ['id', 'name'],
          as: 'Carriers',
        },
      ],
    });

    // Calculate total pages
    const totalPages = Math.ceil(count / limitNumber);

    res.json({
      data: users,
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
 * Get user by ID
 * @route GET /api/admin/users/:id
 */
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Find user by ID
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Carrier,
          through: { attributes: [] },
          attributes: ['id', 'name'],
          as: 'Carriers',
        },
      ],
    });

    if (!user) {
      throw new HttpException(404, 'Benutzer nicht gefunden');
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new user
 * @route POST /api/admin/users
 */
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { email, password, firstName, lastName, role, isActive, carrierIds } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new HttpException(409, 'E-Mail wird bereits verwendet');
    }

    // Create user
    const user = await User.create(
      {
        email,
        password,
        firstName,
        lastName,
        role,
        isActive: isActive !== undefined ? isActive : true,
      },
      { transaction }
    );

    // Associate user with carriers if provided
    if (carrierIds && carrierIds.length > 0) {
      const carrierUserAssociations = carrierIds.map((carrierId: string) => ({
        userId: user.id,
        carrierId,
      }));

      await CarrierUser.bulkCreate(carrierUserAssociations, { transaction });
    }

    // Log user creation
    await SystemLog.create(
      {
        userId: req.user?.id,
        action: 'create',
        entity: 'user',
        entityId: user.id,
        details: { role, email },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
      { transaction }
    );

    await transaction.commit();

    // Fetch the created user with associations
    const createdUser = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Carrier,
          through: { attributes: [] },
          attributes: ['id', 'name'],
          as: 'Carriers',
        },
      ],
    });

    res.status(201).json(createdUser);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

/**
 * Update a user
 * @route PUT /api/admin/users/:id
 */
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { email, password, firstName, lastName, role, isActive, carrierIds } = req.body;

    // Find user by ID
    const user = await User.findByPk(id);
    if (!user) {
      throw new HttpException(404, 'Benutzer nicht gefunden');
    }

    // Check if email is already used by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new HttpException(409, 'E-Mail wird bereits verwendet');
      }
    }

    // Update user
    const updateData: any = {};
    if (email !== undefined) updateData.email = email;
    if (password !== undefined) updateData.password = password;
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (role !== undefined) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    await user.update(updateData, { transaction });

    // Update carrier associations if provided
    if (carrierIds !== undefined) {
      // Remove existing associations
      await CarrierUser.destroy({
        where: { userId: id },
        transaction,
      });

      // Create new associations
      if (carrierIds.length > 0) {
        const carrierUserAssociations = carrierIds.map((carrierId: string) => ({
          userId: id,
          carrierId,
        }));

        await CarrierUser.bulkCreate(carrierUserAssociations, { transaction });
      }
    }

    // Log user update
    await SystemLog.create(
      {
        userId: req.user?.id,
        action: 'update',
        entity: 'user',
        entityId: id,
        details: updateData,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
      { transaction }
    );

    await transaction.commit();

    // Fetch the updated user with associations
    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Carrier,
          through: { attributes: [] },
          attributes: ['id', 'name'],
          as: 'Carriers',
        },
      ],
    });

    res.json(updatedUser);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

/**
 * Delete a user
 * @route DELETE /api/admin/users/:id
 */
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;

    // Find user by ID
    const user = await User.findByPk(id);
    if (!user) {
      throw new HttpException(404, 'Benutzer nicht gefunden');
    }

    // Check if user is the last admin
    if (user.role === 'admin') {
      const adminCount = await User.count({ where: { role: 'admin' } });
      if (adminCount <= 1) {
        throw new HttpException(400, 'Der letzte Administrator kann nicht gelöscht werden');
      }
    }

    // Remove carrier associations
    await CarrierUser.destroy({
      where: { userId: id },
      transaction,
    });

    // Delete user
    await user.destroy({ transaction });

    // Log user deletion
    await SystemLog.create(
      {
        userId: req.user?.id,
        action: 'delete',
        entity: 'user',
        entityId: id,
        details: { email: user.email, role: user.role },
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
