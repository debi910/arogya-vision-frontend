import { useState, useEffect } from "react"
import axios from "axios"
import { Search, Loader, AlertCircle, Eye } from "lucide-react"
import { useNavigate } from "react-router-dom"

const SearchPatients = () => {
  const navigate = useNavigate()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (search.length > 0) {
      fetchPatients()
    }
  }, [search, page])

  const fetchPatients = async () => {
    try {
      setLoading(true)
      const response = await axios.get("/patients", {
        params: {
          search: search,
          page: page,
          limit: 10
        }
      })
      setPatients(response.data.patients)
      setTotalPages(response.data.pagination.pages)
      setTotal(response.data.pagination.total)
    } catch (err) {
      setError(err.response?.data?.error || "Failed to search patients")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSearch("")
    setPage(1)
    setPatients([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Search Patients</h1>

        {/* Search Box */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                placeholder="Search by patient name or phone number..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
            </div>
            {search && (
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold transition"
              >
                Clear
              </button>
            )}
          </div>
          {search && <p className="text-sm text-gray-600 mt-2">Found {total} patient(s)</p>}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-600 mt-0.5" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {/* Results */}
        {!search && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">Enter a name or phone number to search for patients</p>
          </div>
        )}

        {search && loading && (
          <div className="flex items-center justify-center h-40">
            <Loader className="animate-spin text-blue-600" size={40} />
          </div>
        )}

        {search && !loading && patients.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No patients found</p>
          </div>
        )}

        {search && !loading && patients.length > 0 && (
          <>
            <div className="grid gap-4 mb-6">
              {patients.map(patient => (
                <div key={patient.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{patient.full_name}</h3>
                      <div className="grid grid-cols-4 gap-4 mt-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-700">Age</p>
                          <p className="text-sm text-gray-600">{patient.age} years</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700">Gender</p>
                          <p className="text-sm text-gray-600">{patient.gender}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700">Phone</p>
                          <p className="text-sm text-gray-600">{patient.phone || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700">Registered</p>
                          <p className="text-sm text-gray-600">{new Date(patient.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/patient/${patient.id}/history`)}
                      className="ml-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                    >
                      <Eye size={18} /> View History
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
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
          </>
        )}
      </div>
    </div>
  )
}

export default SearchPatients
