// client/src/lib/axios.ts
import axios from "axios";

const api = axios.create({
 // baseURL: "https://border-crm.onrender.com/api", // La dirección de tu backend
  baseURL: "http://localhost:5000/api", 
});

// Interceptor: Antes de cada petición, pega el token si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;