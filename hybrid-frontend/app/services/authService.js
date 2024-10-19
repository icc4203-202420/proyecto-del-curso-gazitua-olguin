// services/authService.js
import api from './api';

// Llamada al endpoint de login
export const login = async (email, password) => {
  try {
    const response = await api.post('/login', {
      user: { email, password },
    });
    return response.data;
  } catch (error) {
    console.error('Error en authService login:', error?.response?.data || error.message);
    throw error; // Propagamos el error para que lo maneje el componente
  }
};

// Llamada al endpoint de registro
export const signUp = async (userData) => {
  try {
    const response = await api.post('/signup', { user: userData });
    return response.data;
  } catch (error) {
    console.error('Error en authService signup:', error?.response?.data || error.message);
    throw error;
  }
};
