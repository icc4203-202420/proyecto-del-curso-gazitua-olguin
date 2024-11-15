import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  Image, 
  ActivityIndicator, 
  TouchableOpacity, 
  RefreshControl 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { fetchFeedPosts, fetchFeedReviews, subscribeToFeed } from '../services/feedService';

export default function FeedPage() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFeeds = async () => {
    setLoading(true);
    try {
      const [posts, reviews] = await Promise.all([fetchFeedPosts(), fetchFeedReviews()]);
      const formattedPosts = posts.map((post) => ({ ...post, type: 'event_post' }));
      const formattedReviews = reviews.map((review) => ({ ...review, type: 'beer_review' }));
      const combinedFeed = [...formattedPosts, ...formattedReviews].sort(
        (a, b) => new Date(b.published_at) - new Date(a.published_at)
      );
      setFeed(combinedFeed);
    } catch (error) {
      console.error('Error fetching feeds:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchFeeds();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchFeeds();

    const subscribe = async () => {
      await subscribeToFeed((newPost) => {
        setFeed((prev) => {
          const updatedFeed = [newPost, ...prev];
          return updatedFeed.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
        });
      });
    };

    subscribe();
  }, []);

  const renderFeedItem = ({ item }) => {
    if (item.type === 'event_post') {
      return (
        <TouchableOpacity style={styles.feedItem} activeOpacity={0.9}>
          {item.image_url ? (
            <Image source={{ uri: item.image_url }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Icon name="image-outline" size={50} color="#666" />
            </View>
          )}
          <Text style={styles.eventName}>{item.event_name || 'Evento desconocido'}</Text>
          <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
            {item.description || 'Sin descripción'}
          </Text>
          <Text style={styles.userHandle}>@{item.user_handle}</Text>
          <Text style={styles.barName}>
            {item.bar_name || 'No bar info'}, {item.country || 'No country info'}
          </Text>
          <Text style={styles.timestamp}>
            {new Date(item.published_at).toLocaleString()}
          </Text>
        </TouchableOpacity>
      );
    }

    if (item.type === 'beer_review') {
      return (
        <TouchableOpacity style={styles.feedItem} activeOpacity={0.9}>
          <Text style={styles.userHandle}>@{item.user_handle}</Text>
          <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
            {item.description || 'Sin descripción'}
          </Text>
          {item.beer && (
            <Text style={styles.beerDetails}>
              {item.beer.name} ({item.beer.avg_rating || 'N/A'}/5)
            </Text>
          )}
          <Text style={styles.barName}>
            {item.beer?.bar_name || 'No bar info'}, {item.beer?.country || 'No country info'}
          </Text>
          <Text style={styles.timestamp}>
            {new Date(item.published_at).toLocaleString()}
          </Text>
        </TouchableOpacity>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9800" />
        <Text style={styles.loadingText}>Cargando tu feed...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={feed}
      keyExtractor={(item, index) => `${item.type}-${item.id}-${index}`}
      renderItem={renderFeedItem}
      contentContainerStyle={styles.feedContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      onEndReachedThreshold={0.5}
    />
  );
}

const styles = StyleSheet.create({
  feedContainer: {
    paddingBottom: 16,
    backgroundColor: '#000',
  },
  feedItem: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 10,
  },
  imagePlaceholder: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  eventName: {
    fontSize: 18,
    color: '#FFA726',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: '#FFF',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  userHandle: {
    color: '#9E9E9E',
    fontSize: 14,
    marginBottom: 6,
  },
  barName: {
    color: '#FFA726',
    fontSize: 14,
    marginBottom: 6,
  },
  timestamp: {
    color: '#BDBDBD',
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'right',
  },
  beerDetails: {
    color: '#FFCC80',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    color: '#FF9800',
    fontSize: 16,
    marginTop: 10,
  },
});
