import { useEffect, useState } from "react"
import api from "../../services/api"

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    consultations: 0,
    todayAppointments: 0,
  })

  useEffect(() => {
    loadAnalytics()
  }, [])

  async function loadAnalytics() {
    try {
      const [pRes, dRes, cRes, aRes] = await Promise.all([
        api.get("/patients"),
        api.get("/doctors"),
        api.get("/consultations"),
        api.get("/appointments"),
      ])

      const today = new Date().toISOString().split("T")[0]

      const todayCount = (aRes.data.appointments || []).filter(a => {
        if (!a.appointment_date) return false
        const d = new Date(a.appointment_date).toISOString().split("T")[0]
        return d === today
      }).length

      setStats({
        patients: pRes.data.patients?.length || 0,
        doctors: dRes.data.doctors?.length || 0,
        consultations: cRes.data.consultations?.length || 0,
        todayAppointments: todayCount,
      })
    } catch (err) {
      console.error("Analytics load failed", err)
      alert("Failed to load analytics")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <p className="text-slate-500">Loading analytics…</p>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Analytics</h1>

      <div className="grid grid-cols-4 gap-6">

        <StatCard
          title="Patients"
          value={stats.patients}
        />

        <StatCard
          title="Doctors"
          value={stats.doctors}
        />

        <StatCard
          title="Consultations"
          value={stats.consultations}
        />

        <StatCard
          title="Today's Appointments"
          value={stats.todayAppointments}
        />

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

