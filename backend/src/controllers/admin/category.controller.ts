import { Request, Response, NextFunction } from 'express';
import { Category } from '../../models/category.model';
import { HttpException } from '../../utils/http-exception';
import sequelize from '../../config/db.config';
import { Op } from 'sequelize';

/**
 * Get all categories with pagination and filtering
 * @route GET /api/admin/categories
 */
export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      isActive,
      parentId,
      unitType,
      sortBy = 'name',
      sortOrder = 'asc',
    } = req.query;

    // Build filter conditions
    const whereClause: any = {};

    if (search) {
      whereClause.name = { [Op.iLike]: `%${search}%` };
    }

    if (isActive !== undefined) {
      whereClause.isActive = isActive === 'true';
    }

    if (parentId !== undefined) {
      whereClause.parentId = parentId === 'null' ? null : parentId;
    }

    if (unitType) {
      whereClause.unitType = unitType;
    }

    // Calculate pagination
    const offset = (Number(page) - 1) * Number(limit);

    // Get categories with pagination
    const { count, rows } = await Category.findAndCountAll({
      where: whereClause,
      order: [[sortBy as string, sortOrder as string]],
      limit: Number(limit),
      offset,
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
 * Get all categories without pagination (for dropdowns)
 * @route GET /api/admin/categories/all
 */
export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']],
    });

    res.json(categories);
  } catch (error) {
    next(error);
  }
};

/**
 * Get category by ID
 * @route GET /api/admin/categories/:id
 */
export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);

    if (!category) {
      throw new HttpException(404, 'Kategorie nicht gefunden');
    }

    res.json(category);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new category
 * @route POST /api/admin/categories
 */
export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  const transaction = await sequelize.transaction();

  try {
    const { name, description, code, unitType, parentId, isActive } = req.body;

    // Check if parent category exists if provided
    if (parentId) {
      const parentCategory = await Category.findByPk(parentId);
      if (!parentCategory) {
        throw new HttpException(404, 'Übergeordnete Kategorie nicht gefunden');
      }
    }

    // Create category
    const category = await Category.create(
      {
        name,
        description,
        code,
        unitType,
        parentId,
        isActive: isActive !== undefined ? isActive : true,
      },
      { transaction }
    );

    await transaction.commit();

    res.status(201).json(category);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

/**
 * Update a category
 * @route PUT /api/admin/categories/:id
 */
export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { name, description, code, unitType, parentId, isActive } = req.body;

    // Find category
    const category = await Category.findByPk(id);

    if (!category) {
      throw new HttpException(404, 'Kategorie nicht gefunden');
    }

    // Check if parent category exists if provided
    if (parentId && parentId !== category.parentId) {
      const parentCategory = await Category.findByPk(parentId);
      if (!parentCategory) {
        throw new HttpException(404, 'Übergeordnete Kategorie nicht gefunden');
      }

      // Prevent circular references
      if (parentId === id) {
        throw new HttpException(400, 'Eine Kategorie kann nicht sich selbst als übergeordnete Kategorie haben');
      }
    }

    // Update category
    await category.update(
      {
        name: name !== undefined ? name : category.name,
        description: description !== undefined ? description : category.description,
        code: code !== undefined ? code : category.code,
        unitType: unitType !== undefined ? unitType : category.unitType,
        parentId: parentId !== undefined ? parentId : category.parentId,
        isActive: isActive !== undefined ? isActive : category.isActive,
      },
      { transaction }
    );

    await transaction.commit();

    // Get updated category
    const updatedCategory = await Category.findByPk(id);

    res.json(updatedCategory);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

/**
 * Delete a category
 * @route DELETE /api/admin/categories/:id
 */
export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;

    // Find category
    const category = await Category.findByPk(id);

    if (!category) {
      throw new HttpException(404, 'Kategorie nicht gefunden');
    }

    // Check if category has children
    const childCategories = await Category.findAll({
      where: { parentId: id },
    });

    if (childCategories.length > 0) {
      throw new HttpException(400, 'Kategorie kann nicht gelöscht werden, da sie untergeordnete Kategorien hat');
    }

    // Delete category
    await category.destroy({ transaction });

    await transaction.commit();

    res.status(204).send();
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};
