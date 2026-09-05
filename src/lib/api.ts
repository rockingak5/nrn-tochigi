// In production this is served from the same origin as the API (unified
// deploy), so an empty string (relative URLs) is the right default. GoDaddy's
// PaaS auto-injects VITE_API_URL as "<this app's own origin>/api" for
// detected Vite projects; since every call site below already includes the
// "/api" prefix in its path, strip a trailing "/api" from that value so we
// don't end up requesting "/api/api/...". A manually-set VITE_API_URL without
// a trailing "/api" (e.g. for local dev against a bare API host) passes
// through unchanged.
const rawApiUrl = import.meta.env.VITE_API_URL
const API_URL = rawApiUrl
  ? rawApiUrl.replace(/\/api\/?$/, '')
  : (import.meta.env.DEV ? 'http://localhost:5000' : '')

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`)
  if (!res.ok) throw new Error(`Request to ${path} failed with ${res.status}`)
  return res.json() as Promise<T>
}

export async function apiPost<T>(path: string, data: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }))
    throw new ApiError(res.status, body.message ?? res.statusText)
  }
  return res.json() as Promise<T>
}

export function resolveAssetUrl(url: string | null | undefined) {
  if (!url) return undefined
  if (url.startsWith('http')) return url
  return `${API_URL}${url}`
}
