import { useEffect, useState } from 'react'
import { useApi } from '../lib/api'

export default function Customers() {
  const api = useApi()
  const [list, setList] = useState<any[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [error, setError] = useState<string | null>(null)

  const load = () => api.customers.list().then(r => setList(r.data)).catch(e => setError(e.message))
  useEffect(() => { load() }, [])

  async function onCreate(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await api.customers.create({ name, email, address })
      setName(''); setEmail(''); setAddress('')
      load()
    } catch (err: any) { setError(err.message) }
  }

  return (
    <div className="grid gap-4">
      <div className="card p-4">
        <h2 className="text-lg font-semibold mb-3">Add Customer</h2>
        <form onSubmit={onCreate} className="grid sm:grid-cols-3 gap-2">
          <div>
            <label className="block text-xs font-medium mb-1">Name</label>
            <input className="input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Email</label>
            <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Address</label>
            <input className="input" placeholder="Address" value={address} onChange={e=>setAddress(e.target.value)} />
          </div>
          <div className="sm:col-span-3"><button className="btn btn-primary" type="submit">Create</button></div>
        </form>
        {error && <p className="text-red-400 mt-2">{error}</p>}
      </div>

      <div className="card p-4">
        <h2 className="text-lg font-semibold mb-3">Customers</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left table-head">
              <tr><th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">Address</th></tr>
            </thead>
            <tbody>
              {list.map(c => (
                <tr key={c._id} className="table-row">
                  <td className="p-2">{c.name}</td>
                  <td className="p-2">{c.email}</td>
                  <td className="p-2">{c.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


