import { useAuth } from '../state/auth'

// API base resolves to VITE_API_URL + '/api' when set, otherwise '/api' (works with same-origin or Vite proxy)
const envUrl = (import.meta as any).env?.VITE_API_URL as string | undefined
const cleanedBase = envUrl ? envUrl.replace(/\/+$/, '') : ''
export const API_BASE = `${cleanedBase}/api`

async function request(path: string, options: RequestInit = {}, token?: string | null) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error((data && (data.msg || data.error)) || 'Request failed')
  return data
}

export function useApi() {
  const { token } = useAuth()
  return {
    signup: (body: any) => request('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
    login: (body: any) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    me: () => request('/auth/me', {}, token),

    customers: {
      list: () => request('/customers', {}, token),
      create: (body: any) => request('/customers', { method: 'POST', body: JSON.stringify(body) }, token),
    },
    products: {
      list: () => request('/products', {}, token),
      create: (body: any) => request('/products', { method: 'POST', body: JSON.stringify(body) }, token),
    },
    invoices: {
      list: () => request('/invoices', {}, token),
      create: (body: any) => request('/invoices', { method: 'POST', body: JSON.stringify(body) }, token),
      pdf: (id: string) => request(`/invoices/${id}/pdf`, { method: 'POST' }, token),
      download: async (id: string) => {
        const res = await fetch(`${API_BASE}/invoices/${id}/pdf/download`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        if (!res.ok) throw new Error('Download failed')
        const blob = await res.blob()
        const cd = res.headers.get('content-disposition') || ''
        const match = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(cd)
        const filename = decodeURIComponent(match?.[1] || match?.[2] || `invoice-${id}.pdf`)
        return { blob, filename }
      },
      send: (id: string) => request(`/invoices/${id}/send`, { method: 'POST' }, token),
    },
    settings: {
      get: () => request('/settings', {}, token),
      update: (body: any) => request('/settings', { method: 'PATCH', body: JSON.stringify(body) }, token),
    },
  }
}


