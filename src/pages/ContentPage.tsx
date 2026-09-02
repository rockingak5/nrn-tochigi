import { useEffect, useState } from 'react'
import PageHeading from '../components/PageHeading'
import { apiGet, resolveAssetUrl } from '../lib/api'

type Page = {
  slug: string
  title: string
  imageUrl: string | null
  body: string
}

type ContentPageProps = {
  slug: string
  fallbackTitle: string
}

export default function ContentPage({ slug, fallbackTitle }: ContentPageProps) {
  const [page, setPage] = useState<Page | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    apiGet<Page>(`/api/pages${slug}`)
      .then(setPage)
      .catch(() => setPage(null))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <p className="text-slate-500">Loading…</p>
      </section>
    )
  }

  const title = page?.title ?? fallbackTitle
  const image = resolveAssetUrl(page?.imageUrl)
  const body = page?.body?.trim()

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <PageHeading>{title}</PageHeading>
      {image && <img src={image} alt="" className="mb-8 w-full rounded-xl object-cover" />}
      {body ? (
        <div
          className="space-y-4 text-lg leading-relaxed text-slate-600 [&_a]:text-brand-navy [&_a]:underline [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-brand-navy [&_li]:ml-5 [&_ol]:list-decimal [&_strong]:text-brand-navy [&_ul]:list-disc"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      ) : (
        <p className="text-lg text-slate-600">
          Content for this page is coming soon. Check back for updates on {title.toLowerCase()}.
        </p>
      )}
    </section>
  )
}
