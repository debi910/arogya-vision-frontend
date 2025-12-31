import { useEffect, useState } from "react"
import api from "../services/api"

export default function AdminTenant() {
  const [tenant, setTenant] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTenant() {
      try {
        const res = await api.get("/tenant/profile")
        setTenant(res.data.tenant)
      } catch (err) {
        console.error("Failed to load tenant", err)
      } finally {
        setLoading(false)
      }
    }
    loadTenant()
  }, [])

  if (loading) {
    return <p className="text-sm text-slate-500">Loading clinic profile…</p>
  }

  if (!tenant) {
    return <p className="text-sm text-red-500">Clinic not found</p>
  }

  return (
    <div className="bg-white border rounded-xl p-6 space-y-3">
      <h2 className="text-lg font-semibold">
        Clinic Profile
      </h2>

      <p><b>Name:</b> {tenant.name}</p>
      <p><b>Phone:</b> {tenant.phone}</p>
      <p><b>Address:</b> {tenant.address}</p>
    </div>
  )
}
