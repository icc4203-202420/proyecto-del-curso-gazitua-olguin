import { useState } from 'react';
import { View, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSession } from '../../hooks/useSession';
import { login as loginService } from '../services/authService';
import AuthInputController from '../components/controllers/AuthInputController';
import GradientButton from '../components/buttons/GradientButton';

const LoginPage = () => {
  const { login } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa correo y contraseña.');
      return;
    }

    try {
      setLoading(true);
      console.log('Datos enviados al login:', { email, password });

      const data = await loginService(email, password);
      console.log('Respuesta recibida:', data);

      if (data?.status?.code === 200) {
        const { token, user } = data.status.data;
        if (token && user) {
          await login(user.email, token);
          router.replace('/');
        } else {
          Alert.alert('Error', 'No se pudo iniciar sesión.');
        }
      } else {
        Alert.alert('Error', 'Credenciales incorrectas.');
      }
    } catch (error) {
      console.error('Error en el login:', error?.response?.data || error.message);
      Alert.alert('Error', 'Hubo un problema al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <AuthInputController
        value={email}
        setValue={setEmail}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        inputStyle={styles.inputText}
      />
      <AuthInputController
        value={password}
        setValue={setPassword}
        placeholder="Contraseña"
        secureTextEntry
        inputStyle={styles.inputText}
      />

      <GradientButton onPress={handleLogin} loading={loading}>
        Entrar
      </GradientButton>

      <TouchableOpacity onPress={() => router.push('/signup')}>
        <Text style={styles.signupText}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '10%',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#FF9800',
  },
  signupText: {
    marginTop: 15,
    fontSize: 16,
    color: '#fff',
    textDecorationLine: 'underline',
  },
  inputText: {
    color: '#fff',
  },
  inputStyle: {
    color: '#fff'
  }
});

export default LoginPage;
