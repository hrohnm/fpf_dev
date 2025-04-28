'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch all availabilities
    const availabilities = await queryInterface.sequelize.query(
      `SELECT * FROM availabilities`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Create places for each availability
    const places = [];
    
    for (const availability of availabilities) {
      // For each availability, create individual places based on totalPlaces
      for (let i = 1; i <= availability.totalPlaces; i++) {
        // Determine if the place is occupied based on availablePlaces
        const isOccupied = i > availability.availablePlaces;
        
        places.push({
          id: uuidv4(),
          facilityId: availability.facilityId,
          categoryId: availability.categoryId,
          name: `Platz ${i}`,
          isOccupied: isOccupied,
          genderSuitability: availability.genderSuitability,
          minAge: availability.minAge,
          maxAge: availability.maxAge,
          notes: isOccupied ? 'Automatisch aus Verfügbarkeit konvertiert (belegt)' : 'Automatisch aus Verfügbarkeit konvertiert (frei)',
          lastUpdated: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    // Insert all places
    if (places.length > 0) {
      await queryInterface.bulkInsert('places', places);
    }

    // Note: We're not deleting the availabilities table yet, as it might be needed for backward compatibility
  },

  async down(queryInterface, Sequelize) {
    // Delete all places that were created from availabilities
    await queryInterface.bulkDelete('places', {
      notes: {
        [Sequelize.Op.or]: [
          'Automatisch aus Verfügbarkeit konvertiert (belegt)',
          'Automatisch aus Verfügbarkeit konvertiert (frei)'
        ]
      }
    });
  }
};
