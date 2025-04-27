import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.config';

// CarrierUser attributes interface
export interface CarrierUserAttributes {
  id: string;
  carrierId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// CarrierUser model class
export class CarrierUser extends Model<CarrierUserAttributes> implements CarrierUserAttributes {
  public id!: string;
  public carrierId!: string;
  public userId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize CarrierUser model
CarrierUser.init(
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
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
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
    modelName: 'CarrierUser',
    tableName: 'carrier_users',
    indexes: [
      {
        unique: true,
        fields: ['carrierId', 'userId'],
      },
    ],
  }
);

export default CarrierUser;
