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
    
    if (facilities.length === 0) {
      return;
    }
    
    const now = new Date();
    
    // Create placeholder images for each facility
    const facilityImages = [];
    
    facilities.forEach(facility => {
      // Main image
      facilityImages.push({
        id: uuidv4(),
        facilityId: facility.id,
        url: '/uploads/placeholder-main.jpg',
        caption: 'Hauptansicht der Einrichtung',
        isMain: true,
        createdAt: now,
        updatedAt: now,
      });
      
      // Additional images
      facilityImages.push({
        id: uuidv4(),
        facilityId: facility.id,
        url: '/uploads/placeholder-interior.jpg',
        caption: 'Innenansicht',
        isMain: false,
        createdAt: now,
        updatedAt: now,
      });
      
      facilityImages.push({
        id: uuidv4(),
        facilityId: facility.id,
        url: '/uploads/placeholder-exterior.jpg',
        caption: 'Außenbereich',
        isMain: false,
        createdAt: now,
        updatedAt: now,
      });
    });
    
    return queryInterface.bulkInsert('facility_images', facilityImages);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('facility_images', null, {});
  }
};
