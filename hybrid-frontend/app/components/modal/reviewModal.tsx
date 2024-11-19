import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSession } from '../../../hooks/useSession';
import api from '../../services/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { EventRegister } from 'react-native-event-listeners';

export default function ReviewModal() {
  const route = useRoute();
  const navigation = useNavigation();
  const { beerId } = route.params || {};
  const { session } = useSession();
  const [rating, setRating] = useState(3);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  
  if (!beerId) {
    Alert.alert('Error', 'No se encontró la cerveza a reseñar.');
    navigation.goBack();
    return null;
  }

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
            user_id: session.user_id,
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
      setRating(3);
      if (response.data) {
        // Emitir el evento después de confirmar que la reseña se guardó
        EventRegister.emit('reviewAdded', beerId);
        
        // Primero navegamos hacia atrás
        navigation.goBack();
        
        // Luego mostramos la alerta de éxito
        setTimeout(() => {
          Alert.alert('Éxito', 'Reseña enviada correctamente.');
        }, 100);
      }
    } catch (error) {
      console.error('Error al enviar la reseña:', error);
      const errorMessage = 
        error?.response?.data?.message || 
        'No se pudo enviar la reseña. Por favor, inténtalo de nuevo.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };


  const renderBeers = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const filled = index < rating;
      return (
        <TouchableWithoutFeedback key={index} onPress={() => setRating(index + 1)}>
          <MaterialCommunityIcons
            name={filled ? 'star' : 'star-outline'}
            size={40}
            color={filled ? '#FFD700' : '#999'}
            style={styles.beerIcon}
          />
        </TouchableWithoutFeedback>
      );
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9800" />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Reseñar Cerveza</Text>

        {/* Estrellas */}
        <Text style={styles.subtitle}>Tu puntuación</Text>
        <View style={styles.beersContainer}>
          <View style={styles.beers}>{renderBeers()}</View>
        </View>

        {/* Input para la reseña */}
        <TextInput
          style={styles.input}
          placeholder="Escribe tu reseña (mínimo 15 palabras)"
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          maxLength={300}
          value={text}
          onChangeText={setText}
        />

        {/* Botón de enviar */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Enviar Reseña</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
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
    textAlign: 'center',
    color: '#FF9800',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  beersContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  beers: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  beerIcon: {
    marginHorizontal: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#1C1C1C',
    color: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
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
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});
