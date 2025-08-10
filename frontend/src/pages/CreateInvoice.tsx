import { useEffect, useMemo, useState } from 'react'
import { useApi } from '../lib/api'
import { COMMON_CURRENCIES } from '../lib/currencies'

type Item = { name: string; quantity: number; unitPrice: number; taxRate: number }

export default function CreateInvoice() {
  const api = useApi()
  const [customers, setCustomers] = useState<any[]>([])
  const [customerId, setCustomerId] = useState('')
  const [items, setItems] = useState<Item[]>([{ name: '', quantity: 1, unitPrice: 0, taxRate: 0 }])
  const [currency, setCurrency] = useState('USD')
  const [rates, setRates] = useState<Record<string, number>>({ USD: 1 })
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    api.customers.list().then(r => setCustomers(r.data))
    api.settings.get().then(r => {
      if (r.settings?.defaultCurrency) setCurrency(r.settings.defaultCurrency)
      if (r.settings?.currencyRates) setRates(r.settings.currencyRates)
    })
  }, [])

  const totals = useMemo(() => {
    const subtotal = items.reduce((s,i)=> s + (i.quantity * i.unitPrice), 0)
    const taxTotal = items.reduce((s,i)=> s + (i.quantity * i.unitPrice * (i.taxRate/100)), 0)
    const total = subtotal + taxTotal
    return { subtotal, taxTotal, total }
  }, [items])

  function updateItem(idx: number, patch: Partial<Item>) {
    setItems(items.map((it, i) => i===idx ? { ...it, ...patch } : it))
  }
  function addItem() { setItems([...items, { name: '', quantity: 1, unitPrice: 0, taxRate: 0 }]) }
  function removeItem(idx: number) { setItems(items.filter((_,i)=>i!==idx)) }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault(); setError(null); setSuccess(null)
    try {
      const payload = { customerId, currency, notes, items }
      const res = await api.invoices.create(payload)
      setSuccess(`Created invoice ${res.invoice.invoiceNumber}`)
    } catch (err: any) { setError(err.message) }
  }

  return (
    <div className="grid gap-6">
      <h2 className="text-xl font-semibold">Create Invoice</h2>
      <form onSubmit={onCreate} className="grid gap-4 card p-5">
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Customer</label>
            <select className="input" value={customerId} onChange={e=>setCustomerId(e.target.value)} required>
              <option value="">Select customer</option>
              {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Currency</label>
            <select className="input" value={currency} onChange={e=>setCurrency(e.target.value)}>
              {[...new Set([...Object.keys(rates || {}), ...COMMON_CURRENCIES])].map(code => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Items</h3>
            <button type="button" className="btn btn-secondary" onClick={addItem}>Add Item</button>
          </div>
          <div className="grid gap-3">
            <div className="grid sm:grid-cols-5 gap-2 text-xs uppercase tracking-wide text-brand-200">
              <div>Name</div>
              <div>Qty</div>
              <div>Unit Price</div>
              <div>Tax %</div>
              <div>Actions</div>
            </div>
            {items.map((it, idx) => (
              <div key={idx} className="grid sm:grid-cols-5 gap-2">
                <input className="input sm:col-span-2" placeholder="Name" value={it.name} onChange={e=>updateItem(idx,{name:e.target.value})} required />
                <input className="input" placeholder="Qty" type="number" min={1} value={it.quantity} onChange={e=>updateItem(idx,{quantity:Number(e.target.value)})} />
                <input className="input" placeholder="Unit Price" type="number" min={0} step="0.01" value={it.unitPrice} onChange={e=>updateItem(idx,{unitPrice:Number(e.target.value)})} />
                <div className="flex gap-2">
                  <input className="input flex-1" placeholder="Tax %" type="number" min={0} step="0.01" value={it.taxRate} onChange={e=>updateItem(idx,{taxRate:Number(e.target.value)})} />
                  <button type="button" className="btn btn-secondary" onClick={()=>removeItem(idx)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea className="input" rows={3} value={notes} onChange={e=>setNotes(e.target.value)} />
        </div>

        <div className="grid sm:grid-cols-3 gap-2 text-sm text-gray-700">
          <div className="p-3 bg-gray-50 rounded">Subtotal: <b>{currency} {totals.subtotal.toFixed(2)}</b></div>
          <div className="p-3 bg-gray-50 rounded">Tax: <b>{currency} {totals.taxTotal.toFixed(2)}</b></div>
          <div className="p-3 bg-gray-50 rounded">Total: <b>{currency} {totals.total.toFixed(2)}</b></div>
        </div>

        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}
        <div><button className="btn btn-primary">Create Invoice</button></div>
      </form>
    </div>
  )
}


