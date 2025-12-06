import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3333/api/v1",
});

api.interceptors.request.use((config) => {
  const stringTokens = localStorage.getItem("tokens");
  const tokens = stringTokens ? JSON.parse(stringTokens) : null;

  if (tokens || tokens.length > 0)
    config.headers.Authorization = `Bearer ${tokens[0]}`

  return config
})


export { api }