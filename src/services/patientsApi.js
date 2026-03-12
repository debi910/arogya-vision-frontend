import api from "./api"

export async function fetchPatients() {
  const res = await api.get("/patients")
  return res.data.patients
}

export async function createPatient(data) {
  const res = await api.post("/patients", data)
  return res.data.patient
}
