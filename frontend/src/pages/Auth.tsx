import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApi } from '../lib/api'
import { useAuth } from '../state/auth'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const api = useApi()
  const { login } = useAuth()
  const navigate = useNavigate()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      if (mode === 'signup') {
        await api.signup({ email, password, companyName })
      }
      const res = await api.login({ email, password })
      if (res?.token && res?.user) {
        login(res.token, res.user)
        navigate('/')
      }
    } catch (err: any) {
      setError(err.message || 'Failed')
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-6 bg-gradient-to-br from-brand-950 to-brand-900">
      <div className="w-full max-w-md card p-5 sm:p-6">
        <h1 className="text-2xl font-semibold text-center mb-1">Welcome to InvoicePro</h1>
        <p className="text-center text-brand-200 mb-6">Sign in or create an account to continue</p>

        <div className="flex gap-2 mb-6">
          <button className={`btn flex-1 ${mode==='login'?'btn-primary':'btn-secondary'}`} onClick={() => setMode('login')}>Login</button>
          <button className={`btn flex-1 ${mode==='signup'?'btn-primary':'btn-secondary'}`} onClick={() => setMode('signup')}>Signup</button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium mb-1">Company</label>
              <input className="input" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Your company" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" className="input" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" className="input" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button className="btn btn-primary w-full mt-2" type="submit">{mode==='login'?'Sign in':'Create account'}</button>
        </form>
      </div>
    </div>
  )
}



