// Thin fetch wrapper for the Storywave Studio (POCKET_FM) backend.
// Mirrors the sibling POCKET_FM frontend's api/client.js so both apps talk to
// the same FastAPI service the same way.
export const API_BASE = (import.meta.env.VITE_API_BASE || 'http://localhost:8000').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(message, status = 0, detail = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.detail = detail
  }
}

export function apiUrl(path) {
  return `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`
}

export async function request(path, { method = 'GET', body, headers = {}, signal } = {}) {
  const response = await fetch(apiUrl(path), {
    method,
    signal,
    headers: body == null ? headers : { 'Content-Type': 'application/json', ...headers },
    body: body == null ? undefined : JSON.stringify(body),
  }).catch((error) => {
    throw new ApiError(`Cannot reach the Storywave backend at ${API_BASE}. Is it running?`, 0, error)
  })

  if (!response.ok) {
    let detail
    try { detail = await response.json() } catch { detail = await response.text() }
    const raw = detail?.detail || detail?.message || `${response.status} ${response.statusText}`
    throw new ApiError(String(raw), response.status, detail)
  }

  if (response.status === 204) return null
  const type = response.headers.get('content-type') || ''
  return type.includes('application/json') ? response.json() : response
}

export const get = (path, options) => request(path, { ...options, method: 'GET' })
export const post = (path, body, options) => request(path, { ...options, method: 'POST', body })
