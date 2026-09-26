import { useEffect, useState } from 'react'
import heroImage from '../assets/hero-mountain.svg'
import { apiGet, resolveAssetUrl } from '../lib/api'

type HomeSettings = {
  heroImageUrl: string | null
}

export default function Hero() {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiGet<HomeSettings>('/api/home-settings')
      .then((settings) => setImageUrl(resolveAssetUrl(settings.heroImageUrl) ?? undefined))
      .catch(() => setImageUrl(undefined))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="h-[260px] w-full overflow-hidden bg-slate-100 sm:h-[400px] lg:h-[600px]">
      {!loading && (
        <img
          src={imageUrl ?? heroImage}
          alt="Himalayan mountain at sunset"
          className="h-full w-full object-cover"
        />
      )}
    </div>
  )
}
