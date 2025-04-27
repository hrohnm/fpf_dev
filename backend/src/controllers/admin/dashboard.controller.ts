import { Request, Response, NextFunction } from 'express';
import { Facility } from '../../models/facility.model';
import { Carrier } from '../../models/carrier.model';
import { Availability } from '../../models/availability.model';
import { Category } from '../../models/category.model';
import { sequelize } from '../../models';
import { Op } from 'sequelize';

/**
 * Get dashboard data for admin
 * @route GET /api/admin/dashboard
 */
export const getDashboardData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get total facilities count
    const totalFacilities = await Facility.count();

    // Get total carriers count
    const totalCarriers = await Carrier.count();

    // Get total available places
    const availabilitiesSum = await Availability.sum('availablePlaces');
    const totalAvailablePlaces = availabilitiesSum || 0;

    // Calculate occupancy rate
    const totalCapacitySum = await Availability.sum('totalPlaces');
    const totalCapacity = totalCapacitySum || 0;
    const occupancyRate = totalCapacity ?
      parseFloat((100 - (totalAvailablePlaces / totalCapacity * 100)).toFixed(1)) :
      0;

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
      occupancyRate,
      recentUpdates: formattedUpdates
    });
  } catch (error) {
    next(error);
  }
};
