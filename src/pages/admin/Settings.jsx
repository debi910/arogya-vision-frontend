import { useEffect, useState } from "react"
import api from "../../services/api"

export default function AdminSettings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    prescription_footer: "",
  })

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      const res = await api.get("/tenant/profile")
      const t = res.data.tenant

      setForm({
        name: t.name || "",
        address: t.address || "",
        phone: t.phone || "",
        prescription_footer: t.settings?.footer || "",
      })
    } catch (err) {
      console.error("Failed to load settings", err)
    } finally {
      setLoading(false)
    }
  }

  async function saveSettings() {
    setSaving(true)
    try {
      await api.put("/tenant/profile", {
        name: form.name,
        address: form.address,
        phone: form.phone,
        settings: {
          footer: form.prescription_footer,
        },
      })

      alert("Settings updated successfully")
    } catch {
      alert("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p>Loading settings…</p>

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Clinic Settings</h1>

      <Section title="Clinic Profile">
        <Input label="Clinic Name" value={form.name}
          onChange={v => setForm({ ...form, name: v })} />
        <Input label="Address" value={form.address}
          onChange={v => setForm({ ...form, address: v })} />
        <Input label="Phone" value={form.phone}
          onChange={v => setForm({ ...form, phone: v })} />
      </Section>

      <Section title="Prescription Settings">
        <textarea
          placeholder="Prescription footer note"
          value={form.prescription_footer}
          onChange={e =>
            setForm({ ...form, prescription_footer: e.target.value })
          }
          className="w-full border rounded p-3 text-sm"
          rows={3}
        />
      </Section>

      <button
        onClick={saveSettings}
        disabled={saving}
        className="bg-teal-700 text-white px-6 py-2 rounded"
      >
        {saving ? "Saving…" : "Save Settings"}
      </button>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="bg-white border rounded-xl p-6 space-y-4">
      <h3 className="font-medium">{title}</h3>
      {children}
    </div>
  )
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm text-slate-600">{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border rounded px-3 py-2 text-sm"
      />
    </div>
  )
}
