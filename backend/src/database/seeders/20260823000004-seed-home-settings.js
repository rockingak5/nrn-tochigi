'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    const [existing] = await queryInterface.sequelize.query('SELECT id FROM home_settings LIMIT 1');
    if (existing.length > 0) return;

    const now = new Date();
    await queryInterface.bulkInsert('home_settings', [
      {
        heroImageUrl: null,
        activitiesImageUrl: null,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('home_settings', {});
  },
};
