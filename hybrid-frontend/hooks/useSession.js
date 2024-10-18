// hooks/useSession.js
import { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext();

export const useSession = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);

  const login = async (user, token) => {
    const userData = { user_id: user.id, email: user.email, token };
    await SecureStore.setItemAsync('session', JSON.stringify(userData));
    setSession(userData);
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('session');  // Eliminar sesión almacenada
      await SecureStore.deleteItemAsync('token');
      setSession(null);  // Actualizar el estado de sesión a null
      console.log('Sesión cerrada correctamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  useEffect(() => {
    const loadSession = async () => {
      const storedSession = await SecureStore.getItemAsync('session');
      if (storedSession) {
        setSession(JSON.parse(storedSession));
      } else {
        setSession(null); // Asegúrate de que el estado sea null si no hay sesión
      }
    };
    loadSession();
  }, []);
  

  return (
    <AuthContext.Provider value={{ session, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
