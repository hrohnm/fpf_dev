import { Request, Response, NextFunction } from 'express';
import { Category } from '../../models/category.model';
import { HttpException } from '../../utils/http-exception';

/**
 * Get all categories (for dropdowns)
 * @route GET /api/carrier/categories/all
 */
export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await Category.findAll({
      where: { isActive: true },
      order: [['name', 'ASC']],
      attributes: ['id', 'name', 'description', 'code', 'unitType', 'parentId', 'isActive'],
    });
    
    res.json(categories);
  } catch (error) {
    next(error);
  }
};
