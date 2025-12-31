import { NavLink } from "react-router-dom"
import { roleConfig } from "../config/roleConfig"
import { useRole } from "../context/RoleContext"

export default function Sidebar() {
  const { role } = useRole()
  const items = roleConfig[role].sidebar

  return (
    <aside className="w-64 bg-white border-r h-screen p-6 space-y-6">
      <div className="text-xl font-semibold text-primary">
        Arogya Vision
      </div>

      <nav className="space-y-2">
        {items.includes("dashboard") && (
          <NavItem to="/" label="Dashboard" />
        )}

        {items.includes("patients") && (
          <NavItem to="/patients" label="Patients" />
        )}

        {items.includes("consultation") && (
          <NavItem to="/consultation" label="Consultation" />
        )}

        {items.includes("appointments") && (
          <NavItem to="/appointments" label="Appointments" />
        )}

        {items.includes("doctors") && (
          <NavItem to="/doctors" label="Doctors" />
        )}
      </nav>
    </aside>
  )
}

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-4 py-2 rounded-lg text-sm font-medium transition ${
          isActive
            ? "bg-primary text-white"
            : "text-slate-700 hover:bg-slate-100"
        }`
      }
    >
      {label}
    </NavLink>
  )
}
