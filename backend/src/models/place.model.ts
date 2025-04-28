import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/db.config';

// Place attributes interface
export interface PlaceAttributes {
  id: string;
  facilityId: string;
  categoryId: string;
  name: string;  // z.B. "Platz 1", "Zimmer 101", etc.
  isOccupied: boolean;
  genderSuitability: 'male' | 'female' | 'all';
  minAge: number;
  maxAge: number;
  notes?: string;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Place creation attributes interface (optional fields for creation)
export interface PlaceCreationAttributes extends Optional<PlaceAttributes, 'id' | 'notes' | 'lastUpdated' | 'createdAt' | 'updatedAt'> {}

// Place model class
export class Place extends Model<PlaceAttributes, PlaceCreationAttributes> implements PlaceAttributes {
  public id!: string;
  public facilityId!: string;
  public categoryId!: string;
  public name!: string;
  public isOccupied!: boolean;
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

// Initialize Place model
Place.init(
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
    isOccupied: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    modelName: 'Place',
    tableName: 'places',
    indexes: [
      {
        fields: ['facilityId'],
      },
      {
        fields: ['categoryId'],
      },
      {
        fields: ['isOccupied'],
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
      beforeCreate: (place: Place) => {
        place.lastUpdated = new Date();
      },
      beforeUpdate: (place: Place) => {
        if (place.changed('isOccupied') ||
            place.changed('genderSuitability') ||
            place.changed('minAge') ||
            place.changed('maxAge')) {
          place.lastUpdated = new Date();
        }
      },
    },
  }
);

export default Place;
