import type { ReactNode } from 'react'

type PageHeadingProps = {
  children: ReactNode
  className?: string
}

export default function PageHeading({ children, className = 'mb-10' }: PageHeadingProps) {
  return <h1 className={`text-3xl font-extrabold text-brand-navy sm:text-4xl ${className}`}>{children}</h1>
}
