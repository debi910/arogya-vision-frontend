import { NavLink, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function AdminLayout() {
  const { logout } = useAuth()

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b">
          <img
            src="/logo.png"
            alt="Arogya Vision"
            className="h-8 w-auto mr-2"
          />
          <span className="text-lg font-semibold">
            Arogya Vision
          </span>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-4 space-y-1 text-sm">
          <NavLink to="/admin" className="nav-item">
            Dashboard
          </NavLink>

          <NavLink to="/admin/users" className="nav-item">
            Users
          </NavLink>

          <NavLink to="/admin/analytics" className="nav-item">
            Analytics
          </NavLink>

          <NavLink to="/admin/settings" className="nav-item">
            Settings
          </NavLink>

          <div className="mt-8 pt-4 border-t">
            <button
              onClick={logout}
              className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded text-sm"
            >
              Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b flex items-center px-6">
          <h1 className="font-medium">Admin Panel</h1>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          {/* 👇 THIS IS THE KEY */}
          <Outlet />
        </main>
      </div>
    </div>
  )
}
