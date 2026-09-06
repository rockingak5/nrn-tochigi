export type NavLink = { label: string; to: string }

// Pages backed by the generic Page model (admin-editable via the admin
// panel's Pages section) — each entry needs a matching seeded Page row keyed
// by `to` as the slug. Kept as the full set (including ones with no content
// registered yet) so those routes stay reachable and editable; `menuLinks`
// below decides what's actually shown in the header/mobile nav.
export const othersLinks: NavLink[] = [
  { label: 'Helpline', to: '/helpline' },
  { label: 'Medical Institutions', to: '/medical-institutions' },
  { label: 'School Search', to: '/school-search' },
  { label: 'Japanese Classes', to: '/japanese-classes' },
  { label: 'Discover Tochigi', to: '/discover-tochigi' },
  { label: 'Jobs', to: '/jobs' },
  { label: 'Sports', to: '/sports' },
  { label: 'Finance', to: '/finance' },
  { label: 'Activities', to: '/activities' },
  { label: 'Project Info', to: '/project-info' },
  { label: 'NRNA/Nepal', to: '/nrna-nepal' },
]

export const aboutLinks: NavLink[] = [
  { label: 'About NRNA', to: '/about-nrna' },
  { label: 'Notice Board', to: '/notice-board' },
  { label: 'Downloads', to: '/downloads' },
]

// The curated set of top-level links always shown in the site header and
// mobile nav. Everything else backed by the Page model (Jobs, Finance,
// About NRNA Tochigi, etc.) surfaces automatically in the "Others" dropdown
// once it has content — see Navigation.tsx.
export const menuLinks: NavLink[] = [
  { label: 'Home', to: '/' },
  { label: 'Our Team', to: '/our-team' },
  { label: 'News and Events', to: '/news-events' },
]
