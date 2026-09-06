import { useEffect, useState } from 'react'
import PageHeading from '../components/PageHeading'
import placeholderImage from '../assets/placeholder-image.svg'
import { apiGet, resolveAssetUrl } from '../lib/api'

type NewsItem = {
  id: number
  title: string
  date: string
  summary: string
  imageUrl: string | null
  createdAt: string
}

type EventItem = {
  id: number
  title: string
  date: string
  description: string
  imageUrl: string | null
  createdAt: string
}

type FeedItem = {
  key: string
  kind: 'News' | 'Event'
  title: string
  date: string
  text: string
  imageUrl: string | null
  createdAt: string
}

export default function NewsAndEvents() {
  const [items, setItems] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      apiGet<NewsItem[]>('/api/news').catch(() => []),
      apiGet<EventItem[]>('/api/events').catch(() => []),
    ]).then(([news, events]) => {
      const feed: FeedItem[] = [
        ...news.map((item) => ({
          key: `news-${item.id}`,
          kind: 'News' as const,
          title: item.title,
          date: item.date,
          text: item.summary,
          imageUrl: item.imageUrl,
          createdAt: item.createdAt,
        })),
        ...events.map((item) => ({
          key: `event-${item.id}`,
          kind: 'Event' as const,
          title: item.title,
          date: item.date,
          text: item.description,
          imageUrl: item.imageUrl,
          createdAt: item.createdAt,
        })),
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      setItems(feed)
      setLoading(false)
    })
  }, [])

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <PageHeading>News and Events</PageHeading>
      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-slate-500">Nothing to show yet.</p>
      ) : (
        <div className="space-y-8">
          {items.map((item) => (
            <article
              key={item.key}
              className="flex flex-col gap-4 border-b border-slate-200 pb-8 sm:flex-row"
            >
              <img
                src={resolveAssetUrl(item.imageUrl) ?? placeholderImage}
                alt=""
                className="h-40 w-full shrink-0 rounded-lg object-cover sm:h-32 sm:w-48"
              />
              <div>
                <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-500">
                  <span className="rounded-full bg-brand-pill px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-brand-navy">
                    {item.kind}
                  </span>
                  {item.date}
                </p>
                <h2 className="mb-2 text-xl font-bold text-brand-navy">{item.title}</h2>
                <p className="text-slate-600">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
