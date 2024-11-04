import { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { registerForPushNotificationsAsync } from '../util/Notifications';

const AuthContext = createContext();

export const useSession = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);

  const login = async (user, token) => {
    const userData = { user_id: user.id, email: user.email, token };
    await SecureStore.setItemAsync('session', JSON.stringify(userData));
    await SecureStore.setItemAsync('token', token); 
    setSession(userData);

    // Obtener y guardar el token de notificación
    const pushToken = await registerForPushNotificationsAsync();
    if (pushToken) {
      // Enviar el token al backend
      await fetch('http://192.168.1.85:3001/api/v1/users/push_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ push_token: pushToken })
      });
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('session');
      await SecureStore.deleteItemAsync('token');
      setSession(null);
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
        setSession(null);
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
