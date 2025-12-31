import { useEffect, useState } from "react"
import api from "../../services/api"

export default function AdminUsers() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])

  // Create user form
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "doctor",
  })

  const [creating, setCreating] = useState(false)

  // ================= LOAD USERS =================
  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    try {
      const res = await api.get("/admin/users")
      setUsers(res.data?.users || [])
    } catch (err) {
      console.error("Failed to load users", err)
      alert("Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  // ================= CREATE USER =================
  async function createUser(e) {
    e.preventDefault()

    if (!form.email || !form.password || !form.full_name) {
      return alert("All fields required")
    }

    setCreating(true)
    try {
      await api.post("/admin/users", form)
      alert("User created successfully")

      setForm({
        email: "",
        password: "",
        full_name: "",
        role: "doctor",
      })
      setShowForm(false)

      await loadUsers()
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.error || "Failed to create user")
    } finally {
      setCreating(false)
    }
  }

  // ================= UI =================
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Users</h1>

        <button
          onClick={() => setShowForm(true)}
          className="bg-teal-700 text-white px-4 py-2 rounded text-sm"
        >
          + Add User
        </button>
      </div>

      {/* Users Table */}
      {loading ? (
        <p className="text-slate-500">Loading users…</p>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Created</th>
              </tr>
            </thead>

            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-t">
                  <td className="p-3 font-medium">{u.full_name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 capitalize">
                    <span className="px-2 py-1 rounded bg-slate-100">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-slate-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE USER MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">

            <h2 className="text-lg font-semibold">Create User</h2>

            <form onSubmit={createUser} className="space-y-3">
              <input
                placeholder="Full name"
                value={form.full_name}
                onChange={e => setForm({ ...form, full_name: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm"
              />

              <input
                placeholder="Email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm"
              />

              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm"
              />

              <select
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option value="doctor">Doctor</option>
                <option value="receptionist">Receptionist</option>
                <option value="admin">Admin</option>
              </select>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="bg-teal-700 text-white px-4 py-2 rounded text-sm"
                >
                  {creating ? "Creating…" : "Create"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  )
}
