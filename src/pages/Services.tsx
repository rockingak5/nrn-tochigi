import { useEffect, useState } from 'react'
import PageHeading from '../components/PageHeading'
import placeholderImage from '../assets/placeholder-image.svg'
import { apiGet, resolveAssetUrl } from '../lib/api'

type ServiceItem = {
  id: number
  name: string
  description: string
  imageUrl: string | null
}

export default function Services() {
  const [services, setServices] = useState<ServiceItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiGet<ServiceItem[]>('/api/services')
      .then(setServices)
      .catch(() => setServices([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <PageHeading>Services</PageHeading>
      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : services.length === 0 ? (
        <p className="text-slate-500">No services yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 shadow-sm"
            >
              <img
                src={resolveAssetUrl(service.imageUrl) ?? placeholderImage}
                alt=""
                className="h-20 w-20 shrink-0 rounded-lg object-cover"
              />
              <div>
                <h2 className="font-bold text-brand-navy">{service.name}</h2>
                <p className="text-slate-600">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
