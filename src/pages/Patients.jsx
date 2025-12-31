import { useEffect, useState } from "react"
import api from "../services/api"
import { useAuth } from "../context/AuthContext"

export default function Patients() {
  const { role } = useAuth()

  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    full_name: "",
    age: "",
    gender: "Male",
    phone: ""
  })

  // Fetch patients
  async function fetchPatients() {
    try {
      const res = await api.get("/patients")
      setPatients(res.data.patients || [])
    } catch (err) {
      console.error("Failed to fetch patients", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  // Handle form submit
  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.full_name || !form.age || !form.phone) {
      alert("Please fill all required fields")
      return
    }

    try {
      await api.post("/patients", {
        full_name: form.full_name,
        age: Number(form.age),
        gender: form.gender,
        phone: form.phone
      })

      setShowModal(false)
      setForm({ full_name: "", age: "", gender: "Male", phone: "" })
      fetchPatients()
    } catch (err) {
      console.error("Failed to add patient", err)
      alert("Failed to add patient")
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-500">Loading patients…</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Patients</h1>

        {role === "receptionist" && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm hover:bg-teal-700"
          >
            Add Patient
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Age</th>
              <th className="text-left px-4 py-3">Gender</th>
              <th className="text-left px-4 py-3">Phone</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id} className="border-b last:border-none">
                <td className="px-4 py-3">{p.full_name}</td>
                <td className="px-4 py-3">{p.age}</td>
                <td className="px-4 py-3">{p.gender}</td>
                <td className="px-4 py-3">{p.phone}</td>
                <td className="px-4 py-3 text-teal-600 text-sm">
                  View History
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-semibold">Add Patient</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={form.full_name}
                onChange={(e) =>
                  setForm({ ...form, full_name: e.target.value })
                }
                className="w-full border rounded px-3 py-2 text-sm"
              />

              <input
                type="number"
                placeholder="Age"
                value={form.age}
                onChange={(e) =>
                  setForm({ ...form, age: e.target.value })
                }
                className="w-full border rounded px-3 py-2 text-sm"
              />

              <select
                value={form.gender}
                onChange={(e) =>
                  setForm({ ...form, gender: e.target.value })
                }
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>

              <input
                type="text"
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                className="w-full border rounded px-3 py-2 text-sm"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-teal-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
