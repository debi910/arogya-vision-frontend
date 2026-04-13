import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"

import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Register from "./pages/Register"

import AppLayout from "./layouts/AppLayout"
import AdminLayout from "./layouts/AdminLayout"

// App (Doctor / Receptionist)
import Dashboard from "./pages/Dashboard"
import Appointments from "./pages/Appointments"
import Consultation from "./pages/Consultation"
import PatientHistory from "./pages/PatientHistory"
import SearchPatients from "./pages/SearchPatients"
import PrescriptionManagement from "./pages/PrescriptionManagement"
import AppointmentStatus from "./pages/AppointmentStatus"

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
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" />} />
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
        <Route path="appointments/status" element={<AppointmentStatus />} />
        <Route path="consultation" element={<Consultation />} />
        <Route path="patients/search" element={<SearchPatients />} />
        <Route path="patient/:patientId/history" element={<PatientHistory />} />
        <Route path="prescriptions" element={<PrescriptionManagement />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
