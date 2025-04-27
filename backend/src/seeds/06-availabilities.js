'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Get facilities
    const facilities = await queryInterface.sequelize.query(
      `SELECT id FROM facilities`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Get categories
    const categories = await queryInterface.sequelize.query(
      `SELECT id FROM categories WHERE "parentId" IS NOT NULL`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (facilities.length === 0 || categories.length === 0) {
      return;
    }

    const now = new Date();

    // Create availabilities
    const availabilities = [];

    // For each facility, create 2-3 availabilities with different categories
    facilities.forEach((facility, facilityIndex) => {
      // Select 2-3 random categories for this facility
      const numCategories = Math.floor(Math.random() * 2) + 2; // 2-3 categories
      const shuffledCategories = [...categories].sort(() => 0.5 - Math.random());
      const selectedCategories = shuffledCategories.slice(0, numCategories);

      selectedCategories.forEach((category, categoryIndex) => {
        // Generate random availability data
        const totalPlaces = Math.floor(Math.random() * 10) + 5; // 5-14 total places
        const availablePlaces = Math.floor(Math.random() * 5) + 1; // 1-5 places
        const genderOptions = ['male', 'female', 'all'];
        const genderSuitability = genderOptions[Math.floor(Math.random() * genderOptions.length)];

        // Age ranges based on category type (simplified logic)
        let minAge = 0;
        let maxAge = 27;

        if (categoryIndex === 0) {
          minAge = 6;
          maxAge = 12;
        } else if (categoryIndex === 1) {
          minAge = 12;
          maxAge = 18;
        } else {
          minAge = 16;
          maxAge = 21;
        }

        // Create availability
        availabilities.push({
          id: uuidv4(),
          facilityId: facility.id,
          categoryId: category.id,
          availablePlaces,
          totalPlaces,
          genderSuitability,
          minAge,
          maxAge,
          notes: `Freie Plätze ab ${new Date().toLocaleDateString('de-DE')}`,
          lastUpdated: new Date(now.getTime() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)), // Random date within last week
          createdAt: now,
          updatedAt: now,
        });
      });
    });

    return queryInterface.bulkInsert('availabilities', availabilities);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('availabilities', null, {});
  }
};
