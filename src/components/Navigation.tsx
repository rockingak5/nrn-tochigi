import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Brand from './Brand'
import NavDropdown, { navPillClass } from './NavDropdown'
import { CloseIcon, HamburgerIcon } from './icons'
import { menuLinks, othersLinks, aboutLinks, type NavLink } from '../navLinks'
import { apiGet } from '../lib/api'

type Page = { slug: string; title: string; body: string }

// Page-model links not already surfaced as a top-level menu pill — these
// only show up in the "Others" dropdown once their Page has real content.
const otherCandidateLinks = [...othersLinks, ...aboutLinks].filter(
  (link) => !menuLinks.some((menuLink) => menuLink.to === link.to),
)

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [otherLinks, setOtherLinks] = useState<NavLink[]>([])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    apiGet<Page[]>('/api/pages')
      .then((pages) => {
        const pagesBySlug = new Map(pages.map((page) => [page.slug, page]))
        const withContent = otherCandidateLinks
          .map((link) => {
            const page = pagesBySlug.get(link.to)
            return page && page.body.trim() ? { label: page.title, to: link.to } : null
          })
          .filter((link): link is NavLink => link !== null)
        setOtherLinks(withContent)
      })
      .catch(() => setOtherLinks([]))
  }, [])

  return (
    <div className="bg-brand-navy">
      <div className="relative mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6">
        <div className="flex items-center justify-between gap-4">
          <Brand />

          <ul className="hidden flex-wrap items-center gap-3 sm:flex sm:gap-4">
            {menuLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className={navPillClass}>
                  {link.label}
                </Link>
              </li>
            ))}
            {otherLinks.length > 0 && <NavDropdown label="Others" links={otherLinks} />}
          </ul>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
            className="flex h-10 w-10 shrink-0 items-center justify-center text-white sm:hidden"
          >
            {mobileOpen ? <CloseIcon className="h-8 w-8" /> : <HamburgerIcon />}
          </button>
        </div>

        {/* Mobile: left-side slide-in drawer over a dimmed backdrop, like nrnachiba.com's mobile menu */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 sm:hidden">
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 bg-black/50"
            />

            <div className="relative flex h-full w-4/5 max-w-xs flex-col overflow-y-auto bg-brand-navy shadow-2xl">
              <div className="flex justify-center px-6 pb-4 pt-8">
                <div className="rounded-2xl bg-white px-5 py-3 shadow-lg">
                  <Brand
                    logoClassName="h-10 w-10"
                    textClassName="text-base font-extrabold tracking-wide text-brand-navy"
                  />
                </div>
              </div>

              <ul className="flex flex-1 flex-col items-center gap-5 px-6 py-6">
                {[...menuLinks, ...otherLinks].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className="text-lg font-semibold text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
