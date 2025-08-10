import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/auth'
import clsx from 'classnames'


function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          'px-3 py-2 rounded-lg text-sm font-medium transition-colors text-white drop-shadow',
          isActive
            ? 'bg-white/20' // subtle highlight for active
            : 'hover:bg-white/10'
        )
      }
    >
      {children}
    </NavLink>
  );
}


export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const onLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-brand-50 via-brand-100 to-accent-50 font-sans">
      <nav className="bg-gradient-to-r from-brand-500 via-brand-600 to-brand-800 shadow-md">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-2xl font-bold tracking-tight text-white drop-shadow">InvoicePro</Link>
              <div className="hidden md:flex items-center gap-1">
                <NavItem to="/">Dashboard</NavItem>
                <NavItem to="/customers">Customers</NavItem>
                <NavItem to="/products">Products</NavItem>
                <NavItem to="/invoices">Invoices</NavItem>
                <NavItem to="/invoices/new">Create</NavItem>
                <NavItem to="/settings">Settings</NavItem>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-white font-medium drop-shadow">
                {user?.companyName || user?.email}
              </span>
              <button className="btn btn-primary" onClick={onLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl p-4 sm:p-8 lg:p-12">
        <Outlet />
      </main>
    </div>
  );
}


