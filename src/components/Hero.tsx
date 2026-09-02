import { useEffect, useState } from 'react'
import heroImage from '../assets/hero-mountain.svg'
import { apiGet, resolveAssetUrl } from '../lib/api'

type HomeSettings = {
  heroImageUrl: string | null
}

export default function Hero() {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    apiGet<HomeSettings>('/api/home-settings')
      .then((settings) => setImageUrl(resolveAssetUrl(settings.heroImageUrl)))
      .catch(() => setImageUrl(undefined))
  }, [])

  return (
    <div className="h-[260px] w-full overflow-hidden sm:h-[400px] lg:h-[600px]">
      <img
        src={imageUrl ?? heroImage}
        alt="Himalayan mountain at sunset"
        className="h-full w-full object-cover"
      />
    </div>
  )
}
