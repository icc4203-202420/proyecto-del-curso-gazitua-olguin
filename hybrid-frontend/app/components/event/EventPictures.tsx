import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
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
        <Text style={styles.emptySubText}>Sé el primero en subir una foto!</Text>
      </View>
    );
  }

  const numColumns = 2;
  const imageSize = Dimensions.get('window').width / numColumns;

  return (
    <View style={styles.emptyContainer}>
      <FlatList
      data={pictures}
      keyExtractor={(item) => item.id.toString()}
      numColumns={numColumns}
      contentContainerStyle={styles.grid}
      renderItem={({ item }) => (
        <View style={styles.pictureContainer}>
          <Image source={{ uri: item.image_url }} style={[styles.image, { width: imageSize, height: imageSize }]} />
          <View style={styles.detailsContainer}>
            {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
            {item.tagged_users.length > 0 && (
            <View style={styles.taggedUsersContainer}>
              <Text style={styles.taggedTitle}>Etiquetados:</Text>
              <View style={styles.taggedUsersList}>
                {item.tagged_users.map((user, index) => (
                  <Text key={index} style={styles.taggedUser}>
                    @{user}
                  </Text>
                ))}
              </View>
            </View>
          )}

          </View>
        </View>
      )}
    />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingIndicator: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  emptyText: { color: '#FF9800', textAlign: 'center', marginTop: 10, fontSize: 20, fontWeight: 'bold' },
  grid: { backgroundColor: '#000', paddingHorizontal: 3 },
  pictureContainer: {
    margin: 1,
    backgroundColor: '#1C1C1C',
    borderRadius: 10,
    paddingBottom: 10,
    overflow: 'hidden',
    alignItems: 'center',
  },
  image: { borderRadius: 6 },
  detailsContainer: {
    paddingHorizontal: 8,
    marginTop: 8,
  },
  description: { color: '#E0E0E0', fontSize: 14, textAlign: 'center', fontWeight: '500' },
  taggedUsersContainer: {
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  taggedTitle: { color: '#FF9800', fontWeight: '700', fontSize: 13 },
  taggedUsersList: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
  taggedUser: {
    backgroundColor: '#555',
    color: '#FFFFFF',
    fontSize: 12,
    marginRight: 6,
    marginTop: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 15,
  },
  emptySubText: {color: '#FFF',fontSize: 16, },
});

export default EventPicturesTab;
