import sequelize from '../config/db.config';
import { User } from './user.model';
import { Carrier } from './carrier.model';
import { CarrierUser } from './carrier-user.model';
import { Facility } from './facility.model';
import { FacilityImage } from './facility-image.model';
import { Category } from './category.model';
import { Availability } from './availability.model';
import { Place } from './place.model';
import { SavedFilter } from './saved-filter.model';
import { Favorite } from './favorite.model';
import { SystemLog } from './system-log.model';

// Define model associations

// User - Carrier (many-to-many)
User.belongsToMany(Carrier, {
  through: CarrierUser,
  foreignKey: 'userId',
  otherKey: 'carrierId',
});

Carrier.belongsToMany(User, {
  through: CarrierUser,
  foreignKey: 'carrierId',
  otherKey: 'userId',
});

// Carrier - Facility (one-to-many)
Carrier.hasMany(Facility, {
  foreignKey: 'carrierId',
  as: 'facilities',
});

Facility.belongsTo(Carrier, {
  foreignKey: 'carrierId',
  as: 'carrier',
});

// Facility - FacilityImage (one-to-many)
Facility.hasMany(FacilityImage, {
  foreignKey: 'facilityId',
  as: 'images',
});

FacilityImage.belongsTo(Facility, {
  foreignKey: 'facilityId',
  as: 'facility',
});

// Category - Category (self-referencing for hierarchy)
Category.belongsTo(Category, {
  foreignKey: 'parentId',
  as: 'parent',
});

Category.hasMany(Category, {
  foreignKey: 'parentId',
  as: 'children',
});

// Facility - Availability (one-to-many)
Facility.hasMany(Availability, {
  foreignKey: 'facilityId',
  as: 'availabilities',
});

Availability.belongsTo(Facility, {
  foreignKey: 'facilityId',
  as: 'facility',
});

// Category - Availability (one-to-many)
Category.hasMany(Availability, {
  foreignKey: 'categoryId',
  as: 'availabilities',
});

Availability.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category',
});

// Facility - Place (one-to-many)
Facility.hasMany(Place, {
  foreignKey: 'facilityId',
  as: 'places',
});

Place.belongsTo(Facility, {
  foreignKey: 'facilityId',
  as: 'facility',
});

// Category - Place (one-to-many)
Category.hasMany(Place, {
  foreignKey: 'categoryId',
  as: 'places',
});

Place.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category',
});

// User - SavedFilter (one-to-many)
User.hasMany(SavedFilter, {
  foreignKey: 'userId',
  as: 'savedFilters',
});

SavedFilter.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// User - Favorite (one-to-many)
User.hasMany(Favorite, {
  foreignKey: 'userId',
  as: 'favorites',
});

Favorite.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// Facility - Favorite (one-to-many)
Facility.hasMany(Favorite, {
  foreignKey: 'facilityId',
  as: 'favorites',
});

Favorite.belongsTo(Facility, {
  foreignKey: 'facilityId',
  as: 'facility',
});

// Function to test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
};

export {
  sequelize,
  User,
  Carrier,
  CarrierUser,
  Facility,
  FacilityImage,
  Category,
  Availability,
  Place,
  SavedFilter,
  Favorite,
  SystemLog,
};
