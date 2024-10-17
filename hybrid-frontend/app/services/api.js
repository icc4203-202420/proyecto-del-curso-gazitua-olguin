import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  baseURL: 'http://192.168.1.96:3001/api/v1', // reemplazar por propia IP del computador
});

const getToken = async () => {
  try {
    const token = await SecureStore.getItemAsync('token');
    return token;
  } catch (error) {
    console.error('Error al obtener el token:', error);
    return null;
  }
};

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
