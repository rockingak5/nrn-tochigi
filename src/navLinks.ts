export type NavLink = { label: string; to: string }

export const primaryLinks: NavLink[] = [
  { label: 'Home', to: '/' },
  { label: 'Events', to: '/events' },
  { label: 'News', to: '/news' },
  { label: 'Our Team', to: '/our-team' },
  { label: 'Services', to: '/services' },
  { label: 'Contact', to: '/contact' },
]

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

export const allLinks: NavLink[] = [...primaryLinks, ...othersLinks, ...aboutLinks]
