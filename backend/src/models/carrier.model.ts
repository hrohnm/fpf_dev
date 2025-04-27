import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/db.config';

// Carrier attributes interface
export interface CarrierAttributes {
  id: string;
  name: string;
  description?: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  isPremium: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Carrier creation attributes interface (optional fields for creation)
export interface CarrierCreationAttributes extends Optional<CarrierAttributes, 'id' | 'description' | 'isPremium' | 'isActive' | 'createdAt' | 'updatedAt'> {}

// Carrier model class
export class Carrier extends Model<CarrierAttributes, CarrierCreationAttributes> implements CarrierAttributes {
  public id!: string;
  public name!: string;
  public description?: string;
  public contactPerson!: string;
  public email!: string;
  public phone!: string;
  public address!: string;
  public city!: string;
  public postalCode!: string;
  public isPremium!: boolean;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize Carrier model
Carrier.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    isPremium: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    modelName: 'Carrier',
    tableName: 'carriers',
  }
);

export default Carrier;
