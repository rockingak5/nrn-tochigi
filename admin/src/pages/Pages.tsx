import { useEffect, useState, type ChangeEvent } from 'react'
import { api, ApiError, resolveAssetUrl } from '../lib/api'
import RichTextEditor from '../components/RichTextEditor'

type Page = {
  id: number
  slug: string
  title: string
  imageUrl: string | null
  body: string
}

export default function Pages() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [body, setBody] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .get<Page[]>('/api/pages')
      .then(setPages)
      .finally(() => setLoading(false))
  }, [])

  function startEdit(page: Page) {
    setEditingSlug(page.slug)
    setTitle(page.title)
    setImageUrl(page.imageUrl)
    setBody(page.body)
    setError(null)
  }

  async function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const { url } = await api.upload(file)
      setImageUrl(url)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function handleSave() {
    if (!editingSlug) return
    setSaving(true)
    setError(null)
    try {
      const updated = await api.put<Page>(`/api/pages${editingSlug}`, { title, imageUrl, body })
      setPages((prev) => prev.map((p) => (p.slug === editingSlug ? updated : p)))
      setEditingSlug(null)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (editingSlug) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-brand-navy">Edit page</h1>
          <button
            onClick={() => setEditingSlug(null)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600"
          >
            Back to pages
          </button>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <label className="mb-4 block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Title</span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label className="mb-4 block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Image</span>
            <div className="flex items-center gap-3">
              {imageUrl && <img src={resolveAssetUrl(imageUrl)} alt="" className="h-16 w-16 rounded-lg object-cover" />}
              <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm" />
              {uploading && <span className="text-xs text-slate-500">Uploading…</span>}
            </div>
          </label>
          <label className="mb-6 block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Content</span>
            <RichTextEditor value={body} onChange={setBody} />
          </label>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-brand-navy">Pages</h1>
      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : (
        <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
          {pages.map((page) => (
            <li key={page.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <span className="text-sm font-medium text-slate-700">{page.title}</span>
                <span className="ml-2 text-xs text-slate-400">{page.slug}</span>
                {!page.body && <span className="ml-2 text-xs text-amber-600">Empty</span>}
              </div>
              <button onClick={() => startEdit(page)} className="text-sm font-medium text-brand-navy">
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
