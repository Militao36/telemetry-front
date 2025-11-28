import axios from "axios";

const api = axios.create({
  baseURL: "https://telemetry-telemetry-api.qltz9y.easypanel.host/api/v1",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = `Bearer ${token}`

  return config
})


export { api }