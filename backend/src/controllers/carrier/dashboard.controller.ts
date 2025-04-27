import { Request, Response, NextFunction } from 'express';
import { Facility } from '../../models/facility.model';
import { Availability } from '../../models/availability.model';
import { Category } from '../../models/category.model';
import { CarrierUser } from '../../models/carrier-user.model';
import { Op } from 'sequelize';

/**
 * Get dashboard data for carrier
 * @route GET /api/carrier/dashboard
 */
export const getDashboardData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get carrier IDs associated with the user
    const carrierUsers = await CarrierUser.findAll({
      where: { userId }
    });

    const carrierIds = carrierUsers.map(cu => cu.carrierId);

    if (carrierIds.length === 0) {
      return res.json({
        totalFacilities: 0,
        totalAvailablePlaces: 0,
        occupancyRate: 0,
        recentUpdates: []
      });
    }

    // Get total facilities count for this carrier
    const totalFacilities = await Facility.count({
      where: {
        carrierId: {
          [Op.in]: carrierIds
        }
      }
    });

    // Get facility IDs for this carrier
    const facilities = await Facility.findAll({
      attributes: ['id'],
      where: {
        carrierId: {
          [Op.in]: carrierIds
        }
      }
    });

    const facilityIds = facilities.map(f => f.id);

    // Get total available places for this carrier
    const availabilities = await Availability.findAll({
      where: {
        facilityId: {
          [Op.in]: facilityIds
        }
      }
    });

    const totalAvailablePlaces = availabilities.reduce((sum, a) => sum + a.availablePlaces, 0);
    const totalCapacity = availabilities.reduce((sum, a) => sum + (a.totalPlaces || 0), 0);

    // Calculate occupancy rate
    const occupancyRate = totalCapacity ?
      parseFloat((100 - (totalAvailablePlaces / totalCapacity * 100)).toFixed(1)) :
      0;

    // Get recent updates (facilities with recently updated availabilities)
    const recentUpdates = await Availability.findAll({
      attributes: ['id', 'availablePlaces', 'updatedAt'],
      where: {
        facilityId: {
          [Op.in]: facilityIds
        },
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
      totalAvailablePlaces,
      occupancyRate,
      recentUpdates: formattedUpdates
    });
  } catch (error) {
    next(error);
  }
};
