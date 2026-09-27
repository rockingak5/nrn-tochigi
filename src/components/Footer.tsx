import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiGet } from '../lib/api'
import { getSocialIcon } from '../lib/socialIcons'

type SocialLink = {
  id: number
  platform: string
  url: string
}

type ImportantLink = {
  id: number
  label: string
  url: string
}

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [importantLinks, setImportantLinks] = useState<ImportantLink[]>([])

  useEffect(() => {
    apiGet<SocialLink[]>('/api/social-links')
      .then(setSocialLinks)
      .catch(() => setSocialLinks([]))

    apiGet<ImportantLink[]>('/api/important-links')
      .then(setImportantLinks)
      .catch(() => setImportantLinks([]))
  }, [])

  return (
    <footer className="bg-brand-navy px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:justify-between">
        <nav className="flex flex-col gap-2 sm:gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white/60">Quick Links</h2>
          <Link to="/about-nrna" className="text-base font-medium text-white hover:underline">
            About us
          </Link>
          <Link to="/services" className="text-base font-medium text-white hover:underline">
            Our services
          </Link>
          <Link to="/contact" className="text-base font-medium text-white hover:underline">
            Contact
          </Link>
        </nav>

        {importantLinks.length > 0 && (
          <nav className="flex flex-col gap-2 sm:gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-white/60">Important Links</h2>
            {importantLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-medium text-white hover:underline"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        {socialLinks.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-white/60">Follow us</h2>
            <div className="flex gap-3">
              {socialLinks.map((link) => {
                const { icon: Icon, bgClassName } = getSocialIcon(link.platform)
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.platform}
                    className={`flex h-12 w-12 items-center justify-center rounded-full text-white transition hover:brightness-110 ${bgClassName}`}
                  >
                    <Icon className="h-6 w-6" />
                  </a>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </footer>
  )
}
