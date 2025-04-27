import { Request, Response, NextFunction } from 'express';
import { Facility } from '../../models/facility.model';
import { Carrier } from '../../models/carrier.model';
import { Availability } from '../../models/availability.model';
import { Category } from '../../models/category.model';
import { Favorite } from '../../models/favorite.model';
import { Op } from 'sequelize';

/**
 * Get dashboard data for manager
 * @route GET /api/manager/dashboard
 */
export const getDashboardData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Get total facilities count
    const totalFacilities = await Facility.count();
    
    // Get total carriers count
    const totalCarriers = await Carrier.count();
    
    // Get total available places
    const availabilitiesSum = await Availability.sum('availablePlaces');
    const totalAvailablePlaces = availabilitiesSum || 0;
    
    // Get user's favorites
    const favorites = await Favorite.findAll({
      where: { userId },
      include: [
        {
          model: Facility,
          as: 'facility',
          attributes: ['id', 'name', 'carrierId'],
          include: [
            {
              model: Carrier,
              as: 'carrier',
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    });
    
    // Get recent updates (facilities with recently updated availabilities)
    const recentUpdates = await Availability.findAll({
      attributes: ['id', 'availablePlaces', 'updatedAt'],
      where: {
        updatedAt: {
          [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 7)) // Last 7 days
        }
      },
      order: [['updatedAt', 'DESC']],
      limit: 5,
      include: [
        {
          model: Facility,
          as: 'facility',
          attributes: ['id', 'name']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }
      ]
    });
    
    // Format the response
    const formattedFavorites = favorites.map(favorite => ({
      facilityId: favorite.facility?.id,
      facilityName: favorite.facility?.name,
      carrierId: favorite.facility?.carrierId,
      carrierName: favorite.facility?.carrier?.name
    }));
    
    const formattedUpdates = recentUpdates.map(update => ({
      facilityId: update.facility?.id,
      facilityName: update.facility?.name,
      categoryId: update.category?.id,
      categoryName: update.category?.name,
      availablePlaces: update.availablePlaces,
      lastUpdated: update.updatedAt
    }));
    
    res.json({
      totalFacilities,
      totalCarriers,
      totalAvailablePlaces,
      favorites: formattedFavorites,
      recentUpdates: formattedUpdates
    });
  } catch (error) {
    next(error);
  }
};
