import { Request, Response, NextFunction } from 'express';
import { Op, Sequelize } from 'sequelize';
import { Facility } from '../../models/facility.model';
import { Carrier } from '../../models/carrier.model';
import { FacilityImage } from '../../models/facility-image.model';
import { Availability } from '../../models/availability.model';
import { Category } from '../../models/category.model';
import { HttpException } from '../../utils/http-exception';
import { SystemLog } from '../../models/system-log.model';

/**
 * Search for facilities based on various criteria
 * @route POST /api/manager/search
 */
export const searchFacilities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      categoryIds,
      genderSuitability,
      minAge,
      maxAge,
      city,
      postalCode,
      radius,
      latitude,
      longitude,
      page = 1,
      limit = 10,
      sortBy = 'lastUpdated',
      sortOrder = 'desc',
    } = req.body;

    // Build availability conditions
    const availabilityWhere: any = {
      availablePlaces: { [Op.gt]: 0 },
    };

    if (categoryIds && categoryIds.length > 0) {
      availabilityWhere.categoryId = { [Op.in]: categoryIds };
    }

    if (genderSuitability) {
      availabilityWhere[Op.or] = [
        { genderSuitability },
        { genderSuitability: 'all' },
      ];
    }

    if (minAge !== undefined) {
      availabilityWhere.maxAge = { [Op.gte]: minAge };
    }

    if (maxAge !== undefined) {
      availabilityWhere.minAge = { [Op.lte]: maxAge };
    }

    // Build facility conditions
    const facilityWhere: any = {
      isActive: true,
    };

    if (city) {
      facilityWhere.city = { [Op.iLike]: `%${city}%` };
    }

    if (postalCode) {
      facilityWhere.postalCode = { [Op.iLike]: `%${postalCode}%` };
    }

    // Calculate pagination
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Prepare order options
    let order: any = [];

    if (sortBy === 'distance' && latitude !== undefined && longitude !== undefined) {
      // Order by distance (using Haversine formula)
      order = [
        [
          Sequelize.literal(`
            (
              6371 * acos(
                cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) +
                sin(radians(${latitude})) * sin(radians(latitude))
              )
            )
          `),
          sortOrder,
        ],
      ];
    } else if (sortBy === 'availablePlaces') {
      // Order by available places
      order = [[Sequelize.literal('"availabilities.availablePlaces"'), sortOrder]];
    } else {
      // Default order by lastUpdated
      order = [[Sequelize.literal('"availabilities.lastUpdated"'), sortOrder]];
    }

    // Get facilities with pagination
    const { count, rows: facilities } = await Facility.findAndCountAll({
      where: facilityWhere,
      include: [
        {
          model: Carrier,
          as: 'carrier',
          attributes: ['id', 'name'],
          where: { isActive: true },
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
          where: availabilityWhere,
          include: [
            {
              model: Category,
              as: 'category',
              attributes: ['id', 'name'],
              where: { isActive: true },
            },
          ],
          required: true,
        },
      ],
      order,
      limit: limitNumber,
      offset,
      distinct: true,
      subQuery: false,
    });

    // Calculate total pages
    const totalPages = Math.ceil(count / limitNumber);

    // Add distance calculation if coordinates are provided
    let facilitiesWithDistance: any[] = facilities;
    if (latitude !== undefined && longitude !== undefined) {
      facilitiesWithDistance = facilities.map(facility => {
        const facilityData = facility.toJSON();

        if (facility.latitude && facility.longitude) {
          // Calculate distance using Haversine formula (in kilometers)
          const R = 6371; // Earth's radius in km
          const dLat = (facility.latitude - latitude) * Math.PI / 180;
          const dLon = (facility.longitude - longitude) * Math.PI / 180;
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(latitude * Math.PI / 180) * Math.cos(facility.latitude * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = R * c;

          return {
            ...facilityData,
            distance: Math.round(distance * 10) / 10, // Round to 1 decimal place
          };
        }

        return {
          ...facilityData,
          distance: null,
        };
      });
    }

    // Log search
    await SystemLog.create({
      userId: req.user?.id,
      action: 'search',
      entity: 'facility',
      details: {
        categoryIds,
        genderSuitability,
        minAge,
        maxAge,
        city,
        postalCode,
        radius,
        latitude,
        longitude,
        resultsCount: count,
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      data: facilitiesWithDistance,
      meta: {
        total: count,
        page: pageNumber,
        limit: limitNumber,
        totalPages,
        filters: {
          categoryIds,
          genderSuitability,
          minAge,
          maxAge,
          city,
          postalCode,
          radius,
          latitude,
          longitude,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search for facilities by category
 * @route POST /api/manager/search/category/:categoryId
 */
export const searchByCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryId } = req.params;

    // Check if category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      throw new HttpException(404, 'Kategorie nicht gefunden');
    }

    // Add category ID to request body and call the main search function
    req.body.categoryIds = [categoryId];

    await searchFacilities(req, res, next);
  } catch (error) {
    next(error);
  }
};
