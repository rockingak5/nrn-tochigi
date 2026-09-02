'use strict';

const ACTIVITIES = [
  'Tihar Festival celebrated in Japan.',
  'Children exchanging marigold garlands.',
  'Nepali culture and traditions preserved.',
  'Community gathering and joyous moments.',
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    const [existing] = await queryInterface.sequelize.query('SELECT id FROM activities LIMIT 1');
    if (existing.length > 0) return;

    const now = new Date();
    await queryInterface.bulkInsert(
      'activities',
      ACTIVITIES.map((text, index) => ({
        text,
        order: index,
        createdAt: now,
        updatedAt: now,
      })),
    );
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('activities', {});
  },
};
