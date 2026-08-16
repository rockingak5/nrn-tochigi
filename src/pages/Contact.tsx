import { useState, type FormEvent } from 'react'
import PageHeading from '../components/PageHeading'
import FormField from '../components/FormField'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <PageHeading>Contact</PageHeading>
        <p className="text-lg text-slate-600">
          Thanks for reaching out. This form isn't wired up to a backend yet, so nothing was sent
          — connect it to your email service or API before going live.
        </p>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <PageHeading>Contact</PageHeading>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField id="name" label="Name" required maxLength={100} autoComplete="name" />
        <FormField id="email" label="Email" type="email" required maxLength={254} autoComplete="email" />
        <FormField id="message" label="Message" as="textarea" required maxLength={2000} />
        <button
          type="submit"
          className="rounded-lg bg-brand-navy px-6 py-3 font-semibold text-white transition hover:brightness-110"
        >
          Send
        </button>
      </form>
    </section>
  )
}
