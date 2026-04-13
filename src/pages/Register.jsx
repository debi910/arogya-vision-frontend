import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../services/api"
import { Heart, Mail, Lock, User, Stethoscope, AlertCircle, CheckCircle } from "lucide-react"

export default function Register() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // Step 1: Role selection, Step 2: Form

  const [role, setRole] = useState("")
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    clinic_name: ""
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")

    if (!form.email || !form.password || !form.full_name) {
      setError("All fields are required")
      return
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const response = await api.post("/auth/register", {
        email: form.email,
        password: form.password,
        full_name: form.full_name,
        role: role,
        clinic_id: null
      })

      if (response.data.token) {
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("role", response.data.role)
        setSuccess(true)
        
        setTimeout(() => {
          navigate(response.data.role === "admin" ? "/admin" : "/", { replace: true })
        }, 1500)
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed")
      console.error("Register error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-8 py-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <Heart className="w-6 h-6 text-teal-600" />
            <span className="font-bold text-lg text-teal-600">Arogya Vision</span>
          </Link>
          <p className="text-slate-600">
            Already have an account? 
            <Link to="/login" className="text-teal-600 font-semibold ml-2 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto py-12 px-4">
        {/* Step 1: Role Selection */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
              <p className="text-slate-600">Choose your role to get started</p>
            </div>

            <div className="space-y-4">
              {/* Doctor Option */}
              <button
                onClick={() => {
                  setRole("doctor")
                  setStep(2)
                }}
                className="w-full p-6 border-2 border-slate-200 rounded-xl hover:border-teal-500 hover:bg-teal-50 transition text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-200 transition">
                    <Stethoscope className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">I'm a Doctor</h3>
                    <p className="text-sm text-slate-600 mt-1">Manage consultations and patients</p>
                  </div>
                </div>
              </button>

              {/* Receptionist Option */}
              <button
                onClick={() => {
                  setRole("receptionist")
                  setStep(2)
                }}
                className="w-full p-6 border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">I'm a Receptionist</h3>
                    <p className="text-sm text-slate-600 mt-1">Manage appointments and patient intake</p>
                  </div>
                </div>
              </button>

              {/* Admin Option */}
              <button
                onClick={() => {
                  setRole("admin")
                  setStep(2)
                }}
                className="w-full p-6 border-2 border-slate-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition">
                    <Heart className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">I'm a Clinic Admin</h3>
                    <p className="text-sm text-slate-600 mt-1">Setup and manage your clinic</p>
                  </div>
                </div>
              </button>
            </div>

            <p className="text-center text-sm text-slate-600">
              By registering, you accept our Terms of Service and Privacy Policy
            </p>
          </div>
        )}

        {/* Step 2: Registration Form */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            {/* Success Message */}
            {success && (
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="font-semibold text-emerald-900">Account created!</p>
                  <p className="text-sm text-emerald-800">Redirecting to dashboard...</p>
                </div>
              </div>
            )}

            {!success && (
              <>
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-slate-900">
                    Register as {role === "doctor" ? "Doctor" : role === "receptionist" ? "Receptionist" : "Admin"}
                  </h1>
                  <button
                    onClick={() => setStep(1)}
                    className="text-slate-500 hover:text-slate-700 text-2xl"
                  >
                    ←
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Dr. John Doe"
                        value={form.full_name}
                        onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        placeholder="john@clinic.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <input
                        type="password"
                        placeholder="At least 6 characters"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <input
                        type="password"
                        placeholder="Confirm password"
                        value={form.confirmPassword}
                        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 disabled:bg-slate-400 transition-all"
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </button>
                </form>

                <p className="text-center text-sm text-slate-600">
                  Already have an account?{" "}
                  <Link to="/login" className="text-teal-600 font-semibold hover:underline">
                    Sign In
                  </Link>
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
