'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
      console.warn('Skipping admin seed: ADMIN_USERNAME / ADMIN_PASSWORD not set in .env');
      return;
    }

    const [existing] = await queryInterface.sequelize.query(
      'SELECT id FROM admins WHERE username = ? LIMIT 1',
      { replacements: [username] },
    );
    if (existing.length > 0) {
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await queryInterface.bulkInsert('admins', [
      {
        username,
        passwordHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: async (queryInterface) => {
    const username = process.env.ADMIN_USERNAME;
    if (!username) return;
    await queryInterface.bulkDelete('admins', { username });
  },
};
