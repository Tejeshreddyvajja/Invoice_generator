import { useEffect, useState } from 'react'
import { COMMON_CURRENCIES } from '../lib/currencies'
import { useApi } from '../lib/api'

export default function Products() {
  const api = useApi()
  const [list, setList] = useState<any[]>([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [taxRate, setTaxRate] = useState('0')
  const [error, setError] = useState<string | null>(null)

  const load = () => api.products.list().then(r => setList(r.data)).catch(e => setError(e.message))
  useEffect(() => { load() }, [])

  async function onCreate(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await api.products.create({ name, unitPrice: Number(price), taxRate: Number(taxRate), currency })
      setName(''); setPrice(''); setTaxRate('0'); setCurrency('USD')
      load()
    } catch (err: any) { setError(err.message) }
  }

  return (
    <div className="grid gap-4">
      <div className="card p-4">
        <h2 className="text-lg font-semibold mb-3">Add Product</h2>
        <form onSubmit={onCreate} className="grid sm:grid-cols-4 gap-2">
          <div>
            <label className="block text-xs font-medium mb-1">Name</label>
            <input className="input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Unit Price</label>
            <input className="input" placeholder="Price" value={price} onChange={e=>setPrice(e.target.value)} required />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Currency</label>
            <select className="input" value={currency} onChange={e=>setCurrency(e.target.value)}>
              {COMMON_CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Tax %</label>
            <input className="input" placeholder="Tax %" value={taxRate} onChange={e=>setTaxRate(e.target.value)} />
          </div>
          <div className="sm:col-span-3"><button className="btn btn-primary" type="submit">Create</button></div>
        </form>
        {error && <p className="text-red-400 mt-2">{error}</p>}
      </div>

      <div className="card p-4">
        <h2 className="text-lg font-semibold mb-3">Products</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left table-head">
              <tr><th className="p-2">Name</th><th className="p-2">Unit Price</th><th className="p-2">Tax %</th></tr>
            </thead>
            <tbody>
              {list.map(p => (
                <tr key={p._id} className="table-row">
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">{p.unitPrice}</td>
                  <td className="p-2">{p.taxRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


