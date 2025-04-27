import { Model, DataTypes, Optional, Op } from 'sequelize';
import sequelize from '../config/db.config';

// FacilityImage attributes interface
export interface FacilityImageAttributes {
  id: string;
  facilityId: string;
  url: string;
  caption?: string;
  isMain: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// FacilityImage creation attributes interface (optional fields for creation)
export interface FacilityImageCreationAttributes extends Optional<FacilityImageAttributes, 'id' | 'caption' | 'isMain' | 'createdAt' | 'updatedAt'> {}

// FacilityImage model class
export class FacilityImage extends Model<FacilityImageAttributes, FacilityImageCreationAttributes> implements FacilityImageAttributes {
  public id!: string;
  public facilityId!: string;
  public url!: string;
  public caption?: string;
  public isMain!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize FacilityImage model
FacilityImage.init(
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
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    caption: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isMain: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    modelName: 'FacilityImage',
    tableName: 'facility_images',
    indexes: [
      {
        fields: ['facilityId'],
      },
    ],
    hooks: {
      // Ensure only one main image per facility
      afterSave: async (image: FacilityImage) => {
        if (image.isMain) {
          await FacilityImage.update(
            { isMain: false },
            {
              where: {
                facilityId: image.facilityId,
                id: { ne: image.id },
                isMain: true,
              },
            }
          );
        }
      },
    },
  }
);

export default FacilityImage;
