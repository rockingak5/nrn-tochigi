import { useEffect, useState, type ChangeEvent } from 'react'
import { api, ApiError, resolveAssetUrl } from '../lib/api'
import ResourceEditor from '../components/ResourceEditor'

type HomeSettings = {
  heroImageUrl: string | null
  activitiesImageUrl: string | null
  siteLogoUrl: string | null
}

function ImageSetting({
  label,
  imageUrl,
  onChange,
}: {
  label: string
  imageUrl: string | null
  onChange: (url: string) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const { url } = await api.upload(file)
      onChange(url)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <div className="flex items-center gap-3">
        {imageUrl && <img src={resolveAssetUrl(imageUrl)} alt="" className="h-16 w-24 rounded-lg object-cover" />}
        <input type="file" accept="image/*" onChange={handleChange} className="text-sm" />
        {uploading && <span className="text-xs text-slate-500">Uploading…</span>}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </label>
  )
}

export default function Home() {
  const [settings, setSettings] = useState<HomeSettings | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.get<HomeSettings>('/api/home-settings').then(setSettings)
  }, [])

  async function save(next: HomeSettings) {
    setSettings(next)
    setSaving(true)
    setSaved(false)
    try {
      await api.put('/api/home-settings', next)
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-6 text-xl font-bold text-brand-navy">Site branding</h1>
        {settings && (
          <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2">
            <ImageSetting
              label="Site logo"
              imageUrl={settings.siteLogoUrl}
              onChange={(url) => save({ ...settings, siteLogoUrl: url })}
            />
          </div>
        )}
      </div>

      <div>
        <h1 className="mb-6 text-xl font-bold text-brand-navy">Home page images</h1>
        {settings && (
          <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2">
            <ImageSetting
              label="Hero banner"
              imageUrl={settings.heroImageUrl}
              onChange={(url) => save({ ...settings, heroImageUrl: url })}
            />
            <ImageSetting
              label="Activities image"
              imageUrl={settings.activitiesImageUrl}
              onChange={(url) => save({ ...settings, activitiesImageUrl: url })}
            />
          </div>
        )}
      </div>

      {(saving || saved) && (
        <p className={`text-xs ${saving ? 'text-slate-500' : 'text-green-600'}`}>
          {saving ? 'Saving…' : 'Saved'}
        </p>
      )}

      <ResourceEditor
        title="Recent activities"
        resourcePath="/api/activities"
        fields={[
          { key: 'text', label: 'Activity', type: 'textarea' },
          { key: 'order', label: 'Order', type: 'number' },
        ]}
        itemLabel={(item) => item.text as string}
      />
    </div>
  )
}
