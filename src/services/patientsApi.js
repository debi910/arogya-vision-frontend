import axios from "axios"

const API_BASE = "http://localhost:5000/api"

export async function fetchPatients() {
  const res = await axios.get(`${API_BASE}/patients`)
  return res.data.patients
}

export async function createPatient(data) {
  const res = await axios.post(`${API_BASE}/patients`, data)
  return res.data.patient
}
