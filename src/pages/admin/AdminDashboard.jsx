import { useEffect, useState } from "react"
import api from "../../services/api"

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)

  const [tenant, setTenant] = useState(null)
  const [stats, setStats] = useState(null)
  const [recentUsers, setRecentUsers] = useState([])

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    try {
      const [tenantRes, statsRes, usersRes] = await Promise.all([
        api.get("/tenant/profile"),
        api.get("/analytics/overview"),
        api.get("/admin/users"),
      ])

      setTenant(tenantRes.data?.tenant || null)
      setStats(statsRes.data || null)
      setRecentUsers(usersRes.data?.users || [])
    } catch (err) {
      console.error("Admin dashboard load failed", err)
      setStats(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <p className="text-slate-500">Loading dashboard…</p>
  }

  // 🛡️ HARD SAFETY — NEVER WHITE SCREEN
  if (!stats || !stats.today || !stats.totals) {
    return (
      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-lg font-semibold">Dashboard Unavailable</h2>
        <p className="text-sm text-slate-600">
          Analytics data could not be loaded. Please refresh.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">
          {tenant?.name || "Clinic Dashboard"}
        </h1>
        <p className="text-slate-600 text-sm">
          Daily overview & system control
        </p>
      </div>

      {/* Today Overview */}
      <div className="grid grid-cols-3 gap-6">
        <StatCard title="Patients Added Today" value={stats.today.patients} />
        <StatCard title="Appointments Today" value={stats.today.appointments} />
        <StatCard title="Total Users" value={stats.totals.users} />
      </div>

      {/* System Snapshot */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border rounded-xl p-6">
          <h3 className="font-medium mb-2">System Snapshot</h3>
          <p className="text-sm text-slate-600">
            Doctors: <b>{stats.totals.doctors}</b>
          </p>
          <p className="text-sm text-slate-600">
            Receptionists: <b>{stats.totals.receptionists}</b>
          </p>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <h3 className="font-medium mb-2">Quick Actions</h3>
          <p className="text-sm text-slate-600 mb-3">
            Manage your clinic staff
          </p>
          <a
            href="/admin/users"
            className="inline-block bg-teal-700 text-white px-4 py-2 rounded text-sm"
          >
            Add User
          </a>
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-white border rounded-xl p-6">
        <h3 className="font-medium mb-4">Recently Added Users</h3>

        {recentUsers.slice(0, 5).map(u => (
          <div
            key={u.id}
            className="flex justify-between text-sm py-2 border-b last:border-0"
          >
            <span>{u.full_name}</span>
            <span className="capitalize text-slate-500">{u.role}</span>
          </div>
        ))}

        {recentUsers.length === 0 && (
          <p className="text-sm text-slate-500">No users created yet</p>
        )}
      </div>
    </div>
  )
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white border rounded-xl p-6">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-3xl font-semibold mt-2">{value}</p>
    </div>
  )
}
