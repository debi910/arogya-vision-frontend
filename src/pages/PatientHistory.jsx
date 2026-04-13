import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { AlertCircle, Loader, CheckCircle2, Clock, Pill, Stethoscope } from "lucide-react"

const PatientHistory = () => {
  const { patientId } = useParams()
  const [history, setHistory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`/patients/${patientId}/history`)
        setHistory(response.data.history)
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch patient history")
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [patientId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loader className="animate-spin text-blue-600" size={40} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
        <AlertCircle className="text-red-600 mt-0.5" />
        <span className="text-red-800">{error}</span>
      </div>
    )
  }

  if (!history) return <div className="p-6">Patient not found</div>

  const { patient, appointments, consultations, prescriptions, vitalSigns, statistics } = history

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      attended: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      "no-show": "bg-gray-100 text-gray-800"
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Patient Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{patient.full_name}</h1>
              <p className="text-gray-600 mt-2">
                <span className="font-semibold">Age:</span> {patient.age} | 
                <span className="font-semibold ml-4">Gender:</span> {patient.gender} | 
                <span className="font-semibold ml-4">Phone:</span> {patient.phone || "N/A"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded">
                <div className="text-2xl font-bold text-blue-600">{statistics.totalAppointments}</div>
                <div className="text-sm text-gray-600">Appointments</div>
              </div>
              <div className="bg-indigo-50 p-3 rounded">
                <div className="text-2xl font-bold text-indigo-600">{statistics.totalConsultations}</div>
                <div className="text-sm text-gray-600">Consultations</div>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <div className="text-2xl font-bold text-purple-600">{statistics.activePrescriptions}</div>
                <div className="text-sm text-gray-600">Active Prescriptions</div>
              </div>
              <div className="bg-pink-50 p-3 rounded">
                <div className="text-sm font-semibold text-pink-600">
                  Last Visit: {statistics.lastVisit ? new Date(statistics.lastVisit).toLocaleDateString() : "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-lg p-2 shadow-sm">
          {["overview", "appointments", "consultations", "prescriptions", "vitals"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded font-semibold transition ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Overview */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-3 gap-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <Clock size={18} /> Recent Appointment
                </h3>
                {appointments.length > 0 ? (
                  <div className="mt-2 text-sm text-gray-600">
                    <p className="font-semibold">{appointments[0].doctor.full_name}</p>
                    <p>{new Date(appointments[0].appointment_date).toLocaleDateString()}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mt-2">No appointments yet</p>
                )}
              </div>
              <div className="border-l-4 border-indigo-500 pl-4">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <Stethoscope size={18} /> Latest Consultation
                </h3>
                {consultations.length > 0 ? (
                  <div className="mt-2 text-sm text-gray-600">
                    <p className="font-semibold">{consultations[0].doctor.full_name}</p>
                    <p>{new Date(consultations[0].created_at).toLocaleDateString()}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mt-2">No consultations yet</p>
                )}
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <Pill size={18} /> Active Medications
                </h3>
                <p className="text-sm text-gray-600 mt-2">{statistics.activePrescriptions} active prescriptions</p>
              </div>
            </div>
          )}

          {/* Appointments */}
          {activeTab === "appointments" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Appointment History</h3>
              {appointments.length > 0 ? (
                appointments.map(apt => (
                  <div key={apt.id} className="flex justify-between items-start p-4 border border-gray-200 rounded hover:bg-gray-50">
                    <div>
                      <p className="font-semibold text-gray-900">{apt.doctor.full_name}</p>
                      <p className="text-sm text-gray-600">{new Date(apt.appointment_date).toLocaleDateString()} at {apt.appointment_time}</p>
                      {apt.notes && <p className="text-sm text-gray-700 mt-2">{apt.notes}</p>}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(apt.status)}`}>
                      {apt.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No appointments found</p>
              )}
            </div>
          )}

          {/* Consultations */}
          {activeTab === "consultations" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Consultation History</h3>
              {consultations.length > 0 ? (
                consultations.map(cons => (
                  <div key={cons.id} className="border border-gray-200 rounded p-4 hover:bg-gray-50">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{cons.doctor.full_name}</p>
                        <p className="text-sm text-gray-600">{new Date(cons.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-semibold text-gray-700">Diagnosis</p>
                        <p className="text-gray-600">{cons.diagnosis || "Not recorded"}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-700">Treatment Plan</p>
                        <p className="text-gray-600">{cons.treatment_plan || "Not recorded"}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No consultations found</p>
              )}
            </div>
          )}

          {/* Prescriptions */}
          {activeTab === "prescriptions" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Prescription History</h3>
              {prescriptions.length > 0 ? (
                prescriptions.map(rx => (
                  <div key={rx.id} className="border border-gray-200 rounded p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-900 text-lg">{rx.medicine_name}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-semibold">Dosage:</span> {rx.dosage} | 
                          <span className="font-semibold ml-2">Frequency:</span> {rx.frequency}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Duration:</span> {rx.duration}
                        </p>
                        {rx.instructions && <p className="text-sm text-gray-700 mt-2 italic">📝 {rx.instructions}</p>}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                        rx.completed_at ? "bg-gray-200 text-gray-700" : "bg-green-100 text-green-700"
                      }`}>
                        {rx.completed_at ? "Completed" : "Active"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No prescriptions found</p>
              )}
            </div>
          )}

          {/* Vital Signs */}
          {activeTab === "vitals" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Vital Signs Records</h3>
              {vitalSigns.length > 0 ? (
                vitalSigns.map(vital => (
                  <div key={vital.id} className="grid grid-cols-4 gap-4 p-4 border border-gray-200 rounded bg-gradient-to-r from-green-50 to-emerald-50">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Date</p>
                      <p className="text-sm text-gray-600">{new Date(vital.recorded_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">BP</p>
                      <p className="text-lg font-bold text-gray-900">{vital.blood_pressure || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">HR</p>
                      <p className="text-lg font-bold text-gray-900">{vital.heart_rate || "N/A"} bpm</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Temp</p>
                      <p className="text-lg font-bold text-gray-900">{vital.temperature || "N/A"}°C</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No vital signs recorded yet</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PatientHistory
