import { useForm } from 'react-hook-form';
import { Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { signUp as signUpService } from '../services/authService';
import FormInputController from '../components/controllers/FormInputController';
import GradientButton from '../components/buttons/GradientButton';

const SignUp = () => {
  const { control, handleSubmit, formState: { errors }, getValues } = useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const userData = {
        email: data.email,
        password: data.password,
        password_confirmation: data.passwordConfirmation,
        first_name: data.firstName,
        last_name: data.lastName,
        handle: data.handle,
        address_attributes: {
          line1: data.line1,
          line2: data.line2,
          city: data.city,
          country_id: data.countryId,
        },
      };


      const response = await signUpService(userData);

      if (response?.status?.code === 200) {
        // Mostrar mensaje de éxito y redirigir al login
        Alert.alert(
          'Registro exitoso',
          'Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.',
          [
            { text: 'OK', onPress: () => router.replace('/login') }, // Redirige al login
          ]
        );
      } else {
        Alert.alert('Error', 'Ocurrió un error durante el registro.');
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      Alert.alert('Error', 'Hubo un problema al registrarse.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crea tu cuenta</Text>

      <FormInputController
        name="firstName"
        control={control}
        rules={{ required: 'El nombre es obligatorio' }}
        placeholder="Nombre"
        inputStyle={styles.inputText}
      />

      <FormInputController
        name="lastName"
        control={control}
        rules={{ required: 'El apellido es obligatorio' }}
        placeholder="Apellido"
        inputStyle={styles.inputText}
      />

      <FormInputController
        name="email"
        control={control}
        rules={{
          required: 'El correo es obligatorio',
          pattern: { value: /^\S+@\S+$/i, message: 'Correo no válido' },
        }}
        placeholder="Correo electrónico"
        inputStyle={styles.inputText}
      />

      <FormInputController
        name="handle"
        control={control}
        rules={{ required: 'El handle es obligatorio' }}
        placeholder="Handle"
        inputStyle={styles.inputText}
      />

      <FormInputController
        name="password"
        control={control}
        rules={{ required: 'La contraseña es obligatoria' }}
        placeholder="Contraseña"
        secureTextEntry
        inputStyle={styles.inputText}
      />

      <FormInputController
        name="passwordConfirmation"
        control={control}
        rules={{
          required: 'Confirma tu contraseña',
          validate: (value) =>
            value === getValues('password') || 'Las contraseñas no coinciden',
        }}
        placeholder="Confirmar contraseña"
        secureTextEntry
        inputStyle={styles.inputText}
      />

      <FormInputController
        name="line1"
        control={control}
        placeholder="Dirección línea 1"
        inputStyle={styles.inputText}
      />

      <FormInputController
        name="line2"
        control={control}
        placeholder="Dirección línea 2"
        inputStyle={styles.inputText}
      />

      <FormInputController
        name="city"
        control={control}
        placeholder="Ciudad"
        inputStyle={styles.inputText}
      />

      <FormInputController
        name="countryId"
        control={control}
        placeholder="ID de País"
        keyboardType="numeric"
        inputStyle={styles.inputText}
      />

      <GradientButton
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        containerStyle={{ marginTop: 20 }}
      >
        Registrarse
      </GradientButton>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    textAlign: 'left',
    marginBottom: 20,
    color: '#FFC107',
    fontWeight: 'bold',
  },
  inputText: {
    color: '#FFFFFF',
  },
});

export default SignUp;
