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
