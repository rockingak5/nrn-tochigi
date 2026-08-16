import { Link } from 'react-router-dom'
import PageHeading from '../components/PageHeading'

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <PageHeading className="mb-4">Page not found</PageHeading>
      <p className="mb-8 text-lg text-slate-600">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="inline-block rounded-lg bg-brand-navy px-6 py-3 font-semibold text-white transition hover:brightness-110"
      >
        Back to Home
      </Link>
    </section>
  )
}
