import { useEffect, useState } from "react"
import api from "../services/api"

export default function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDoctors()
  }, [])

  async function loadDoctors() {
    try {
      const res = await api.get("/doctors")
      setDoctors(res.data.doctors || [])
    } catch (err) {
      console.error("Failed to fetch doctors", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <p className="text-slate-500">Loading doctors…</p>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-slate-900">Doctors</h2>
      
      {doctors.length === 0 ? (
        <p className="text-slate-500">No doctors available</p>
      ) : (
        <div className="grid gap-4">
          {doctors.map(doctor => (
            <div key={doctor.id} className="bg-white border rounded-lg p-4">
              <h3 className="font-semibold text-slate-900">{doctor.full_name}</h3>
              <p className="text-sm text-slate-600">{doctor.specialization}</p>
              {doctor.phone && (
                <p className="text-sm text-slate-500 mt-1">{doctor.phone}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
