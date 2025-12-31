import { useEffect, useState } from "react"
import api from "../services/api"
import Skeleton from "../components/Skeleton"

export default function Consultation() {
  const [loading, setLoading] = useState(true)

  // Tenant
  const [tenant, setTenant] = useState(null)

  // Dashboard
  const [todayAppointments, setTodayAppointments] = useState([])
  const [consultations, setConsultations] = useState([])
  const [search, setSearch] = useState("")

  // Modes
  const [appointment, setAppointment] = useState(null)
  const [viewConsultation, setViewConsultation] = useState(null)

  // Consultation form
  const [symptoms, setSymptoms] = useState("")
  const [notes, setNotes] = useState("")

  // AI
  const [aiLoading, setAiLoading] = useState(false)
  const [aiMedicines, setAiMedicines] = useState([])
  const [aiNotes, setAiNotes] = useState([])

  // Prescription
  const [prescription, setPrescription] = useState([])
  const [manualMed, setManualMed] = useState({
    name: "",
    dose: "",
    frequency: "",
    duration: ""
  })

  const [saving, setSaving] = useState(false)

  // ================= LOAD DASHBOARD =================
  useEffect(() => {
    async function load() {
      try {
        const [tenantRes, apptRes, consultRes] = await Promise.all([
          api.get("/tenant/profile"),
          api.get("/appointments"),
          api.get("/consultations"),
        ])

        setTenant(tenantRes.data.tenant)

        const today = new Date().toISOString().split("T")[0]
        const todays = (apptRes.data.appointments || []).filter(a => {
          if (!a.appointment_date) return false
          const d = new Date(a.appointment_date).toISOString().split("T")[0]
          return d === today
        })

        setTodayAppointments(todays)
        setConsultations(consultRes.data.consultations || [])

      } catch (err) {
        console.error("Consultation load failed", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // ================= AI =================
  async function getAiSuggestions() {
    if (!symptoms.trim()) return alert("Enter symptoms")

    setAiLoading(true)
    setAiMedicines([])
    setAiNotes([])

    try {
      const res = await api.post("/ai/suggest", { symptoms })
      const text = res.data.ai_response || ""

      const medLines = text.split("\n").filter(l => l.startsWith("-"))
      setAiMedicines(
        medLines.map(l => {
          const p = l.replace("-", "").split("|").map(x => x.trim())
          return {
            name: p[0] || "",
            dose: p[1] || "",
            frequency: p[2] || "",
            duration: p[3] || ""
          }
        })
      )

      setAiNotes(
        text.split("\n").filter(l => !l.startsWith("-") && l.trim())
      )
    } catch {
      alert("AI service failed")
    } finally {
      setAiLoading(false)
    }
  }

  // ================= PRESCRIPTION =================
  function addMedicine(m) {
    setPrescription(prev => [...prev, m])
  }

  function addManualMedicine() {
    if (!manualMed.name) return
    setPrescription(prev => [...prev, manualMed])
    setManualMed({ name: "", dose: "", frequency: "", duration: "" })
  }

  function removeMedicine(i) {
    setPrescription(prev => prev.filter((_, idx) => idx !== i))
  }

  // ================= SAVE =================
  async function saveConsultation() {
    if (!appointment) return alert("Select appointment")
    if (!prescription.length) return alert("Add medicines")

    setSaving(true)
    try {
      await api.post("/consultations", {
        appointment_id: appointment.id,
        patient_id: appointment.patient.id,
        doctor_id: appointment.doctor.id,
        symptoms,
        medicines: prescription,
        notes
      })

      alert("Consultation saved")

      setAppointment(null)
      setSymptoms("")
      setNotes("")
      setPrescription([])
      setAiMedicines([])
      setAiNotes([])

      const consultRes = await api.get("/consultations")
      setConsultations(consultRes.data.consultations || [])

    } catch {
      alert("Failed to save consultation")
    } finally {
      setSaving(false)
    }
  }

  // ================= SEARCH =================
  const filteredConsultations = consultations.filter(c => {
    const term = search.toLowerCase()
    return (
      (c.patient?.full_name || "").toLowerCase().includes(term) ||
      (c.notes || "").toLowerCase().includes(term) ||
      new Date(c.created_at).toLocaleDateString().includes(term)
    )
  })

  // ================= PRINT =================
  function printPrescription() {
    window.print()
  }

  // ================= RENDER =================
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-8">
        <Skeleton lines={6} />
        <Skeleton lines={10} />
        <Skeleton lines={10} />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-8 animate-fade-in">

      {/* LEFT PANEL */}
      <aside className="space-y-6">

        <div>
          <h2 className="font-semibold text-sm mb-2">Today’s Appointments</h2>
          {todayAppointments.length === 0 && (
            <p className="text-sm text-slate-500">No appointments today</p>
          )}
          {todayAppointments.map(a => (
            <button
              key={a.id}
              onClick={() => {
                setAppointment(a)
                setViewConsultation(null)
              }}
              className="w-full bg-white border rounded-lg p-3 text-left mb-2 hover:bg-slate-50 transition"
            >
              <p className="font-medium">{a.patient.full_name}</p>
              <p className="text-xs text-slate-500">
                {a.appointment_time} • {a.doctor.full_name}
              </p>
            </button>
          ))}
        </div>

        <div>
          <h2 className="font-semibold text-sm mb-2">Past Consultations</h2>
          <input
            placeholder="Search patient / date / notes"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border rounded px-2 py-1 text-sm mb-3"
          />

          {filteredConsultations.map(c => (
            <button
              key={c.id}
              onClick={() => {
                setViewConsultation(c)
                setAppointment(null)
              }}
              className="w-full bg-white border rounded p-3 mb-2 text-left hover:bg-slate-50 transition"
            >
              <p className="font-medium">{c.patient?.full_name}</p>
              <p className="text-xs text-slate-500">
                {new Date(c.created_at).toLocaleDateString()}
              </p>
              <p className="text-sm mt-1 line-clamp-2">{c.notes}</p>
            </button>
          ))}
        </div>
      </aside>

      {/* RIGHT PANEL */}
      <section className="col-span-2 space-y-6">

        {/* READ-ONLY VIEW + PRINT */}
        {viewConsultation && (
          <div className="print-area bg-white border rounded-xl p-6 space-y-4">

            {tenant && (
              <div className="text-center mb-4">
                <h2 className="text-lg font-semibold">{tenant.name}</h2>
                <p className="text-sm">{tenant.address}</p>
                <p className="text-sm">{tenant.phone}</p>
                <hr className="my-3" />
              </div>
            )}

            <h1 className="text-xl font-semibold">Consultation Summary</h1>

            <p><b>Patient:</b> {viewConsultation.patient?.full_name}</p>
            <p>
              <b>Date:</b>{" "}
              {new Date(viewConsultation.created_at).toLocaleDateString()}
            </p>

            <div>
              <h3 className="font-medium">Symptoms</h3>
              <p className="text-sm">{viewConsultation.symptoms || "—"}</p>
            </div>

            <div>
              <h3 className="font-medium">Prescription</h3>
              {viewConsultation.medicines?.map((m, i) => (
                <p key={i} className="text-sm">
                  • {m.name} — {m.dose}, {m.frequency}, {m.duration}
                </p>
              ))}
            </div>

            <div>
              <h3 className="font-medium">Doctor Notes</h3>
              <p className="text-sm">{viewConsultation.notes || "—"}</p>
            </div>

            <button
              onClick={printPrescription}
              className="mt-4 bg-teal-700 text-white px-4 py-2 rounded"
            >
              Print Prescription
            </button>
          </div>
        )}

        {/* ACTIVE CONSULTATION */}
        {appointment && (
          <div className="bg-white border rounded-lg p-6 space-y-4">
            <h1 className="text-xl font-semibold">New Consultation</h1>

            <p><b>Patient:</b> {appointment.patient.full_name}</p>

            <textarea
              placeholder="Symptoms"
              value={symptoms}
              onChange={e => setSymptoms(e.target.value)}
              className="w-full border rounded p-3"
              rows={3}
            />

            <button
              onClick={getAiSuggestions}
              className="bg-teal-600 text-white px-4 py-2 rounded"
            >
              {aiLoading ? "Analyzing…" : "Get AI Suggestions"}
            </button>

            {aiMedicines.map((m, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{m.name} — {m.dose}</span>
                <button onClick={() => addMedicine(m)} className="text-teal-600">
                  Add
                </button>
              </div>
            ))}

            {/* MANUAL MEDICINE */}
            <div className="grid grid-cols-4 gap-2">
              {["name", "dose", "frequency", "duration"].map(f => (
                <input
                  key={f}
                  placeholder={f}
                  value={manualMed[f]}
                  onChange={e =>
                    setManualMed({ ...manualMed, [f]: e.target.value })
                  }
                  className="border rounded px-2 py-1 text-sm"
                />
              ))}
            </div>

            <button
              onClick={addManualMedicine}
              className="text-teal-600 text-sm"
            >
              + Add Medicine
            </button>

            <h3 className="font-semibold mt-4">Prescription</h3>
            {prescription.map((m, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>
                  {m.name} — {m.dose}, {m.frequency}, {m.duration}
                </span>
                <button
                  onClick={() => removeMedicine(i)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}

            <textarea
              placeholder="Doctor notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full border rounded p-3"
              rows={3}
            />

            <button
              onClick={saveConsultation}
              disabled={saving}
              className="bg-teal-700 text-white px-6 py-2 rounded"
            >
              Save Consultation
            </button>
          </div>
        )}

        {!appointment && !viewConsultation && (
          <p className="text-slate-500">
            Select an appointment or past consultation
          </p>
        )}
      </section>
    </div>
  )
}
