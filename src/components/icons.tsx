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
      <span className="h-0.5 w-7 bg-brand-navy" />
      <span className="h-0.5 w-7 bg-brand-navy" />
      <span className="h-0.5 w-7 bg-brand-navy" />
    </span>
  )
}
