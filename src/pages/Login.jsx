import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

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
      setError("Invalid credentials")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl border w-80 space-y-4"
      >
        <h1 className="text-xl font-semibold text-center">
          Login
        </h1>

        {error && (
          <p className="text-red-500 text-sm text-center">
            {error}
          </p>
        )}

        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <button
          disabled={loading}
          className="w-full bg-teal-700 text-white py-2 rounded"
        >
          {loading ? "Signing in…" : "Login"}
        </button>
      </form>
    </div>
  )
}

