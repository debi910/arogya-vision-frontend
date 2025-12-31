import { useEffect, useState } from "react"
import api from "../services/api"

export default function PatientConsultations() {
  const [consultations, setConsultations] = useState([])
  const [loading, setLoading] = useState(true)

  // TEMP — later will come from route params
  const patientId = "04c0ef13-1ed5-418b-8f68-b6a851ac863f"

  useEffect(() => {
    async function fetchConsultations() {
      try {
        const res = await api.get(`/consultations/patient/${patientId}`)
        setConsultations(res.data.consultations || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchConsultations()
  }, [])

  if (loading) {
    return <p className="text-sm text-slate-500">Loading consultations…</p>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">
        Past Consultations
      </h1>

      {consultations.length === 0 && (
        <p className="text-sm text-slate-500">
          No consultations found for this patient.
        </p>
      )}

      {consultations.map((c) => (
        <div
          key={c.id}
          className="bg-white border rounded-xl p-4 space-y-3"
        >
          <div className="text-sm text-slate-500">
            {new Date(c.created_at).toLocaleString()}
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700">
              Doctor Notes
            </p>
            <p className="text-sm text-slate-900">
              {c.notes || "—"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700">
              Medicines Prescribed
            </p>
            <ul className="list-disc list-inside text-sm text-slate-900">
              {(c.medicines || []).map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}
