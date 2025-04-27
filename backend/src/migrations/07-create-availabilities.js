'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('availabilities', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      facilityId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'facilities',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      categoryId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      availablePlaces: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      totalPlaces: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      genderSuitability: {
        type: Sequelize.ENUM('male', 'female', 'all'),
        allowNull: false,
        defaultValue: 'all',
      },
      minAge: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      maxAge: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 27,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      lastUpdated: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Add indexes
    await queryInterface.addIndex('availabilities', ['facilityId']);
    await queryInterface.addIndex('availabilities', ['categoryId']);
    await queryInterface.addIndex('availabilities', ['genderSuitability']);
    await queryInterface.addIndex('availabilities', ['minAge', 'maxAge']);
    await queryInterface.addIndex('availabilities', ['lastUpdated']);
    await queryInterface.addIndex('availabilities', ['availablePlaces']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('availabilities');
  }
};
