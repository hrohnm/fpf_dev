import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/db.config';

// Category attributes interface
export interface CategoryAttributes {
  id: string;
  name: string;
  description?: string;
  code?: string;
  unitType: 'places' | 'hours'; // 'places' für Plätze, 'hours' für Stunden
  parentId?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Category creation attributes interface (optional fields for creation)
export interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id' | 'description' | 'code' | 'parentId' | 'isActive' | 'createdAt' | 'updatedAt'> {}

// Category model class
export class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
  public id!: string;
  public name!: string;
  public description?: string;
  public code?: string;
  public unitType!: 'places' | 'hours';
  public parentId?: string | null;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize Category model
Category.init(
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
    code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    unitType: {
      type: DataTypes.ENUM('places', 'hours'),
      allowNull: false,
      defaultValue: 'places',
    },
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
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
    modelName: 'Category',
    tableName: 'categories',
    indexes: [
      {
        fields: ['name'],
      },
      {
        fields: ['code'],
      },
      {
        fields: ['unitType'],
      },
      {
        fields: ['parentId'],
      },
      {
        fields: ['isActive'],
      },
    ],
  }
);

export default Category;
