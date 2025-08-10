import { useEffect, useState } from 'react'
import { useApi } from '../lib/api'

export default function Dashboard() {
  const api = useApi()
  const [counts, setCounts] = useState<{ customers: number; products: number; invoices: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([api.customers.list(), api.products.list(), api.invoices.list()])
      .then(([cs, ps, is]) => setCounts({ customers: cs.data.length, products: ps.data.length, invoices: is.data.length }))
      .catch(e => setError(e.message || 'Failed'))
  }, [])

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {['Customers', 'Products', 'Invoices'].map((title, idx) => (
        <div
          key={title}
          className="card flex flex-col items-start justify-center min-h-[120px] bg-gradient-to-br from-brand-100 via-brand-50 to-accent-100 shadow-lg"
        >
          <p className="text-sm font-semibold text-brand-600 mb-2 uppercase tracking-wide drop-shadow">
            {title}
          </p>
          <p className="text-4xl font-extrabold text-brand-700 drop-shadow">
            {counts ? Object.values(counts)[idx] : '—'}
          </p>
        </div>
      ))}
      {error && <p className="text-accent-500 font-semibold col-span-3">{error}</p>}
    </div>
  )
}


