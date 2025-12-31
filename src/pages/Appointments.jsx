import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import { useAuth } from "../context/AuthContext"

export default function Appointments() {
  const { role } = useAuth()
  const navigate = useNavigate()

  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  // receptionist modal
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    patient_id: "",
    doctor_id: "",
    appointment_date: "",
    appointment_time: "",
    notes: ""
  })

  // ================= LOAD APPOINTMENTS FAST =================
  useEffect(() => {
    let active = true

    async function loadAppointments() {
      try {
        setLoading(true)

        // 1️⃣ Load appointments FIRST (critical)
        const res = await api.get("/appointments")
        let list = res.data.appointments || []

        // 2️⃣ Doctor → show only today's appointments
        if (role === "doctor") {
          const today = new Date().toISOString().split("T")[0]
          list = list.filter(a => a.appointment_date === today)
        }

        if (active) {
          setAppointments(list)
          setLoading(false) // stop loading immediately
        }

        // 3️⃣ Load extra data later (non-blocking)
        if (role === "receptionist") {
          const [pRes, dRes] = await Promise.all([
            api.get("/patients"),
            api.get("/doctors")
          ])
          if (active) {
            setPatients(pRes.data.patients || [])
            setDoctors(dRes.data.doctors || [])
          }
        }

      } catch (err) {
        console.error("Failed to load appointments", err)
        if (active) setLoading(false)
      }
    }

    loadAppointments()
    return () => { active = false }
  }, [role])

  // ================= BOOK APPOINTMENT =================
  async function handleSubmit(e) {
    e.preventDefault()

    try {
      await api.post("/appointments", form)

      setShowModal(false)
      setForm({
        patient_id: "",
        doctor_id: "",
        appointment_date: "",
        appointment_time: "",
        notes: ""
      })

      // 🔁 RELOAD APPOINTMENTS AFTER SAVE
      const res = await api.get("/appointments")
      let list = res.data.appointments || []

      if (role === "doctor") {
        const today = new Date().toISOString().split("T")[0]
        list = list.filter(a => a.appointment_date === today)
      }

      setAppointments(list)

    } catch {
      alert("Failed to book appointment")
    }
  }

  // ================= RENDER =================
  if (loading) {
    return (
      <p className="text-sm text-slate-500">
        Loading appointments…
      </p>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          {role === "doctor" ? "Today's Appointments" : "Appointments"}
        </h1>

        {role === "receptionist" && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-teal-600 text-white px-4 py-2 rounded text-sm"
          >
            Book Appointment
          </button>
        )}
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Patient</th>
              <th className="px-4 py-3 text-left">Doctor</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Time</th>
              {role === "doctor" && (
                <th className="px-4 py-3 text-left">Action</th>
              )}
            </tr>
          </thead>

          <tbody>
            {appointments.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-slate-500">
                  No appointments found
                </td>
              </tr>
            )}

            {appointments.map(a => (
              <tr key={a.id} className="border-b">
                <td className="px-4 py-3">
                  {a.patient ? a.patient.full_name : "—"}
                </td>
                <td className="px-4 py-3">
                  {a.doctor ? a.doctor.full_name : "—"}
                </td>
                <td className="px-4 py-3">{a.appointment_date}</td>
                <td className="px-4 py-3">{a.appointment_time}</td>

                {role === "doctor" && (
                  <td className="px-4 py-3">
                    <button
                      onClick={() => navigate(`/consultation/${a.id}`)}
                      className="bg-teal-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Consult
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* BOOK APPOINTMENT MODAL */}
      {showModal && role === "receptionist" && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4">
            <h2 className="font-semibold">Book Appointment</h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <select
                required
                className="w-full border rounded px-3 py-2"
                onChange={e => setForm({ ...form, patient_id: e.target.value })}
              >
                <option value="">Select Patient</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.full_name}</option>
                ))}
              </select>

              <select
                required
                className="w-full border rounded px-3 py-2"
                onChange={e => setForm({ ...form, doctor_id: e.target.value })}
              >
                <option value="">Select Doctor</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>{d.full_name}</option>
                ))}
              </select>

              <input
                required
                type="date"
                className="w-full border rounded px-3 py-2"
                onChange={e =>
                  setForm({ ...form, appointment_date: e.target.value })
                }
              />

              <input
                required
                type="time"
                className="w-full border rounded px-3 py-2"
                onChange={e =>
                  setForm({ ...form, appointment_time: e.target.value })
                }
              />

              <button className="bg-teal-600 text-white px-4 py-2 rounded text-sm w-full">
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
