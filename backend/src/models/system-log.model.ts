import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/db.config';

// SystemLog attributes interface
export interface SystemLogAttributes {
  id: string;
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// SystemLog creation attributes interface (optional fields for creation)
export interface SystemLogCreationAttributes extends Optional<SystemLogAttributes, 'id' | 'userId' | 'entityId' | 'details' | 'ipAddress' | 'userAgent' | 'createdAt'> {}

// SystemLog model class
export class SystemLog extends Model<SystemLogAttributes, SystemLogCreationAttributes> implements SystemLogAttributes {
  public id!: string;
  public userId?: string;
  public action!: string;
  public entity!: string;
  public entityId?: string;
  public details?: Record<string, any>;
  public ipAddress?: string;
  public userAgent?: string;
  public readonly createdAt!: Date;
}

// Initialize SystemLog model
SystemLog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    entity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    entityId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    details: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'SystemLog',
    tableName: 'system_logs',
    timestamps: false, // Only createdAt, no updatedAt
    indexes: [
      {
        fields: ['userId'],
      },
      {
        fields: ['action'],
      },
      {
        fields: ['entity'],
      },
      {
        fields: ['entityId'],
      },
      {
        fields: ['createdAt'],
      },
    ],
  }
);

export default SystemLog;
