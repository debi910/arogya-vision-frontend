import { createContext, useContext, useEffect, useState } from "react"
import api from "../services/api"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    restoreSession()
  }, [])

  async function restoreSession() {
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("role")

    if (!token || !role) {
      setLoading(false)
      return
    }

    // token already verified by backend middleware
    setUser({ role })
    setLoading(false)
  }

  // 🔥 SINGLE SOURCE OF LOGIN
  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password })

    localStorage.setItem("token", res.data.token)
    localStorage.setItem("role", res.data.role)

    setUser({
      role: res.data.role,
    })

    return res.data.role
  }

  function logout() {
    localStorage.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

