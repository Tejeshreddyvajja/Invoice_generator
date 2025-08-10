import { Navigate, Route, Routes } from 'react-router-dom'
import AuthPage from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import Products from './pages/Products'
import Invoices from './pages/Invoices'
import CreateInvoice from './pages/CreateInvoice'
import Settings from './pages/Settings'
import Layout from './components/Layout'
import { AuthProvider, useAuth } from './state/auth'

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/auth" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="customers" element={<PrivateRoute><Customers /></PrivateRoute>} />
          <Route path="products" element={<PrivateRoute><Products /></PrivateRoute>} />
          <Route path="invoices" element={<PrivateRoute><Invoices /></PrivateRoute>} />
          <Route path="invoices/new" element={<PrivateRoute><CreateInvoice /></PrivateRoute>} />
          <Route path="settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}


