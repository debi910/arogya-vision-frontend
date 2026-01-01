import axios from "axios"

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"

// 🔐 shared axios instance
const api = axios.create({
  baseURL: API_BASE,
})

// attach JWT
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export async function fetchPatients() {
  const res = await api.get("/patients")
  return res.data.patients
}

export async function createPatient(data) {
  const res = await api.post("/patients", data)
  return res.data.patient
}
