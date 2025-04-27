import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/db.config';

// Category attributes interface
export interface CategoryAttributes {
  id: string;
  name: string;
  description?: string;
  unitType: 'places' | 'hours'; // 'places' für Plätze, 'hours' für Stunden
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Category creation attributes interface (optional fields for creation)
export interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id' | 'description' | 'isActive' | 'createdAt' | 'updatedAt'> {}

// Category model class
export class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
  public id!: string;
  public name!: string;
  public description?: string;
  public unitType!: 'places' | 'hours';
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
    unitType: {
      type: DataTypes.ENUM('places', 'hours'),
      allowNull: false,
      defaultValue: 'places',
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
        fields: ['unitType'],
      },
    ],
  }
);

export default Category;
