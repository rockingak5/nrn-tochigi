import { useEffect, useState } from 'react'
import { api } from '../lib/api'

type ContactMessage = {
  id: number
  name: string
  email: string
  message: string
  createdAt: string
}

export default function Messages() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)

  function refresh() {
    setLoading(true)
    api
      .get<ContactMessage[]>('/api/admin/contact-messages')
      .then(setMessages)
      .finally(() => setLoading(false))
  }

  useEffect(refresh, [])

  async function handleDelete(id: number) {
    if (!confirm('Delete this message?')) return
    await api.delete(`/api/admin/contact-messages/${id}`)
    refresh()
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-brand-navy">Contact messages</h1>
      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : messages.length === 0 ? (
        <p className="text-slate-500">No messages yet.</p>
      ) : (
        <ul className="space-y-4">
          {messages.map((msg) => (
            <li key={msg.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <p className="font-semibold text-brand-navy">{msg.name}</p>
                  <p className="text-sm text-slate-500">{msg.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">{new Date(msg.createdAt).toLocaleString()}</p>
                  <button onClick={() => handleDelete(msg.id)} className="text-sm font-medium text-red-600">
                    Delete
                  </button>
                </div>
              </div>
              <p className="whitespace-pre-wrap text-slate-600">{msg.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
