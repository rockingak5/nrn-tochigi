import Brand from './Brand'

export default function Header() {
  return (
    <header className="bg-brand-navy">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <Brand />
      </div>
    </header>
  )
}
