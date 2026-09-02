import { useEffect, useState } from 'react'
import activityImage from '../assets/activity.svg'
import { apiGet, resolveAssetUrl } from '../lib/api'

type Activity = {
  id: number
  text: string
}

type HomeSettings = {
  activitiesImageUrl: string | null
}

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    apiGet<Activity[]>('/api/activities')
      .then(setActivities)
      .catch(() => setActivities([]))
    apiGet<HomeSettings>('/api/home-settings')
      .then((settings) => setImageUrl(resolveAssetUrl(settings.activitiesImageUrl)))
      .catch(() => setImageUrl(undefined))
  }, [])

  return (
    <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-16">
      <div>
        <h2 className="mb-6 text-3xl font-extrabold text-brand-navy sm:text-4xl">
          Recent Activities
        </h2>
        <ul className="space-y-4">
          {activities.map((item) => (
            <li key={item.id} className="text-lg text-brand-navy sm:text-xl">
              - {item.text}
            </li>
          ))}
        </ul>
      </div>
      <div className="mx-auto w-full max-w-md">
        <img
          src={imageUrl ?? activityImage}
          alt="Children exchanging marigold garlands during Tihar"
          className="w-full rounded-lg object-cover shadow-lg"
        />
      </div>
    </section>
  )
}
