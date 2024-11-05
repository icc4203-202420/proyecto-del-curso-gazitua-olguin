//app/services/api.js

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Crear instancia de Axios
const api = axios.create({
  baseURL: 'http://192.168.1.85:3001/api/v1',
});

// Variable para almacenar el ID del interceptor
let interceptorId;

// Función para obtener el token del almacenamiento seguro
const getToken = async () => {
  try {
    const token = await SecureStore.getItemAsync('token');
    return token;
  } catch (error) {
    console.error('Error al obtener el token:', error);
    return null;
  }
};

// Configurar y guardar el interceptor
export const setTokenInterceptor = () => {
  interceptorId = api.interceptors.request.use(
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
};


// Opción para limpiar el interceptor tras logout
export const clearApiToken = () => {
  if (interceptorId !== undefined) {
    api.interceptors.request.eject(interceptorId);
  }
};

export default api;
