import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Crear instancia de Axios
const api = axios.create({
  baseURL: 'http://192.168.1.96:3001/api/v1', // Reemplaza por tu IP o URL correcta
});

// Función para obtener el token del almacenamiento seguro
const getToken = async () => {
  try {
    const token = await SecureStore.getItemAsync('token');
    console.log('Token obtenido:', token); // Log para depuración
    return token;
  } catch (error) {
    console.error('Error al obtener el token:', error);
    return null;
  }
};

// Interceptor para agregar el token a cada solicitud
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
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
