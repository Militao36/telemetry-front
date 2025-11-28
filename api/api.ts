import axios from "axios";

const api = axios.create({
  baseURL: "https://telemetry-telemetry-api.qltz9y.easypanel.host/api/v1",
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZEVtcHJlc2EiOiJhZjhmYjIzNS1lYThmLTQ3MGMtYThmYy1hNzFkYjg3ZDgzNjciLCJpZFVzZXIiOiI4YzczODNjZi1mNTcwLTQ0NzEtODI1Ny1mZDIxOGUxZGQ3YTUiLCJpYXQiOjE3NjQwNzAzMDYsImV4cCI6MTc2NjY2MjMwNn0.HvQWx5nrN7K_RnpMgvbi4ZN4x_SFQTgD7zLZbdzwD5E`,
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = `Bearer ${token}`

  return config
})


export { api }