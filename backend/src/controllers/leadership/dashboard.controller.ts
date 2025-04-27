import { Request, Response, NextFunction } from 'express';
import { Facility } from '../../models/facility.model';
import { Carrier } from '../../models/carrier.model';
import { Availability } from '../../models/availability.model';
import { Category } from '../../models/category.model';
import { User } from '../../models/user.model';
import { Op } from 'sequelize';

/**
 * Get dashboard data for leadership
 * @route GET /api/leadership/dashboard
 */
export const getDashboardData = async (_req: Request, res: Response, next: NextFunction) => {
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

    // Get total users count by role
    const users = await User.findAll();
    const usersByRole = {
      admin: users.filter(user => user.role === 'admin').length,
      carrier: users.filter(user => user.role === 'carrier').length,
      manager: users.filter(user => user.role === 'manager').length,
      leadership: users.filter(user => user.role === 'leadership').length
    };

    // Get category distribution
    const categories = await Category.findAll();
    const availabilities = await Availability.findAll({
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }
      ]
    });

    const categoryDistribution = categories.map(category => {
      const categoryAvailabilities = availabilities.filter(a => a.categoryId === category.id);
      const availablePlaces = categoryAvailabilities.reduce((sum, a) => sum + a.availablePlaces, 0);
      const totalPlaces = categoryAvailabilities.reduce((sum, a) => sum + a.totalPlaces, 0);
      const occupancyRate = totalPlaces ? parseFloat((100 - (availablePlaces / totalPlaces * 100)).toFixed(1)) : 0;

      return {
        categoryId: category.id,
        categoryName: category.name,
        availablePlaces,
        totalPlaces,
        occupancyRate
      };
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

    // Format the response for user roles
    const formattedUsersByRole = Object.entries(usersByRole).map(([role, count]) => ({
      role,
      count
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
      occupancyRate,
      usersByRole: formattedUsersByRole,
      categoryDistribution: categoryDistribution,
      recentUpdates: formattedUpdates
    });
  } catch (error) {
    next(error);
  }
};
