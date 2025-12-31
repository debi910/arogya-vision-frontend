import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Dashboard() {
  const { role } = useAuth()

  return (
    <div className="space-y-8">
      {role === "doctor" && <DoctorDashboard />}
      {role === "receptionist" && <ReceptionDashboard />}
    </div>
  )
}

/* ================= DOCTOR DASHBOARD ================= */

function DoctorDashboard() {
  const navigate = useNavigate()

  return (
    <>
      <Header
        title="Doctor Dashboard"
        subtitle="Overview of today’s clinical activity"
      />

      <StatsGrid
        stats={[
          { label: "Today's Appointments", value: "12" },
          { label: "Patients Seen", value: "8" },
          { label: "Pending Consultations", value: "4" },
        ]}
      />

      <QuickActions
        actions={[
          {
            label: "Start Consultation",
            primary: true,
            onClick: () => navigate("/consultation"),
          },
          {
            label: "View Appointments",
            onClick: () => navigate("/appointments"),
          },
        ]}
      />
    </>
  )
}

/* ================= RECEPTION DASHBOARD ================= */

function ReceptionDashboard() {
  const navigate = useNavigate()

  return (
    <>
      <Header
        title="Reception Dashboard"
        subtitle="Patient and appointment management"
      />

      <StatsGrid
        stats={[
          { label: "Total Patients", value: "1,248" },
          { label: "Appointments Today", value: "18" },
          { label: "New Registrations", value: "6" },
        ]}
      />

      <QuickActions
        actions={[
          {
            label: "Add Patient",
            primary: true,
            onClick: () => navigate("/patients"),
          },
          {
            label: "Book Appointment",
            onClick: () => navigate("/appointments"),
          },
        ]}
      />
    </>
  )
}

/* ================= REUSABLE UI ================= */

function Header({ title, subtitle }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
    </div>
  )
}

function StatsGrid({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white rounded-xl border border-slate-200 p-4"
        >
          <p className="text-sm text-slate-500">{s.label}</p>
          <p className="text-2xl font-semibold text-slate-900 mt-1">
            {s.value}
          </p>
        </div>
      ))}
    </div>
  )
}

function QuickActions({ actions }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 max-w-md">
      <h2 className="font-medium text-slate-900">Quick Actions</h2>

      {actions.map((a) => (
        <button
          key={a.label}
          onClick={a.onClick}
          className={`w-full py-2 rounded-lg text-sm font-medium transition ${
            a.primary
              ? "bg-teal-600 text-white hover:opacity-90"
              : "border border-slate-300 text-slate-700 hover:bg-slate-50"
          }`}
        >
          {a.label}
        </button>
      ))}
    </div>
  )
}
