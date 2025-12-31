import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"

import Login from "./pages/Login"

import AppLayout from "./layouts/AppLayout"
import AdminLayout from "./layouts/AdminLayout"

// App (Doctor / Receptionist)
import Dashboard from "./pages/Dashboard"
import Appointments from "./pages/Appointments"
import Consultation from "./pages/Consultation"

// Admin (IMPORTANT: use ONLY admin folder)
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminUsers from "./pages/admin/Users"
import AdminAnalytics from "./pages/admin/Analytics"
import AdminSettings from "./pages/admin/Settings"

export default function App() {
  const { user, loading } = useAuth()

  if (loading) return null

  // ================= NOT LOGGED IN =================
  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    )
  }

  // ================= ADMIN ROUTES =================
  if (user.role === "admin") {
    return (
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<Navigate to="/admin" />} />
      </Routes>
    )
  }

  // ================= DOCTOR / RECEPTIONIST =================
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="consultation" element={<Consultation />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
