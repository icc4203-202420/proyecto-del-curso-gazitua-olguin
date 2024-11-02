import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Crear instancia de Axios
const api = axios.create({
  baseURL: 'http://192.168.35.178:3001/api/v1', // Reemplaza por tu IP o URL correcta
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

// Llamar a esta función al iniciar la app
setTokenInterceptor();

// Opción para limpiar el interceptor tras logout
export const clearApiToken = () => {
  if (interceptorId !== undefined) {
    api.interceptors.request.eject(interceptorId);  // Remover el interceptor
  }
};

export default api;
