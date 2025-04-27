'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add unitType column to categories table
    await queryInterface.addColumn('categories', 'unitType', {
      type: Sequelize.ENUM('places', 'hours'),
      allowNull: false,
      defaultValue: 'places',
    });

    // Create index for unitType column
    await queryInterface.addIndex('categories', ['unitType'], {
      name: 'categories_unit_type',
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove index for unitType column
    await queryInterface.removeIndex('categories', 'categories_unit_type');

    // Remove unitType column from categories table
    await queryInterface.removeColumn('categories', 'unitType');
  }
};
