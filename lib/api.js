const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Use this in client components — reads token from sessionStorage cache written by useAuth
export async function apiFetch(path, options = {}) {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('toybox_backend_token') : null

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  })

  const data = await res.json()
  if (!data.success) throw new Error(data.error?.message || 'API Error')
  return data
}
