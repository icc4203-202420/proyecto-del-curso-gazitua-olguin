import { useState } from 'react';
import { 
  View, Text, TextInput, Alert, ActivityIndicator, StyleSheet, TouchableOpacity 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSession } from '../../../hooks/useSession'; 
import { AirbnbRating } from '@rneui/themed';  // Importamos AirbnbRating para mejor control
import api from '../../services/api';

export default function ReviewModal() {
  const route = useRoute();
  const navigation = useNavigation();
  const { beerId } = route.params || {};

  if (!beerId) {
    console.error('No se recibió beerId en los parámetros.');
    Alert.alert('Error', 'No se encontró la cerveza a reseñar.');
    navigation.goBack();
    return null;
  }

  const { session } = useSession();
  const [rating, setRating] = useState(3); // Valor inicial del rating
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
            user_id: session.user_id  
          },
        },
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      );

      Alert.alert('Éxito', 'Reseña enviada correctamente.');
      setText('');
      setRating(3); // Reiniciamos el valor del rating
      navigation.goBack();
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'No se pudo enviar la reseña.';
      console.error('Error al enviar la reseña:', errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9800" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escribe una Reseña</Text>

      <TextInput
        style={styles.input}
        placeholder="Escribe tu reseña"
        placeholderTextColor="#999"
        multiline
        numberOfLines={4}
        maxLength={300}
        value={text}
        onChangeText={setText}
      />

      <AirbnbRating
        count={5} // 5 estrellas
        reviews={["Mala", "Regular", "Buena", "Muy buena", "Excelente"]} // Opcional
        defaultRating={rating} // Valor inicial
        size={30}
        onFinishRating={(value) => setRating(value)} // Actualizamos el estado
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Enviar Reseña</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  button: {
    backgroundColor: '#FF9800',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#FF9800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
});
