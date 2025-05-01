'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create hours table
    await queryInterface.createTable('hours', {
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
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      totalHours: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      availableHours: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      genderSuitability: {
        type: DataTypes.ENUM('male', 'female', 'all'),
        allowNull: false,
        defaultValue: 'all',
      },
      minAge: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      maxAge: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 27,
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
    });

    // Create indexes
    await queryInterface.addIndex('hours', ['facilityId'], {
      name: 'hours_facility_id',
    });
    await queryInterface.addIndex('hours', ['categoryId'], {
      name: 'hours_category_id',
    });
    await queryInterface.addIndex('hours', ['availableHours'], {
      name: 'hours_available_hours',
    });
    await queryInterface.addIndex('hours', ['genderSuitability'], {
      name: 'hours_gender_suitability',
    });
    await queryInterface.addIndex('hours', ['minAge', 'maxAge'], {
      name: 'hours_age_range',
    });
    await queryInterface.addIndex('hours', ['lastUpdated'], {
      name: 'hours_last_updated',
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove indexes
    await queryInterface.removeIndex('hours', 'hours_facility_id');
    await queryInterface.removeIndex('hours', 'hours_category_id');
    await queryInterface.removeIndex('hours', 'hours_available_hours');
    await queryInterface.removeIndex('hours', 'hours_gender_suitability');
    await queryInterface.removeIndex('hours', 'hours_age_range');
    await queryInterface.removeIndex('hours', 'hours_last_updated');

    // Drop hours table
    await queryInterface.dropTable('hours');
  }
};
