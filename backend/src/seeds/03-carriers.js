'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    const carriers = [
      {
        id: uuidv4(),
        name: 'Jugendhilfe Rostock e.V.',
        description: 'Gemeinnütziger Träger der freien Jugendhilfe in Rostock',
        contactPerson: 'Maria Schmidt',
        email: 'info@jugendhilfe-rostock.de',
        phone: '0381 12345678',
        address: 'Rostocker Straße 123',
        city: 'Rostock',
        postalCode: '18055',
        isPremium: true,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'Kinderland Mecklenburg gGmbH',
        description: 'Träger mit Fokus auf stationäre Jugendhilfe',
        contactPerson: 'Thomas Müller',
        email: 'kontakt@kinderland-mv.de',
        phone: '0381 87654321',
        address: 'Schillerplatz 45',
        city: 'Rostock',
        postalCode: '18057',
        isPremium: false,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'Sozialwerk Schwerin e.V.',
        description: 'Anbieter von ambulanten und teilstationären Hilfen',
        contactPerson: 'Sabine Wagner',
        email: 'info@sozialwerk-schwerin.de',
        phone: '0385 5551234',
        address: 'Schweriner Straße 67',
        city: 'Schwerin',
        postalCode: '19053',
        isPremium: false,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'Jugendhilfeverbund Stralsund',
        description: 'Verbund verschiedener Jugendhilfeeinrichtungen in Stralsund',
        contactPerson: 'Peter Krause',
        email: 'kontakt@jhv-stralsund.de',
        phone: '03831 123456',
        address: 'Hafenstraße 22',
        city: 'Stralsund',
        postalCode: '18439',
        isPremium: true,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'Kinder- und Jugendhilfe Greifswald',
        description: 'Spezialisiert auf Eingliederungshilfe nach § 35a SGB VIII',
        contactPerson: 'Anna Lehmann',
        email: 'info@kjh-greifswald.de',
        phone: '03834 987654',
        address: 'Universitätsstraße 15',
        city: 'Greifswald',
        postalCode: '17489',
        isPremium: false,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    ];
    
    return queryInterface.bulkInsert('carriers', carriers);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('carriers', null, {});
  }
};
