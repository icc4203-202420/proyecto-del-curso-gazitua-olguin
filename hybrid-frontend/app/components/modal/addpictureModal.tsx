// app/components/event/SharePhoto.tsx

import React, { useState } from 'react';
import { View, Button, TextInput, Image, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import api from '../../services/api';

const SharePhoto = () => {
  const route = useRoute();
  const { eventId } = route.params || {};
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState(''); 

  const pickImage = async () => {
    // Solicita permiso para acceder a la galería
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert("Se requieren permisos para acceder a la galería.");
      return;
    }
  
    // Abre la galería y selecciona una imagen
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    console.log("Image Picker Result:", result); // Verifica la estructura del resultado
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedUri = result.assets[0].uri; // Accede a la URI desde assets
      console.log("Selected image URI: ", selectedUri); // Confirmación de la URI
      setImageUri(selectedUri);
    } else {
      console.log("Image selection cancelled or no assets available");
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
    
    // Agrega tag_handles como un parámetro separado, no dentro de event_picture
    tags.split(',').map(tag => tag.trim()).forEach((tag, index) => {
      formData.append(`tag_handles[${index}]`, tag);
    });

    try {
      await api.post(`/events/${eventId}/event_pictures`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Alert.alert('Éxito', 'Foto subida exitosamente');
      setImageUri(null);
      setTags('');
      setDescription('');
    } catch (error) {
      console.error('Error al subir la foto:', error);
      Alert.alert('Error', 'Hubo un error al subir la foto');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Seleccionar una imagen" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <TextInput
        style={styles.input}
        placeholder="Introduce los handles a etiquetar (separados por comas)"
        value={tags}
        onChangeText={setTags}
      />
      <TextInput
        style={styles.input}
        placeholder="Añadir una descripción"
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Subir Foto" onPress={uploadPhoto} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: 'center', backgroundColor: '#000', flex: 1 },
  image: { width: 200, height: 200, marginVertical: 16 },
  input: {
    width: '100%',
    padding: 8,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
});

export default SharePhoto;
