'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    // Create main categories first
    const mainCategories = [
      {
        id: uuidv4(),
        name: 'Hilfe zur Erziehung (§§ 27-35 SGB VIII)',
        description: 'Leistungen der Kinder- und Jugendhilfe nach §§ 27-35 SGB VIII',
        parentId: null,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'Eingliederungshilfe (§ 35a SGB VIII)',
        description: 'Eingliederungshilfe für seelisch behinderte Kinder und Jugendliche',
        parentId: null,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'Hilfe für junge Volljährige (§ 41 SGB VIII)',
        description: 'Hilfe für junge Volljährige, Nachbetreuung',
        parentId: null,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'Inobhutnahme (§ 42 SGB VIII)',
        description: 'Vorläufige Maßnahmen zum Schutz von Kindern und Jugendlichen',
        parentId: null,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    ];
    
    await queryInterface.bulkInsert('categories', mainCategories);
    
    // Get the IDs of the main categories
    const hzeId = mainCategories[0].id;
    const eingliederungshilfeId = mainCategories[1].id;
    const jungeVolljahrigeId = mainCategories[2].id;
    const inobhutnahmeId = mainCategories[3].id;
    
    // Create subcategories
    const subcategories = [
      // HzE subcategories
      {
        id: uuidv4(),
        name: 'Erziehungsberatung (§ 28 SGB VIII)',
        description: 'Erziehungsberatung und andere Beratungsdienste und -einrichtungen',
        parentId: hzeId,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'Soziale Gruppenarbeit (§ 29 SGB VIII)',
        description: 'Soziale Gruppenarbeit für ältere Kinder und Jugendliche',
        parentId: hzeId,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'Erziehungsbeistand (§ 30 SGB VIII)',
        description: 'Erziehungsbeistand, Betreuungshelfer',
        parentId: hzeId,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'Sozialpädagogische Familienhilfe (§ 31 SGB VIII)',
        description: 'Sozialpädagogische Familienhilfe',
        parentId: hzeId,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'Erziehung in Tagesgruppe (§ 32 SGB VIII)',
        description: 'Erziehung in einer Tagesgruppe',
        parentId: hzeId,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'Vollzeitpflege (§ 33 SGB VIII)',
        description: 'Vollzeitpflege in einer anderen Familie',
        parentId: hzeId,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'Heimerziehung (§ 34 SGB VIII)',
        description: 'Heimerziehung, sonstige betreute Wohnform',
        parentId: hzeId,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'Intensive sozialpädagogische Einzelbetreuung (§ 35 SGB VIII)',
        description: 'Intensive sozialpädagogische Einzelbetreuung',
        parentId: hzeId,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      
      // Eingliederungshilfe subcategories
      {
        id: uuidv4(),
        name: 'Ambulante Eingliederungshilfe',
        description: 'Ambulante Hilfen für seelisch behinderte Kinder und Jugendliche',
        parentId: eingliederungshilfeId,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'Teilstationäre Eingliederungshilfe',
        description: 'Teilstationäre Hilfen für seelisch behinderte Kinder und Jugendliche',
        parentId: eingliederungshilfeId,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'Stationäre Eingliederungshilfe',
        description: 'Stationäre Hilfen für seelisch behinderte Kinder und Jugendliche',
        parentId: eingliederungshilfeId,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      
      // Junge Volljährige subcategories
      {
        id: uuidv4(),
        name: 'Ambulante Hilfe für junge Volljährige',
        description: 'Ambulante Hilfen für junge Volljährige',
        parentId: jungeVolljahrigeId,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'Betreutes Wohnen für junge Volljährige',
        description: 'Betreutes Wohnen für junge Volljährige',
        parentId: jungeVolljahrigeId,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'Nachbetreuung',
        description: 'Nachbetreuung nach stationären Hilfen',
        parentId: jungeVolljahrigeId,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      
      // Inobhutnahme subcategories
      {
        id: uuidv4(),
        name: 'Kurzfristige Inobhutnahme',
        description: 'Kurzfristige Inobhutnahme in Krisensituationen',
        parentId: inobhutnahmeId,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'Bereitschaftspflege',
        description: 'Bereitschaftspflege in Familien',
        parentId: inobhutnahmeId,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'Clearingstelle',
        description: 'Clearingstellen zur Abklärung des Hilfebedarfs',
        parentId: inobhutnahmeId,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    ];
    
    return queryInterface.bulkInsert('categories', subcategories);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('categories', null, {});
  }
};
