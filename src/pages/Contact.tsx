import { useState, type FormEvent } from 'react'
import PageHeading from '../components/PageHeading'
import FormField from '../components/FormField'
import { apiPost, ApiError } from '../lib/api'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    const form = event.currentTarget
    const data = new FormData(form)

    try {
      await apiPost('/api/contact', {
        name: data.get('name'),
        email: data.get('email'),
        message: data.get('message'),
      })
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <PageHeading>Contact</PageHeading>
        <p className="text-lg text-slate-600">Thanks for reaching out — we'll get back to you soon.</p>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <PageHeading>Contact</PageHeading>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <FormField id="name" label="Name" required maxLength={100} autoComplete="name" />
        <FormField id="email" label="Email" type="email" required maxLength={254} autoComplete="email" />
        <FormField id="message" label="Message" as="textarea" required maxLength={2000} />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-brand-navy px-6 py-3 font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
        >
          {submitting ? 'Sending…' : 'Send'}
        </button>
      </form>
    </section>
  )
}
