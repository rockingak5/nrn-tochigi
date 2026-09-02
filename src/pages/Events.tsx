import { useEffect, useState } from 'react'
import PageHeading from '../components/PageHeading'
import placeholderImage from '../assets/placeholder-image.svg'
import { apiGet, resolveAssetUrl } from '../lib/api'

type EventItem = {
  id: number
  title: string
  date: string
  description: string
  imageUrl: string | null
}

export default function Events() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiGet<EventItem[]>('/api/events')
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <PageHeading>Events</PageHeading>
      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : events.length === 0 ? (
        <p className="text-slate-500">No events yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div key={event.id} className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
              <img
                src={resolveAssetUrl(event.imageUrl) ?? placeholderImage}
                alt=""
                className="h-40 w-full object-cover"
              />
              <div className="p-6">
                <p className="mb-1 text-sm font-semibold text-slate-500">{event.date}</p>
                <h2 className="mb-2 text-xl font-bold text-brand-navy">{event.title}</h2>
                <p className="text-slate-600">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
