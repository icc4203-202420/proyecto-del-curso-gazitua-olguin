import { EventRegister } from 'react-native-event-listeners';
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, TextInput, Image, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import api from '../../services/api';

const SharePhoto = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { eventId } = route.params || {};
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permisos requeridos', 'Se requieren permisos para acceder a la galería.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedUri = result.assets[0].uri;
      setImageUri(selectedUri);
    }
  };

  const uploadPhoto = async () => {
    if (!imageUri) {
      Alert.alert('Error', 'Por favor selecciona una imagen primero');
      return;
    }

    const formData = new FormData();
    formData.append('event_picture[image]', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    } as any);
    formData.append('event_picture[event_id]', eventId);
    formData.append('event_picture[description]', description);

    tags.split(',').map(tag => tag.trim()).forEach((tag, index) => {
      formData.append(`tag_handles[${index}]`, tag);
    });

    try {
      const response = await api.post(`/events/${eventId}/event_pictures`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Emitir evento después de subir la foto exitosamente
      EventRegister.emit('pictureAdded', eventId);
      
      // Primero navegamos hacia atrás
      navigation.goBack();
      
      // Luego mostramos la alerta de éxito
      setTimeout(() => {
        Alert.alert('Éxito', 'Foto subida exitosamente');
      }, 100);
      
      setImageUri(null);
      setTags('');
      setDescription('');
    } catch (error) {
      Alert.alert('Error', 'Hubo un error al subir la foto');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.pickImageButton} onPress={pickImage}>
        <Text style={styles.pickImageButtonText}>Seleccionar una imagen</Text>
      </TouchableOpacity>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      <TextInput
        style={styles.input}
        placeholder="Introduce los handles a etiquetar (separados por comas)"
        placeholderTextColor="#aaa"
        value={tags}
        onChangeText={setTags}
      />
      <TextInput
        style={styles.input}
        placeholder="Añadir una descripción"
        placeholderTextColor="#aaa"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity style={styles.uploadButton} onPress={uploadPhoto}>
        <Text style={styles.uploadButtonText}>Subir Foto</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  pickImageButton: {
    backgroundColor: '#FF9800',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  pickImageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FF9800',
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#2C2C2E',
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#444',
  },
  uploadButton: {
    backgroundColor: '#34C759',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SharePhoto;
