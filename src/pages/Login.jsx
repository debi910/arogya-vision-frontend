import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Heart, Mail, Lock, AlertCircle, Loader } from "lucide-react"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const role = await login(email, password)

      if (role === "admin") {
        navigate("/admin", { replace: true })
      } else {
        navigate("/", { replace: true })
      }

    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please check your email and password.")
      console.error("Login error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-8 py-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <Heart className="w-6 h-6 text-teal-600" />
            <span className="font-bold text-lg text-teal-600">Arogya Vision</span>
          </Link>
          <p className="text-slate-600">
            Don't have an account?
            <Link to="/register" className="text-teal-600 font-semibold ml-2 hover:underline">
              Register Now
            </Link>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-teal-600" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
              <p className="text-slate-600">Sign in to your healthcare account</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
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
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
                  />
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 disabled:bg-slate-400 transition-all flex items-center justify-center gap-2"
              >
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Demo Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900 font-medium mb-2">Demo Credentials:</p>
              <p className="text-xs text-blue-800">
                Email: <span className="font-mono">demo@clinic.com</span>
              </p>
              <p className="text-xs text-blue-800">
                Password: <span className="font-mono">password123</span>
              </p>
            </div>

            {/* Register Link */}
            <p className="text-center text-slate-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-teal-600 font-semibold hover:underline">
                Register here
              </Link>
            </p>

            {/* Back to Home */}
            <div className="text-center">
              <Link to="/" className="text-slate-500 hover:text-slate-700 text-sm underline">
                Return to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

