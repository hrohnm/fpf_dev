'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Get carriers
    const carriers = await queryInterface.sequelize.query(
      `SELECT id FROM carriers`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    if (carriers.length === 0) {
      return;
    }
    
    const now = new Date();
    
    // Create facilities for each carrier
    const facilities = [];
    
    // Facilities for first carrier
    facilities.push({
      id: uuidv4(),
      carrierId: carriers[0].id,
      name: 'Kinderhaus Sonnenschein',
      description: 'Stationäre Einrichtung für Kinder und Jugendliche mit 24 Plätzen',
      contactPerson: 'Lisa Müller',
      email: 'kinderhaus@jugendhilfe-rostock.de',
      phone: '0381 12345679',
      address: 'Sonnenallee 45',
      city: 'Rostock',
      postalCode: '18055',
      latitude: 54.0924,
      longitude: 12.0991,
      openingHours: 'Durchgehend geöffnet (24/7)',
      maxCapacity: 24,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    
    facilities.push({
      id: uuidv4(),
      carrierId: carriers[0].id,
      name: 'Jugendwohngruppe Hafenblick',
      description: 'Betreutes Wohnen für Jugendliche ab 16 Jahren',
      contactPerson: 'Mark Weber',
      email: 'jugendwohngruppe@jugendhilfe-rostock.de',
      phone: '0381 12345680',
      address: 'Hafenstraße 12',
      city: 'Rostock',
      postalCode: '18057',
      latitude: 54.0887,
      longitude: 12.1398,
      openingHours: 'Durchgehend geöffnet (24/7)',
      maxCapacity: 12,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    
    // Facilities for second carrier
    facilities.push({
      id: uuidv4(),
      carrierId: carriers[1].id,
      name: 'Kinderwohngruppe Seeblick',
      description: 'Wohngruppe für Kinder von 6-12 Jahren',
      contactPerson: 'Sandra Klein',
      email: 'seeblick@kinderland-mv.de',
      phone: '0381 87654322',
      address: 'Seestraße 78',
      city: 'Rostock',
      postalCode: '18119',
      latitude: 54.1824,
      longitude: 12.0799,
      openingHours: 'Durchgehend geöffnet (24/7)',
      maxCapacity: 10,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    
    facilities.push({
      id: uuidv4(),
      carrierId: carriers[1].id,
      name: 'Tagesgruppe Stadtmitte',
      description: 'Teilstationäre Betreuung für Schulkinder',
      contactPerson: 'Klaus Berger',
      email: 'tagesgruppe@kinderland-mv.de',
      phone: '0381 87654323',
      address: 'Kröpeliner Straße 33',
      city: 'Rostock',
      postalCode: '18055',
      latitude: 54.0904,
      longitude: 12.1335,
      openingHours: 'Mo-Fr 11:00-18:00 Uhr',
      maxCapacity: 15,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    
    // Facilities for third carrier
    facilities.push({
      id: uuidv4(),
      carrierId: carriers[2].id,
      name: 'Familienhilfe Zentrum',
      description: 'Ambulante Hilfen für Familien',
      contactPerson: 'Julia Neumann',
      email: 'familienhilfe@sozialwerk-schwerin.de',
      phone: '0385 5551235',
      address: 'Marienplatz 5',
      city: 'Schwerin',
      postalCode: '19053',
      latitude: 53.6288,
      longitude: 11.4148,
      openingHours: 'Mo-Fr 9:00-17:00 Uhr',
      maxCapacity: 30,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    
    // Facilities for fourth carrier
    facilities.push({
      id: uuidv4(),
      carrierId: carriers[3].id,
      name: 'Jugendhilfehaus Altstadt',
      description: 'Stationäre und teilstationäre Angebote unter einem Dach',
      contactPerson: 'Michael Schmidt',
      email: 'altstadt@jhv-stralsund.de',
      phone: '03831 123457',
      address: 'Altstadt 15',
      city: 'Stralsund',
      postalCode: '18439',
      latitude: 54.3149,
      longitude: 13.0925,
      openingHours: 'Durchgehend geöffnet (24/7)',
      maxCapacity: 20,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    
    facilities.push({
      id: uuidv4(),
      carrierId: carriers[3].id,
      name: 'Clearinghaus Stralsund',
      description: 'Inobhutnahme und Clearing für Kinder und Jugendliche',
      contactPerson: 'Petra Lange',
      email: 'clearing@jhv-stralsund.de',
      phone: '03831 123458',
      address: 'Tribseer Damm 76',
      city: 'Stralsund',
      postalCode: '18437',
      latitude: 54.3079,
      longitude: 13.0712,
      openingHours: 'Durchgehend geöffnet (24/7)',
      maxCapacity: 8,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    
    // Facilities for fifth carrier
    facilities.push({
      id: uuidv4(),
      carrierId: carriers[4].id,
      name: 'Therapeutische Wohngruppe Greifswald',
      description: 'Spezialisierte Wohngruppe für Kinder und Jugendliche mit seelischen Behinderungen',
      contactPerson: 'Dr. Martin Fischer',
      email: 'twg@kjh-greifswald.de',
      phone: '03834 987655',
      address: 'Goethestraße 45',
      city: 'Greifswald',
      postalCode: '17489',
      latitude: 54.0865,
      longitude: 13.3923,
      openingHours: 'Durchgehend geöffnet (24/7)',
      maxCapacity: 8,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    
    return queryInterface.bulkInsert('facilities', facilities);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('facilities', null, {});
  }
};
