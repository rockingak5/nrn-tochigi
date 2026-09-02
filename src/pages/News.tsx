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
}

export default function News() {
  const [items, setItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiGet<NewsItem[]>('/api/news')
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <PageHeading>News</PageHeading>
      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-slate-500">No news yet.</p>
      ) : (
        <div className="space-y-8">
          {items.map((item) => (
            <article
              key={item.id}
              className="flex flex-col gap-4 border-b border-slate-200 pb-8 sm:flex-row"
            >
              <img
                src={resolveAssetUrl(item.imageUrl) ?? placeholderImage}
                alt=""
                className="h-40 w-full shrink-0 rounded-lg object-cover sm:h-32 sm:w-48"
              />
              <div>
                <p className="mb-1 text-sm font-semibold text-slate-500">{item.date}</p>
                <h2 className="mb-2 text-xl font-bold text-brand-navy">{item.title}</h2>
                <p className="text-slate-600">{item.summary}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
