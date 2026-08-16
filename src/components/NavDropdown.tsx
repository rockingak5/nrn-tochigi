import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDownIcon } from './icons'
import type { NavLink } from '../navLinks'

export const navPillClass =
  'rounded-lg bg-brand-pill px-6 py-3 text-base font-semibold text-brand-navy transition hover:bg-brand-pill-hover sm:text-lg'

type NavDropdownProps = {
  label: string
  links: NavLink[]
  panelWidthClassName?: string
}

export default function NavDropdown({ label, links, panelWidthClassName = 'w-60' }: NavDropdownProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <li ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className={`flex items-center gap-1 ${navPillClass}`}
      >
        {label}
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <nav className={`absolute left-0 top-full z-30 mt-2 ${panelWidthClassName} rounded-2xl bg-brand-navy py-3 shadow-2xl`}>
          <ul>
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="block px-6 py-3 text-base font-semibold text-white hover:bg-white/10"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </li>
  )
}
