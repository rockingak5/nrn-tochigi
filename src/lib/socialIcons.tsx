import type { ReactElement } from 'react'
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  LinkIcon,
  TikTokIcon,
  WhatsAppIcon,
  XIcon,
  YouTubeIcon,
} from '../components/icons'

type IconProps = { className?: string }

const PLATFORMS: Record<string, { icon: (props: IconProps) => ReactElement; bgClassName: string }> = {
  facebook: { icon: FacebookIcon, bgClassName: 'bg-[#1877F2]' },
  instagram: { icon: InstagramIcon, bgClassName: 'bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af]' },
  youtube: { icon: YouTubeIcon, bgClassName: 'bg-[#FF0000]' },
  twitter: { icon: XIcon, bgClassName: 'bg-black' },
  x: { icon: XIcon, bgClassName: 'bg-black' },
  linkedin: { icon: LinkedInIcon, bgClassName: 'bg-[#0A66C2]' },
  tiktok: { icon: TikTokIcon, bgClassName: 'bg-black' },
  whatsapp: { icon: WhatsAppIcon, bgClassName: 'bg-[#25D366]' },
}

export function getSocialIcon(platform: string) {
  const key = platform.trim().toLowerCase().replace(/[^a-z]/g, '')
  return PLATFORMS[key] ?? { icon: LinkIcon, bgClassName: 'bg-brand-navy' }
}
