import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '@/hooks/useAdminAuth'

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/curate/dashboard' },
  { label: 'Topics', to: '/curate/topics' },
  { label: 'Courses', to: '/curate/courses' },
  { label: 'Professors', to: '/curate/professors' },
  { label: 'Clubs', to: '/curate/clubs' },
]

export function AdminLayout() {
  const { isAuthenticated, isVerifying, user, logout } = useAdminAuth()
  const navigate = useNavigate()

  if (isVerifying) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <p className="text-sm text-dim-grey">Verifying session…</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/curate/login" replace />
  }

  const handleLogout = () => {
    logout()
    navigate('/curate/login', { replace: true })
  }

  return (
    <div className="flex min-h-svh bg-background">
      {/* Sidebar */}
      <aside className="flex w-56 shrink-0 flex-col border-r border-white/10 bg-background">
        <div className="flex h-14 items-center border-b border-white/10 px-4">
          <span className="text-xs font-bold tracking-widest text-carmine">CURATE</span>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 px-2 py-3">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-carmine/15 font-semibold text-carmine'
                    : 'text-dim-grey hover:bg-graphite hover:text-alabaster'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/10 px-4 py-4">
          <p className="mb-2 truncate text-xs text-dim-grey">{user?.name}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="text-xs text-dim-grey transition-colors hover:text-carmine"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex flex-1 flex-col overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
