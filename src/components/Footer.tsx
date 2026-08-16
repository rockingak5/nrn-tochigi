import { Link } from 'react-router-dom'

export default function Footer() {
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

        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1877F2] transition hover:brightness-110"
        >
          <svg viewBox="0 0 24 24" fill="white" className="h-6 w-6">
            <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
          </svg>
        </a>
      </div>
    </footer>
  )
}
