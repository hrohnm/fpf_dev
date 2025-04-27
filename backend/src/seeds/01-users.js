'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const now = new Date();
    
    return queryInterface.bulkInsert('users', [
      {
        id: uuidv4(),
        email: 'admin@example.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        email: 'carrier@example.com',
        password: hashedPassword,
        firstName: 'Carrier',
        lastName: 'User',
        role: 'carrier',
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        email: 'manager@example.com',
        password: hashedPassword,
        firstName: 'Manager',
        lastName: 'User',
        role: 'manager',
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        email: 'leadership@example.com',
        password: hashedPassword,
        firstName: 'Leadership',
        lastName: 'User',
        role: 'leadership',
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, {});
  }
};
