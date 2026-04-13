import { NavLink, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { BarChart3, Users, Calendar, FileText, Search, Pill, ClipboardList } from "lucide-react"

export default function AppLayout() {
  const { role, logout } = useAuth()

  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-600 to-indigo-600 border-r">
        <div className="h-16 flex items-center px-6 border-b border-blue-500">
          <img src="/logo.png" alt="Arogya Vision" className="h-8 mr-2" />
          <span className="text-lg font-semibold text-white">Arogya Vision</span>
        </div>

        <nav className="px-4 py-6 space-y-2 text-sm">
          <NavItem to="/" icon={<BarChart3 size={18} />} label="Dashboard" />
          
          {/* Common Features */}
          <div className="mt-6 mb-2">
            <p className="px-4 py-2 text-xs font-semibold text-blue-100 uppercase tracking-wider">Patient Management</p>
          </div>
          <NavItem to="/patients/search" icon={<Search size={18} />} label="Search Patients" />
          <NavItem to="/prescriptions" icon={<Pill size={18} />} label="Prescriptions" />

          {role === "doctor" && (
            <>
              <div className="mt-6 mb-2">
                <p className="px-4 py-2 text-xs font-semibold text-blue-100 uppercase tracking-wider">Doctor Features</p>
              </div>
              <NavItem to="/appointments" icon={<Calendar size={18} />} label="Appointments" />
              <NavItem to="/appointments/status" icon={<ClipboardList size={18} />} label="Appointment Status" />
              <NavItem to="/consultation" icon={<FileText size={18} />} label="Consultation" />
            </>
          )}

          {role === "receptionist" && (
            <>
              <div className="mt-6 mb-2">
                <p className="px-4 py-2 text-xs font-semibold text-blue-100 uppercase tracking-wider">Receptionist Features</p>
              </div>
              <NavItem to="/appointments" icon={<Calendar size={18} />} label="Appointments" />
              <NavItem to="/appointments/status" icon={<ClipboardList size={18} />} label="Appointment Status" />
            </>
          )}

          <div className="mt-8 pt-4 border-t border-blue-400">
            <button
              onClick={logout}
              className="w-full text-left px-4 py-2 text-red-100 hover:bg-red-500/20 hover:text-red-50 rounded text-sm font-medium transition"
            >
              Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b flex justify-between items-center px-6 shadow-sm">
          <span className="text-sm font-semibold text-slate-600 capitalize">
            Welcome, {role}
          </span>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
          isActive
            ? "bg-white/20 text-white shadow-sm"
            : "text-blue-100 hover:bg-white/10"
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  )
}
