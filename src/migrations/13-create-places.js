'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('places', {
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
        onDelete: 'RESTRICT',
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isOccupied: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Add indexes
    await queryInterface.addIndex('places', ['facilityId']);
    await queryInterface.addIndex('places', ['categoryId']);
    await queryInterface.addIndex('places', ['isOccupied']);
    await queryInterface.addIndex('places', ['genderSuitability']);
    await queryInterface.addIndex('places', ['minAge', 'maxAge']);
    await queryInterface.addIndex('places', ['lastUpdated']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('places');
  }
};
