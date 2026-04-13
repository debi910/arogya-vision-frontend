import { useState, useEffect } from "react"
import axios from "axios"
import { AlertCircle, Loader, Plus, Edit2, Trash2 } from "lucide-react"

const PrescriptionManagement = () => {
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [formData, setFormData] = useState({
    patient_id: "",
    doctor_id: "",
    medicine_name: "",
    dosage: "",
    frequency: "Once daily",
    duration: "7 days",
    instructions: ""
  })

  useEffect(() => {
    fetchData()
  }, [page])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [prescRes, patRes, docRes] = await Promise.all([
        axios.get(`/prescriptions?page=${page}&limit=10`),
        axios.get("/patients"),
        axios.get("/doctors")
      ])
      setPrescriptions(prescRes.data.prescriptions)
      setPatients(patRes.data.patients)
      setDoctors(docRes.data.doctors)
      setTotalPages(prescRes.data.pagination.pages)
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch prescriptions")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await axios.patch(`/prescriptions/${editingId}`, formData)
      } else {
        await axios.post("/prescriptions", formData)
      }
      setShowForm(false)
      setEditingId(null)
      setFormData({
        patient_id: "",
        doctor_id: "",
        medicine_name: "",
        dosage: "",
        frequency: "Once daily",
        duration: "7 days",
        instructions: ""
      })
      fetchData()
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save prescription")
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this prescription?")) return
    try {
      await axios.delete(`/prescriptions/${id}`)
      fetchData()
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete prescription")
    }
  }

  const handleEdit = (prescription) => {
    setFormData({
      patient_id: prescription.patient_id,
      doctor_id: prescription.doctor_id,
      medicine_name: prescription.medicine_name,
      dosage: prescription.dosage,
      frequency: prescription.frequency,
      duration: prescription.duration,
      instructions: prescription.instructions
    })
    setEditingId(prescription.id)
    setShowForm(true)
  }

  if (loading && prescriptions.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loader className="animate-spin text-blue-600" size={40} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Prescription Management</h1>
          <button
            onClick={() => {
              setShowForm(!showForm)
              setEditingId(null)
              setFormData({
                patient_id: "",
                doctor_id: "",
                medicine_name: "",
                dosage: "",
                frequency: "Once daily",
                duration: "7 days",
                instructions: ""
              })
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            <Plus size={20} /> New Prescription
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-600 mt-0.5" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">{editingId ? "Edit" : "New"} Prescription</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-2">Patient</label>
                <select
                  value={formData.patient_id}
                  onChange={(e) => setFormData({...formData, patient_id: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                >
                  <option value="">Select patient...</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.full_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">Doctor</label>
                <select
                  value={formData.doctor_id}
                  onChange={(e) => setFormData({...formData, doctor_id: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                >
                  <option value="">Select doctor...</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.full_name}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block font-semibold text-gray-700 mb-2">Medicine Name</label>
                <input
                  type="text"
                  value={formData.medicine_name}
                  onChange={(e) => setFormData({...formData, medicine_name: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                  placeholder="e.g., Amoxicillin"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">Dosage</label>
                <input
                  type="text"
                  value={formData.dosage}
                  onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="e.g., 500mg"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">Frequency</label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option>Once daily</option>
                  <option>Twice daily</option>
                  <option>Thrice daily</option>
                  <option>Every 4 hours</option>
                  <option>Every 6 hours</option>
                  <option>As needed</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="e.g., 7 days"
                />
              </div>

              <div className="col-span-2">
                <label className="block font-semibold text-gray-700 mb-2">Instructions</label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows="2"
                  placeholder="Special instructions..."
                />
              </div>

              <div className="col-span-2 flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  {editingId ? "Update" : "Create"} Prescription
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid gap-4">
          {prescriptions.map(prescription => (
            <div key={prescription.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{prescription.medicine_name}</h3>
                  <p className="text-gray-600 mt-1">
                    <span className="font-semibold">Patient:</span> {prescription.patient.full_name}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Doctor:</span> {prescription.doctor.full_name}
                  </p>
                  <div className="grid grid-cols-4 gap-4 mt-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Dosage</p>
                      <p className="text-sm text-gray-600">{prescription.dosage}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Frequency</p>
                      <p className="text-sm text-gray-600">{prescription.frequency}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Duration</p>
                      <p className="text-sm text-gray-600">{prescription.duration}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Created</p>
                      <p className="text-sm text-gray-600">{new Date(prescription.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(prescription)}
                    className="p-2 hover:bg-blue-100 rounded-lg text-blue-600"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(prescription.id)}
                    className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({length: totalPages}, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-4 py-2 rounded ${
                  page === p
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PrescriptionManagement
