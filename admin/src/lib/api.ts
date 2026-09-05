// This app is served from the same origin as the API (unified single-process
// deploy), so requests should always be relative in production. We
// deliberately IGNORE GoDaddy's auto-injected VITE_API_URL here: it's baked
// in at build time as "<the origin the app happened to be built under>/api"
// (the Preview environment's URL), and GoDaddy's "Publish to Live" promotes
// that same build to the production domain rather than rebuilding against
// it — so trusting VITE_API_URL would send every request from the live site
// back to the preview subdomain. Only local dev (`vite dev`, no production
// build) falls back to a bare API host.
const API_URL = import.meta.env.DEV ? 'http://localhost:5000' : ''

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers:
      init?.body && !(init.body instanceof FormData)
        ? { 'Content-Type': 'application/json', ...init.headers }
        : init?.headers,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }))
    throw new ApiError(res.status, body.message ?? res.statusText)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(data) }),
  put: <T>(path: string, data: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(data) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
  upload: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return request<{ url: string }>('/api/admin/uploads', { method: 'POST', body: form })
  },
}

export function resolveAssetUrl(url: string | null | undefined) {
  if (!url) return undefined
  if (url.startsWith('http')) return url
  return `${API_URL}${url}`
}
