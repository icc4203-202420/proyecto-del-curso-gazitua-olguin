import { useState } from 'react';
import { View, StyleSheet, Text, Alert, TouchableOpacity, SafeAreaView } from 'react-native';
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
      const data = await loginService(email, password);

      if (data?.status?.code === 200) {
        const { token, user } = data.status.data;

        if (token && user) {
          await login(user, token); // Actualizamos la sesión
          console.log('Sesión almacenada:', { token, user });
          router.replace('/');
        } else {
          Alert.alert('Error', 'No se pudo iniciar sesión.');
        }
      } else {
        Alert.alert('Error', 'Credenciales incorrectas.');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
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

        <GradientButton onPress={handleLogin} loading={loading} containerStyle={styles.button}>
          Entrar
        </GradientButton>

        <TouchableOpacity onPress={() => router.push('/signup')}>
          <Text style={styles.signupText}>¿No tienes cuenta? Regístrate</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
    color: '#FF9800',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signupText: {
    marginTop: 20,
    fontSize: 16,
    color: '#FF9800',
    textDecorationLine: 'underline',
  },
  forgotPasswordText: {
    marginTop: 10,
    fontSize: 14,
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
  inputText: {
    color: '#FFFFFF',
  },
  button: {
    marginTop: 30,
  },
});

export default LoginPage;
