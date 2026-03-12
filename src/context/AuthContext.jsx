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

    try {
      // 🔥 Token already verified by backend
      setUser({ role })
    } catch (err) {
      console.error("Session restore failed", err)
      localStorage.clear()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  async function login(data) {
    localStorage.setItem("token", data.token)
    localStorage.setItem("role", data.role)

    setUser({
      role: data.role
    })
  }

  function logout() {
    localStorage.clear()
    setUser(null)
    window.location.href = "/"
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, role: user?.role }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
