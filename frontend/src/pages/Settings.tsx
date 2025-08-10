import { useEffect, useState } from 'react'
import { useApi } from '../lib/api'

export default function Settings() {
  const api = useApi()
  const [form, setForm] = useState<any>({})
  const [msg, setMsg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.settings.get().then(r => setForm(r.settings || {})).catch(e => setError(e.message))
  }, [])

  function setField(k: string, v: any) { setForm((f: any) => ({ ...f, [k]: v })) }

  async function onSave(e: React.FormEvent) {
    e.preventDefault(); setMsg(null); setError(null)
    try { const r = await api.settings.update(form); setForm(r.settings); setMsg('Saved') }
    catch (err: any) { setError(err.message) }
  }

  return (
    <div className="card p-5 max-w-2xl">
      <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
      <form onSubmit={onSave} className="grid gap-3">
        <div className="flex items-center gap-4 mb-2">
          <div className="relative w-16 h-16">
            {form.profilePhoto ? (
              <img src={form.profilePhoto} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-brand-300" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-accent-400 flex items-center justify-center text-2xl font-bold text-white">
                {form.companyName ? form.companyName[0] : (form.companyEmail ? form.companyEmail[0] : 'U')}
              </div>
            )}
            <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow cursor-pointer border border-brand-200">
              <input type="file" accept="image/*" className="hidden" onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = ev => setField('profilePhoto', ev.target?.result);
                  reader.readAsDataURL(file);
                }
              }} />
              <span className="text-xs text-brand-700">✎</span>
            </label>
          </div>
          <div>
            <div className="font-semibold text-lg">{form.companyName || 'Your Company'}</div>
            <div className="text-sm text-brand-500">{form.companyEmail || 'your@email.com'}</div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Company Logo</label>
          <div className="flex items-center gap-3">
            {form.companyLogo ? (
              <img src={form.companyLogo} alt="Logo" className="w-16 h-16 rounded bg-white object-contain border border-brand-200" />
            ) : (
              <div className="w-16 h-16 rounded bg-brand-100 flex items-center justify-center text-2xl text-brand-400 border border-brand-200">🏢</div>
            )}
            <label className="btn btn-secondary cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = ev => setField('companyLogo', ev.target?.result);
                  reader.readAsDataURL(file);
                }
              }} />
              Upload Logo
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input className="input" value={form.companyName||''} onChange={e=>setField('companyName', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input className="input" value={form.companyEmail||''} onChange={e=>setField('companyEmail', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Change Password</label>
          <input className="input" type="password" placeholder="New password" onChange={e=>setField('newPassword', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Company Address</label>
          <textarea rows={3} className="input" value={form.companyAddress||''} onChange={e=>setField('companyAddress', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Invoice Prefix</label>
          <input className="input" value={form.invoicePrefix||''} onChange={e=>setField('invoicePrefix', e.target.value)} />
        </div>
        {msg && <p className="text-green-600">{msg}</p>}
        {error && <p className="text-red-600">{error}</p>}
        <div>
          <button className="btn btn-primary">Save</button>
        </div>
      </form>
    </div>
  )
}


