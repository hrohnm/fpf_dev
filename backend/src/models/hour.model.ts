import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/db.config';

// Hour attributes interface
export interface HourAttributes {
  id: string;
  facilityId: string;
  categoryId: string;
  name: string;  // z.B. "Beratungsstunden", "Therapiestunden", etc.
  totalHours: number;
  availableHours: number;
  genderSuitability: 'male' | 'female' | 'all';
  minAge: number;
  maxAge: number;
  notes?: string;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Hour creation attributes interface (optional fields for creation)
export interface HourCreationAttributes extends Optional<HourAttributes, 'id' | 'notes' | 'lastUpdated' | 'createdAt' | 'updatedAt'> {}

// Hour model class
export class Hour extends Model<HourAttributes, HourCreationAttributes> implements HourAttributes {
  public id!: string;
  public facilityId!: string;
  public categoryId!: string;
  public name!: string;
  public totalHours!: number;
  public availableHours!: number;
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

// Initialize Hour model
Hour.init(
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalHours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    availableHours: {
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
    modelName: 'Hour',
    tableName: 'hours',
    indexes: [
      {
        fields: ['facilityId'],
      },
      {
        fields: ['categoryId'],
      },
      {
        fields: ['availableHours'],
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
      beforeCreate: (hour: Hour) => {
        hour.lastUpdated = new Date();
      },
      beforeUpdate: (hour: Hour) => {
        if (hour.changed('availableHours') ||
            hour.changed('genderSuitability') ||
            hour.changed('minAge') ||
            hour.changed('maxAge')) {
          hour.lastUpdated = new Date();
        }
      },
    },
  }
);

export default Hour;
