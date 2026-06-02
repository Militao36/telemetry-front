import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api/v1",
});

api.interceptors.request.use((config) => {
  const stringTokens = localStorage.getItem("tokens");
  const tokenSelected = JSON.parse(localStorage.getItem("tokenSelected") || "{}");
  const tokens = stringTokens ? JSON.parse(stringTokens) : null;

  if (tokens || tokens?.length > 0) {
    config.headers.Authorization = `Bearer ${tokenSelected?.token || tokens[0]?.token}`
  }

  return config
})


export { api }
