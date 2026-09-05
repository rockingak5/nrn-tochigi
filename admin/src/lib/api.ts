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

// The admin panel's session used to rely on a cookie (`connect.sid`), but
// GoDaddy's hosting platform sits behind an edge/CDN layer that doesn't
// reliably pass that cookie back to the browser (confirmed via server logs
// on both the preview subdomain and the live domain: it's simply never
// sent back on any later request). So auth instead uses a bearer token,
// handed back on login and stored here, sent as a plain `Authorization`
// header — no cookie involved, so there's nothing for the platform to drop.
const TOKEN_KEY = 'admin_token'

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    // localStorage unavailable (private mode, etc.) — auth just won't persist.
  }
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken()
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      ...(init?.body && !(init.body instanceof FormData)
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  })

  if (!res.ok) {
    if (res.status === 401) setToken(null)
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
