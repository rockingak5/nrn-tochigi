import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Brand from './Brand'
import NavDropdown, { navPillClass } from './NavDropdown'
import { CloseIcon, HamburgerIcon } from './icons'
import { primaryLinks, othersLinks, aboutLinks, allLinks } from '../navLinks'

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="flex items-center justify-end gap-4 sm:justify-between">
        <ul className="hidden flex-wrap items-center gap-3 sm:flex sm:gap-4">
          {primaryLinks.map((link) => (
            <li key={link.to}>
              <Link to={link.to} className={navPillClass}>
                {link.label}
              </Link>
            </li>
          ))}
          <NavDropdown label="Others" links={othersLinks} />
          <NavDropdown label="About us" links={aboutLinks} panelWidthClassName="w-56" />
        </ul>

        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation menu"
          className="flex h-10 w-10 shrink-0 items-center justify-center text-brand-navy sm:hidden"
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
              {allLinks.map((link) => (
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
  )
}
