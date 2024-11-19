import { useForm } from 'react-hook-form';
import { Text, StyleSheet, ScrollView, Alert, SafeAreaView, KeyboardAvoidingView, Platform, View } from 'react-native';
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
        Alert.alert(
          'Registro exitoso',
          'Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.',
          [
            { text: 'OK', onPress: () => router.replace('/login') },
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

  const renderFormSection = (title, children) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Crea tu cuenta</Text>

            {renderFormSection('Información Personal', (
              <>
                <FormInputController
                  name="firstName"
                  control={control}
                  rules={{ required: 'El nombre es obligatorio' }}
                  placeholder="Nombre"
                  inputStyle={styles.inputText}
                  containerStyle={styles.inputContainer}
                />

                <FormInputController
                  name="lastName"
                  control={control}
                  rules={{ required: 'El apellido es obligatorio' }}
                  placeholder="Apellido"
                  inputStyle={styles.inputText}
                  containerStyle={styles.inputContainer}
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
                  containerStyle={styles.inputContainer}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <FormInputController
                  name="handle"
                  control={control}
                  rules={{ required: 'El handle es obligatorio' }}
                  placeholder="Handle"
                  inputStyle={styles.inputText}
                  containerStyle={styles.inputContainer}
                  autoCapitalize="none"
                />
              </>
            ))}

            {renderFormSection('Contraseña', (
              <>
                <FormInputController
                  name="password"
                  control={control}
                  rules={{ required: 'La contraseña es obligatoria' }}
                  placeholder="Contraseña"
                  secureTextEntry
                  inputStyle={styles.inputText}
                  containerStyle={styles.inputContainer}
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
                  containerStyle={styles.inputContainer}
                />
              </>
            ))}

            {renderFormSection('Dirección (Opcional)', (
              <>
                <FormInputController
                  name="line1"
                  control={control}
                  placeholder="Dirección línea 1"
                  inputStyle={styles.inputText}
                  containerStyle={styles.inputContainer}
                />

                <FormInputController
                  name="line2"
                  control={control}
                  placeholder="Dirección línea 2"
                  inputStyle={styles.inputText}
                  containerStyle={styles.inputContainer}
                />

                <FormInputController
                  name="city"
                  control={control}
                  placeholder="Ciudad"
                  inputStyle={styles.inputText}
                  containerStyle={styles.inputContainer}
                />

                <FormInputController
                  name="countryId"
                  control={control}
                  placeholder="ID de País"
                  keyboardType="numeric"
                  inputStyle={styles.inputText}
                  containerStyle={styles.inputContainer}
                />
              </>
            ))}

            <GradientButton
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              containerStyle={styles.buttonContainer}
            >
              Registrarse
            </GradientButton>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40, // Extra padding at bottom for better scroll experience
  },
  title: {
    fontSize: 32,
    textAlign: 'left',
    marginBottom: 30,
    color: '#FF9800',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#FF9800',
    marginBottom: 16,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 32,
  },
});

export default SignUp;