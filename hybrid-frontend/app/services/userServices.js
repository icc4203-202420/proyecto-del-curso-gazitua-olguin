import api from './api';

export const getUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data.users;
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    throw error;
  }
};
