import { useEffect, useState } from 'react'
import defaultLogo from '../assets/logo-nrna.png'
import { apiGet, resolveAssetUrl } from '../lib/api'

type HomeSettings = {
  siteLogoUrl: string | null
}

type BrandProps = {
  logoClassName?: string
  textClassName?: string
}

export default function Brand({
  logoClassName = 'h-14 w-14 sm:h-16 sm:w-16',
  textClassName = 'text-xl font-extrabold tracking-wide text-white sm:text-3xl',
}: BrandProps) {
  const [logo, setLogo] = useState(defaultLogo)

  useEffect(() => {
    apiGet<HomeSettings>('/api/home-settings')
      .then((settings) => {
        const url = resolveAssetUrl(settings.siteLogoUrl)
        if (url) setLogo(url)
      })
      .catch(() => {})
  }, [])

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <img src={logo} alt="NRNA Tochigi logo" className={`shrink-0 ${logoClassName}`} />
      <span className={textClassName}>NRNA TOCHIGI</span>
    </div>
  )
}
