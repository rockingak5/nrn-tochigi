'use strict';

// Keep this list in sync with `othersLinks` / `aboutLinks` in the frontend's src/navLinks.ts —
// each entry is one of the nav pages editable from the admin panel's Pages section.
const PAGES = [
  { slug: '/helpline', title: 'Helpline' },
  { slug: '/medical-institutions', title: 'Medical Information' },
  { slug: '/school-search', title: 'School Search' },
  { slug: '/japanese-classes', title: 'Japanese Classes' },
  { slug: '/discover-tochigi', title: 'Discover Tochigi' },
  { slug: '/jobs', title: 'Jobs' },
  { slug: '/sports', title: 'Sports' },
  { slug: '/finance', title: 'Finance' },
  { slug: '/activities', title: 'Activities' },
  { slug: '/project-info', title: 'Project Info' },
  { slug: '/nrna-nepal', title: 'NRNA/Nepal' },
  { slug: '/about-nrna', title: 'About NRNA Tochigi' },
  { slug: '/notice-board', title: 'Notice Board' },
  { slug: '/downloads', title: 'Downloads' },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    const [existing] = await queryInterface.sequelize.query('SELECT slug FROM pages');
    const existingSlugs = new Set(existing.map((row) => row.slug));

    const now = new Date();
    const toInsert = PAGES.filter((page) => !existingSlugs.has(page.slug)).map((page) => ({
      slug: page.slug,
      title: page.title,
      imageUrl: null,
      body: '',
      createdAt: now,
      updatedAt: now,
    }));

    if (toInsert.length > 0) {
      await queryInterface.bulkInsert('pages', toInsert);
    }
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('pages', { slug: PAGES.map((page) => page.slug) });
  },
};
