import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'https://border-crm.onrender.com';

const api = axios.create({
  baseURL,
});

// Interceptor para inyectar el JWT en todas las peticiones protegidas
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;