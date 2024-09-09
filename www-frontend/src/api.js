import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1', // Ajusta esto según tu configuración
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;