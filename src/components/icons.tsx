type IconProps = {
  className?: string
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  )
}

export function HamburgerIcon({ className }: IconProps) {
  return (
    <span className={`flex flex-col items-center justify-center gap-1.5 ${className ?? ''}`}>
      <span className="h-0.5 w-7 bg-current" />
      <span className="h-0.5 w-7 bg-current" />
      <span className="h-0.5 w-7 bg-current" />
    </span>
  )
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
    </svg>
  )
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function YouTubeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <rect x="2" y="5" width="20" height="14" rx="4" fill="none" stroke="currentColor" strokeWidth={2} />
      <path d="M10 8.5v7l6-3.5-6-3.5Z" />
    </svg>
  )
}

export function XIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M4 4l16 16M20 4 4 20" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" fill="none" />
    </svg>
  )
}

export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth={2} />
      <circle cx="7.5" cy="8" r="1.4" />
      <path d="M6.3 10.5h2.4V18H6.3v-7.5Zm4.4 0h2.3v1.1c.5-.8 1.4-1.3 2.5-1.3 1.9 0 3 1.2 3 3.5V18h-2.4v-3.7c0-1-.4-1.7-1.3-1.7-.8 0-1.3.6-1.5 1.1-.1.2-.1.5-.1.8V18h-2.4v-7.5Z" />
    </svg>
  )
}

export function TikTokIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M15.5 3c.4 2.2 1.8 3.6 4 3.9v2.6c-1.4 0-2.7-.4-3.9-1.2v6.1c0 3.2-2.3 5.6-5.4 5.6-3 0-5.4-2.4-5.4-5.4 0-3 2.5-5.4 5.6-5.3v2.6c-1.5 0-2.8 1.2-2.8 2.7 0 1.5 1.2 2.8 2.7 2.8 1.6 0 2.9-1.2 2.9-3V3h2.3Z" />
    </svg>
  )
}

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 2a8 8 0 0 1 6.8 12.2l-.3.5.7 2.6-2.6-.7-.5.3A8 8 0 1 1 12 4Zm-3.3 3.6c-.2 0-.5 0-.7.4-.3.4-1 1-1 2.3 0 1.4 1 2.7 1.1 2.9.2.2 2.1 3.2 5 4.3 2.5.9 3-.1 3.5-.6.5-.5.5-1 .4-1.1l-1.4-1.3c-.2-.2-.4-.2-.7 0l-.6.5c-.2.1-.4.1-.6 0-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.3-1.6-1.5-1.9-.1-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.2-.5.1-.2 0-.4 0-.5l-.9-2.1c-.2-.5-.4-.5-.6-.5h-.5Z" />
    </svg>
  )
}

export function LinkIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 15l6-6M10.5 6.5l1-1a3.5 3.5 0 0 1 5 5l-1 1M13.5 17.5l-1 1a3.5 3.5 0 0 1-5-5l1-1"
      />
    </svg>
  )
}
