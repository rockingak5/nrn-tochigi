'use strict';

const RENAMES = [
  { slug: '/medical-institutions', from: 'Medical Institutions', to: 'Medical Information' },
  { slug: '/about-nrna', from: 'About NRNA', to: 'About NRNA Tochigi' },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    for (const { slug, to } of RENAMES) {
      await queryInterface.bulkUpdate('pages', { title: to }, { slug });
    }
  },
  down: async (queryInterface) => {
    for (const { slug, from } of RENAMES) {
      await queryInterface.bulkUpdate('pages', { title: from }, { slug });
    }
  },
};
