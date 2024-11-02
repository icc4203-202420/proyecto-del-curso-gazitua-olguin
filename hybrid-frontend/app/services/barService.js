import api from './api';

export const getBars = async () => {
  try {
    const response = await api.get('/bars');
    return response.data.bars;
  } catch (error) {
    console.error('Error al obtener los bares:', error);
    throw error;
  }
};
