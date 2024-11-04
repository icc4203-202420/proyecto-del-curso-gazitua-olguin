import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Asegúrate de tener instalado @expo/vector-icons
import api from '../../services/api';

type TaggedUser = {
  id: string;
  handle: string;
};

type EventPicture = {
  id: string;
  image_url: string;
  description: string;
  tagged_users: TaggedUser[];
};

type EventPicturesTabProps = {
  eventId: string;
};

const EventPicturesTab = ({ eventId }: EventPicturesTabProps) => {
  const [pictures, setPictures] = useState<EventPicture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPictures = async () => {
      try {
        const response = await api.get(`/events/${eventId}/pictures`);
        setPictures(response.data);
    } catch (error) {
        if (error.response && error.response.status === 404) {
          // Si es un 404, significa que no hay fotos disponibles, establecer un array vacío
          setPictures([]);
        } else {
          console.error('Error al cargar las fotos del evento:', error);
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchPictures();
  }, [eventId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#FF9800" style={styles.loadingIndicator} />;
  }

  if (pictures.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="camera-alt" size={50} color="#FF9800" />
        <Text style={styles.emptyText}>No hay fotos disponibles para este evento.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={pictures}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.pictureContainer}>
          <Image source={{ uri: item.image_url }} style={styles.image} />
          {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
          {item.tagged_users.length > 0 && (
            <View style={styles.taggedUsersContainer}>
              <Text style={styles.taggedTitle}>Etiquetados:</Text>
              <View style={styles.taggedUsersList}>
                {item.tagged_users.map((user) => (
                  <Text key={user.id} style={styles.taggedUser}>
                    @{user.handle}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  loadingIndicator: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  emptyText: { color: '#FF9800', textAlign: 'center', marginTop: 10, fontSize: 16, fontWeight: 'bold' },
  pictureContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#1C1C1C',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 5,
  },
  image: { width: '100%', height: 220, borderRadius: 10, marginBottom: 8 },
  description: { marginTop: 4, color: '#E0E0E0', fontSize: 15, textAlign: 'center', fontWeight: '500' },
  taggedUsersContainer: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#333',
  },
  taggedTitle: { color: '#FF9800', fontWeight: '700', fontSize: 14, marginBottom: 6 },
  taggedUsersList: { flexDirection: 'row', flexWrap: 'wrap' },
  taggedUser: {
    backgroundColor: '#555',
    color: '#FFFFFF',
    fontSize: 12,
    marginRight: 6,
    marginTop: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
});

export default EventPicturesTab;
