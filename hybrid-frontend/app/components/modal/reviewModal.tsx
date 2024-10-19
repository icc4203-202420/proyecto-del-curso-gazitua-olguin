import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSession } from '../../../hooks/useSession'; 
import api from '../../services/api';

export default function ReviewModal() {
  const route = useRoute();
  const navigation = useNavigation();
  const { beerId } = route.params;

  const { session } = useSession(); // Verificamos la sesión
  console.log('Sesión en modal:', session); // Verificar si la sesión se obtiene correctamente

  const [rating, setRating] = useState(3);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (text.split(/\s+/).length < 15) {
      Alert.alert('Error', 'La evaluación debe tener al menos 15 palabras.');
      return;
    }

    if (!session?.token || !session?.user_id) {
      Alert.alert('Error', 'No estás autenticado.');
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        '/reviews',
        {
          review: {
            rating,
            text,
            beer_id: beerId,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${session.token}`, // Usamos el token de la sesión
          },
        }
      );

      Alert.alert('Éxito', 'Reseña enviada correctamente.');
      setText('');
      setRating(3);
      navigation.goBack(); // Cerrar el modal
    } catch (error) {
      console.error('Error al enviar la reseña:', error?.response?.data || error.message);
      Alert.alert('Error', 'No se pudo enviar la reseña.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#FF9800" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escribe una Reseña</Text>

      <TextInput
        style={styles.input}
        placeholder="Escribe tu reseña"
        multiline
        numberOfLines={4}
        value={text}
        onChangeText={setText}
      />

      <Text style={styles.label}>Calificación:</Text>
      <TextInput
        style={styles.input}
        placeholder="Valor entre 1 y 5"
        keyboardType="numeric"
        value={rating.toString()}
        onChangeText={(value) => setRating(parseFloat(value))}
      />

      <Button title="Enviar Reseña" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
