// hooks/useSession.js
import { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext();

export const useSession = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);

  const login = async (email, token) => {
    const userData = { email, token };
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

