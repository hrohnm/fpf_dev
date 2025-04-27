'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Get user with carrier role
    const carrierUser = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'carrier@example.com' LIMIT 1`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    // Get all carriers
    const carriers = await queryInterface.sequelize.query(
      `SELECT id FROM carriers LIMIT 2`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    if (carrierUser.length === 0 || carriers.length === 0) {
      return;
    }
    
    const now = new Date();
    
    const carrierUsers = carriers.map(carrier => ({
      id: uuidv4(),
      userId: carrierUser[0].id,
      carrierId: carrier.id,
      createdAt: now,
      updatedAt: now,
    }));
    
    return queryInterface.bulkInsert('carrier_users', carrierUsers);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('carrier_users', null, {});
  }
};
