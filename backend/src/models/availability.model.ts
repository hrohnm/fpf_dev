import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/db.config';

// Availability attributes interface
export interface AvailabilityAttributes {
  id: string;
  facilityId: string;
  categoryId: string;
  availablePlaces: number;
  totalPlaces: number;
  genderSuitability: 'male' | 'female' | 'all';
  minAge: number;
  maxAge: number;
  notes?: string;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Availability creation attributes interface (optional fields for creation)
export interface AvailabilityCreationAttributes extends Optional<AvailabilityAttributes, 'id' | 'notes' | 'lastUpdated' | 'createdAt' | 'updatedAt'> {}

// Availability model class
export class Availability extends Model<AvailabilityAttributes, AvailabilityCreationAttributes> implements AvailabilityAttributes {
  public id!: string;
  public facilityId!: string;
  public categoryId!: string;
  public availablePlaces!: number;
  public totalPlaces!: number;
  public genderSuitability!: 'male' | 'female' | 'all';
  public minAge!: number;
  public maxAge!: number;
  public notes?: string;
  public lastUpdated!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public facility?: any;
  public category?: any;
}

// Initialize Availability model
Availability.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    facilityId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'facilities',
        key: 'id',
      },
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id',
      },
    },
    availablePlaces: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    totalPlaces: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    genderSuitability: {
      type: DataTypes.ENUM('male', 'female', 'all'),
      allowNull: false,
      defaultValue: 'all',
    },
    minAge: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 25,
      },
    },
    maxAge: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 27,
      },
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    lastUpdated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Availability',
    tableName: 'availabilities',
    indexes: [
      {
        fields: ['facilityId'],
      },
      {
        fields: ['categoryId'],
      },
      {
        fields: ['genderSuitability'],
      },
      {
        fields: ['minAge', 'maxAge'],
      },
      {
        fields: ['lastUpdated'],
      },
    ],
    hooks: {
      beforeCreate: (availability: Availability) => {
        availability.lastUpdated = new Date();
      },
      beforeUpdate: (availability: Availability) => {
        if (availability.changed('availablePlaces') ||
            availability.changed('genderSuitability') ||
            availability.changed('minAge') ||
            availability.changed('maxAge')) {
          availability.lastUpdated = new Date();
        }
      },
    },
  }
);

export default Availability;
