import { useEffect, useState } from 'react'
import { useApi } from '../lib/api'
import { Link } from 'react-router-dom'

export default function Invoices() {
  const api = useApi()
  const [list, setList] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const load = () => api.invoices.list().then(r => setList(r.data)).catch(e => setError(e.message))
  useEffect(() => { load() }, [])

  async function onDownload(id: string) {
    try {
      const { blob, filename } = await api.invoices.download(id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e: any) {
      alert(e.message || 'Download failed')
    }
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Invoices</h2>
        <Link to="/invoices/new" className="btn btn-primary">Create Invoice</Link>
      </div>
      <div className="card p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left table-head">
              <tr>
                <th className="p-2">Invoice Number</th>
                <th className="p-2">Customer Name</th>
                <th className="p-2">Grand Total</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map(i => (
                <tr key={i._id} className="table-row">
                  <td className="p-2">{i.invoiceNumber}</td>
                  <td className="p-2">{i.customerId?.name}</td>
                  <td className="p-2">{i.currency} {i.total?.toFixed?.(2) ?? i.total}</td>
                  <td className="p-2">{i.status}</td>
                  <td className="p-2">
                    <button className="btn btn-secondary" onClick={()=>onDownload(i._id)}>Download PDF</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>
    </div>
  )
}


