import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { api, ApiError, resolveAssetUrl } from '../lib/api'

export type FieldConfig = {
  key: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'image'
}

type Item = Record<string, unknown> & { id: number }

type ResourceEditorProps = {
  title: string
  resourcePath: string
  fields: FieldConfig[]
  itemLabel: (item: Item) => string
}

function emptyFormData(fields: FieldConfig[]): Record<string, string | number> {
  const data: Record<string, string | number> = {}
  for (const field of fields) {
    data[field.key] = field.type === 'number' ? 0 : ''
  }
  return data
}

export default function ResourceEditor({ title, resourcePath, fields, itemLabel }: ResourceEditorProps) {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | 'new' | null>(null)
  const [formData, setFormData] = useState<Record<string, string | number>>(emptyFormData(fields))
  const [uploadingKey, setUploadingKey] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.get<Item[]>(resourcePath)
      setItems(data)
    } finally {
      setLoading(false)
    }
  }, [resourcePath])

  useEffect(() => {
    refresh()
  }, [refresh])

  function startCreate() {
    setFormData(emptyFormData(fields))
    setEditingId('new')
    setError(null)
  }

  function startEdit(item: Item) {
    const data: Record<string, string | number> = {}
    for (const field of fields) {
      data[field.key] = (item[field.key] as string | number) ?? (field.type === 'number' ? 0 : '')
    }
    setFormData(data)
    setEditingId(item.id)
    setError(null)
  }

  async function handleImageChange(key: string, e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingKey(key)
    setError(null)
    try {
      const { url } = await api.upload(file)
      setFormData((prev) => ({ ...prev, [key]: url }))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Upload failed')
    } finally {
      setUploadingKey(null)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      if (editingId === 'new') {
        await api.post(resourcePath, formData)
      } else if (editingId !== null) {
        await api.put(`${resourcePath}/${editingId}`, formData)
      }
      setEditingId(null)
      await refresh()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Save failed')
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this item?')) return
    await api.delete(`${resourcePath}/${id}`)
    await refresh()
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-brand-navy">{title}</h1>
        {editingId === null && (
          <button
            onClick={startCreate}
            className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white"
          >
            Add new
          </button>
        )}
      </div>

      {editingId !== null && (
        <form onSubmit={handleSubmit} className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <label key={field.key} className={field.type === 'textarea' ? 'sm:col-span-2 block' : 'block'}>
                <span className="mb-1 block text-sm font-medium text-slate-700">{field.label}</span>
                {field.type === 'textarea' ? (
                  <textarea
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
                    rows={3}
                    value={formData[field.key] ?? ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    required
                  />
                ) : field.type === 'number' ? (
                  <input
                    type="number"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
                    value={formData[field.key] ?? 0}
                    onChange={(e) => setFormData((prev) => ({ ...prev, [field.key]: Number(e.target.value) }))}
                  />
                ) : field.type === 'image' ? (
                  <div className="flex items-center gap-3">
                    {formData[field.key] ? (
                      <img
                        src={resolveAssetUrl(String(formData[field.key]))}
                        alt=""
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    ) : null}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(field.key, e)}
                      className="text-sm"
                    />
                    {uploadingKey === field.key && <span className="text-xs text-slate-500">Uploading…</span>}
                  </div>
                ) : (
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
                    value={formData[field.key] ?? ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    required
                  />
                )}
              </label>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <button type="submit" className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white">
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-slate-500">No items yet.</p>
      ) : (
        <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-slate-700">{itemLabel(item)}</span>
              <div className="flex gap-3">
                <button onClick={() => startEdit(item)} className="text-sm font-medium text-brand-navy">
                  Edit
                </button>
                <button onClick={() => handleDelete(item.id)} className="text-sm font-medium text-red-600">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
