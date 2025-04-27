import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/db.config';

// Favorite attributes interface
export interface FavoriteAttributes {
  id: string;
  userId: string;
  facilityId: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Favorite creation attributes interface (optional fields for creation)
export interface FavoriteCreationAttributes extends Optional<FavoriteAttributes, 'id' | 'notes' | 'createdAt' | 'updatedAt'> {}

// Favorite model class
export class Favorite extends Model<FavoriteAttributes, FavoriteCreationAttributes> implements FavoriteAttributes {
  public id!: string;
  public userId!: string;
  public facilityId!: string;
  public notes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public facility?: any;
  public user?: any;
}

// Initialize Favorite model
Favorite.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    facilityId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'facilities',
        key: 'id',
      },
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    modelName: 'Favorite',
    tableName: 'favorites',
    indexes: [
      {
        fields: ['userId'],
      },
      {
        fields: ['facilityId'],
      },
      {
        unique: true,
        fields: ['userId', 'facilityId'],
      },
    ],
  }
);

export default Favorite;
