import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/db.config';

// Facility attributes interface
export interface FacilityAttributes {
  id: string;
  carrierId: string;
  name: string;
  description?: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  openingHours?: string;
  maxCapacity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Facility creation attributes interface (optional fields for creation)
export interface FacilityCreationAttributes extends Optional<FacilityAttributes, 'id' | 'description' | 'latitude' | 'longitude' | 'openingHours' | 'isActive' | 'createdAt' | 'updatedAt'> {}

// Facility model class
export class Facility extends Model<FacilityAttributes, FacilityCreationAttributes> implements FacilityAttributes {
  public id!: string;
  public carrierId!: string;
  public name!: string;
  public description?: string;
  public contactPerson!: string;
  public email!: string;
  public phone!: string;
  public address!: string;
  public city!: string;
  public postalCode!: string;
  public latitude?: number;
  public longitude?: number;
  public openingHours?: string;
  public maxCapacity!: number;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize Facility model
Facility.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    carrierId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'carriers',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    contactPerson: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    openingHours: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    maxCapacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
    modelName: 'Facility',
    tableName: 'facilities',
    indexes: [
      {
        fields: ['carrierId'],
      },
      {
        fields: ['city'],
      },
      {
        fields: ['postalCode'],
      },
      {
        fields: ['latitude', 'longitude'],
      },
    ],
  }
);

export default Facility;
