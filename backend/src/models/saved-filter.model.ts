import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/db.config';

// SavedFilter attributes interface
export interface SavedFilterAttributes {
  id: string;
  userId: string;
  name: string;
  filters: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// SavedFilter creation attributes interface (optional fields for creation)
export interface SavedFilterCreationAttributes extends Optional<SavedFilterAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// SavedFilter model class
export class SavedFilter extends Model<SavedFilterAttributes, SavedFilterCreationAttributes> implements SavedFilterAttributes {
  public id!: string;
  public userId!: string;
  public name!: string;
  public filters!: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize SavedFilter model
SavedFilter.init(
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filters: {
      type: DataTypes.JSONB,
      allowNull: false,
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
    modelName: 'SavedFilter',
    tableName: 'saved_filters',
    indexes: [
      {
        fields: ['userId'],
      },
    ],
  }
);

export default SavedFilter;
