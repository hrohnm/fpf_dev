'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add code column to categories table
    await queryInterface.addColumn('categories', 'code', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Create index for code column
    await queryInterface.addIndex('categories', ['code'], {
      name: 'categories_code',
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove index for code column
    await queryInterface.removeIndex('categories', 'categories_code');

    // Remove code column from categories table
    await queryInterface.removeColumn('categories', 'code');
  }
};
