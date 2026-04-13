import { useState, useEffect } from "react"
import axios from "axios"
import { AlertCircle, Loader, CheckCircle2, Clock, X, Filter } from "lucide-react"

const AppointmentStatusManager = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filter, setFilter] = useState("") // pending, confirmed, attended, cancelled, no-show
  const [selectedApt, setSelectedApt] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)
  const [cancellationReason, setCancellationReason] = useState("")

  useEffect(() => {
    fetchAppointments()
  }, [page, filter])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await axios.get("/appointments", {
        params: {
          page: page,
          limit: 10,
          status: filter || undefined
        }
      })
      setAppointments(response.data.appointments)
      setTotalPages(response.data.pagination.pages)
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch appointments")
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (appointmentId, newStatus) => {
    try {
      setUpdatingId(appointmentId)
      const payload = {
        status: newStatus
      }
      if (newStatus === "cancelled" && cancellationReason) {
        payload.reason_for_cancellation = cancellationReason
      }
      await axios.patch(`/appointments/${appointmentId}/status`, payload)
      fetchAppointments()
      setSelectedApt(null)
      setCancellationReason("")
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update appointment")
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-900 border-yellow-300",
      confirmed: "bg-blue-100 text-blue-900 border-blue-300",
      attended: "bg-green-100 text-green-900 border-green-300",
      cancelled: "bg-red-100 text-red-900 border-red-300",
      "no-show": "bg-gray-100 text-gray-900 border-gray-300"
    }
    return colors[status] || "bg-gray-100 text-gray-900"
  }

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock size={16} />,
      confirmed: <CheckCircle2 size={16} />,
      attended: <CheckCircle2 size={16} />,
      cancelled: <X size={16} />
    }
    return icons[status] || null
  }

  if (loading && appointments.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loader className="animate-spin text-blue-600" size={40} />
      </div>
    )
  }

  const statusOptions = ["pending", "confirmed", "attended", "cancelled", "no-show"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Appointment Status Manager</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-600 mt-0.5" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={20} className="text-gray-600" />
            <span className="font-semibold text-gray-700">Filter by Status:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setFilter("")
                setPage(1)
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === ""
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {statusOptions.map(status => (
              <button
                key={status}
                onClick={() => {
                  setFilter(status)
                  setPage(1)
                }}
                className={`px-4 py-2 rounded-lg font-semibold transition capitalize ${
                  filter === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Appointments Grid */}
        <div className="grid gap-4">
          {appointments.map(apt => (
            <div key={apt.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{apt.patient.full_name}</h3>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Doctor:</span> {apt.doctor.full_name}
                  </p>
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(apt.status)}`}>
                  {getStatusIcon(apt.status)}
                  {apt.status}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                <div>
                  <p className="font-semibold text-gray-700">Date</p>
                  <p className="text-gray-600">{new Date(apt.appointment_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Time</p>
                  <p className="text-gray-600">{apt.appointment_time}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Notes</p>
                  <p className="text-gray-600">{apt.notes || "No notes"}</p>
                </div>
              </div>

              {apt.reason_for_cancellation && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm font-semibold text-red-800">Cancellation Reason:</p>
                  <p className="text-sm text-red-700">{apt.reason_for_cancellation}</p>
                </div>
              )}

              {selectedApt?.id === apt.id ? (
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-700 mb-3">Change Status To:</p>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {statusOptions.map(status => (
                      <button
                        key={status}
                        onClick={() => updateStatus(apt.id, status)}
                        disabled={updatingId === apt.id || status === apt.status}
                        className={`px-3 py-2 rounded text-sm font-semibold transition capitalize ${
                          status === apt.status
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                        }`}
                      >
                        {updatingId === apt.id ? <Loader className="animate-spin inline mr-1" size={14} /> : null}
                        {status}
                      </button>
                    ))}
                  </div>

                  {apt.status !== "cancelled" && (
                    <div className="mb-3">
                      <label className="block font-semibold text-gray-700 mb-2 text-sm">Cancellation Reason (if cancelling)</label>
                      <textarea
                        value={cancellationReason}
                        onChange={(e) => setCancellationReason(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        rows="2"
                        placeholder="Reason for cancellation..."
                      />
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedApt(null)}
                    className="px-3 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-sm font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedApt(apt)}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition"
                >
                  Update Status
                </button>
              )}
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

export default AppointmentStatusManager
