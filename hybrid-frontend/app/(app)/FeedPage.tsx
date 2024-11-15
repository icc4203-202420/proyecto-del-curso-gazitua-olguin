// app/(app)/FeedPage.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { subscribeToFeed } from '../services/feedService';

type FeedItem = {
  id: string;
  image_url: string;
  description: string;
  tagged_users: string[];
  event_name: string;
  bar_name: string;
  country: string;
  published_at: string;
};

export default function FeedPage() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);

  const [loading, setLoading] = useState(true);

  const handleNewPost = useCallback((newPost: FeedItem) => {
    console.log("New post received:", newPost);
    setFeedItems((prevFeedItems) => {
      if (!prevFeedItems.find((item) => item.id === newPost.id)) {
        return [newPost, ...prevFeedItems];
      }
      return prevFeedItems;
    });
  }, []);

  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://192.168.1.83:3001/api/v1/feed_posts');
        
        if (response.status === 401) {
          console.warn("El usuario no tiene amigos en el feed.");
          setFeedItems([]); // Establece el feed como vacío en caso de no tener amigos
          return;
        }
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const initialFeed = await response.json();
        console.log("Initial feed from API:", initialFeed);
        setFeedItems(Array.isArray(initialFeed) ? initialFeed : []); // Asegúrate de que sea un array
      } catch (error) {
        console.error("Error fetching initial feed:", error);
        setFeedItems([]); // Establece un array vacío en caso de error
      } finally {
        setLoading(false);
      }
    };
  
    fetchFeed();
  
    const subscribe = async () => {
      await subscribeToFeed(handleNewPost);
    };
    subscribe();
  }, [handleNewPost]);
  

  if (loading) {
    return <ActivityIndicator size="large" color="#FF9800" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      {feedItems.length === 0 ? (
        <Text style={styles.noPostsText}>No hay publicaciones disponibles.</Text>
      ) : (
        <FlatList
          data={feedItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.feedItem}>
              {item.image_url ? (
                <Image source={{ uri: item.image_url }} style={styles.image} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.placeholderText}>No Image</Text>
                </View>
              )}
              <View style={styles.content}>
                <Text style={styles.eventName}>{item.event_name || "Evento desconocido"}</Text>
                <Text style={styles.description}>{item.description || "Sin descripción"}</Text>
                <Text style={styles.userHandle}>@{item.user_handle || "Usuario desconocido"}</Text>
                <Text style={styles.barName}>
                  {item.bar_name || "Bar desconocido"} - {item.country || "País desconocido"}
                </Text>
                <Text style={styles.timestamp}>
                  {item.published_at ? new Date(item.published_at).toLocaleString() : "Fecha no disponible"}
                </Text>
                <View style={styles.taggedUsers}>
                  {item.tagged_users && item.tagged_users.map((user, index) => (
                  <Text key={index} style={styles.taggedUser}>@{user}</Text>
                ))}
              </View>
              </View>
            </View>
          )}
          contentContainerStyle={styles.feedContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#FF9800',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 16,
  },
  noPostsText: {
    color: '#FFF',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  feedContainer: {
    paddingBottom: 16,
  },
  feedItem: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  placeholderText: {
    color: '#FFF',
    fontSize: 16,
  },
  content: {
    paddingTop: 8,
  },
  eventName: {
    fontSize: 18,
    color: '#FF9800',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  description: {
    color: '#E0E0E0',
    fontSize: 14,
    marginBottom: 6,
  },
  userHandle: {
    color: '#9E9E9E',
    fontSize: 14,
    marginBottom: 6,
  },
  barName: {
    color: '#FF9800',
    fontSize: 14,
    marginBottom: 6,
  },
  timestamp: {
    color: '#B0B0B0',
    fontSize: 12,
    marginBottom: 8,
  },
  taggedUsers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  taggedUser: {
    color: '#FF9800',
    marginRight: 8,
  },
});