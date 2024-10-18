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
    await SecureStore.deleteItemAsync('session');
    setSession(null);
  };

  useEffect(() => {
    const loadSession = async () => {
      const storedSession = await SecureStore.getItemAsync('session');
      console.log('Sesión cargada desde SecureStore:', storedSession); // Verificar si la sesión se carga correctamente
      if (storedSession) {
        setSession(JSON.parse(storedSession));
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
