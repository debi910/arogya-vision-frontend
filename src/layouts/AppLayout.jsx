import { NavLink, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function AppLayout() {
  const { role, setRole } = useAuth()

  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        <div className="h-16 flex items-center px-6 border-b">
          <img src="/logo.png" alt="Arogya Vision" className="h-8 mr-2" />
          <span className="text-lg font-semibold">Arogya Vision</span>
        </div>

        <nav className="px-4 py-6 space-y-1 text-sm">
          <NavItem to="/" label="Dashboard" />

          {role === "doctor" && (
            <>
              <NavItem to="/appointments" label="Appointments" />
              <NavItem to="/consultation" label="Consultation" />
            </>
          )}

          {role === "receptionist" && (
            <>
              <NavItem to="/patients" label="Patients" />
              <NavItem to="/appointments" label="Appointments" />
            </>
          )}
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b flex justify-end items-center px-6">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="doctor">Doctor</option>
            <option value="receptionist">Receptionist</option>
          </select>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-4 py-2 rounded-lg font-medium ${
          isActive
            ? "bg-teal-600 text-white"
            : "text-slate-700 hover:bg-slate-100"
        }`
      }
    >
      {label}
    </NavLink>
  )
}
