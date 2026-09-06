import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiGet } from '../lib/api'
import { getSocialIcon } from '../lib/socialIcons'

type SocialLink = {
  id: number
  platform: string
  url: string
}

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])

  useEffect(() => {
    apiGet<SocialLink[]>('/api/social-links')
      .then(setSocialLinks)
      .catch(() => setSocialLinks([]))
  }, [])

  return (
    <footer className="bg-brand-navy px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <nav className="flex gap-8">
          <Link to="/about-nrna" className="text-lg font-medium text-white hover:underline">
            about us
          </Link>
          <Link to="/contact" className="text-lg font-medium text-white hover:underline">
            contact
          </Link>
        </nav>

        {socialLinks.length > 0 && (
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
        )}
      </div>
    </footer>
  )
}
