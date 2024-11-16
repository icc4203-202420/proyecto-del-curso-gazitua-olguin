import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator, TouchableOpacity, RefreshControl, Modal, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { fetchFeedPosts, fetchFeedReviews, subscribeToFeed } from '../services/feedService';

export default function FeedPage() {
  const [feed, setFeed] = useState([]);
  const [filteredFeed, setFilteredFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState({});  // { type: 'friend' | 'bar' | 'country' | 'beer', value: string }
  const [filterOptions, setFilterOptions] = useState({});
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const navigation = useNavigation();

  // Centraliza la lógica de filtrado
  const applyFilter = (feed) => {
    if (!filter) return feed;
    return feed.filter((item) => {
      if (filter.friend && item.user_handle !== filter.friend) return false;
      if (filter.bar && item.bar_name !== filter.bar) return false;
      if (filter.country && item.country !== filter.country) return false;
      if (filter.beer && item.beer_details?.name !== filter.beer) return false;
      return true;
    });
  };

  useEffect(() => {
    setFilteredFeed(applyFilter(feed));
  }, [filter, feed]);

// Actualiza las opciones de filtro cuando cambia el feed
  useEffect(() => {
    const bars = [...new Set(feed.map((item) => item.bar_name).filter(Boolean))];
    const countries = [...new Set(feed.map((item) => item.country).filter(Boolean))];
    const friends = [...new Set(feed.map((item) => item.user_handle).filter(Boolean))];
    const beers = [...new Set(feed.map((item) => item.beer_details?.name).filter(Boolean))];

    setFilterOptions({ bars, countries, friends, beers });
  }, [feed]);

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

  const handleFilter = (type, value) => {
    setFilter((prev) => ({ ...prev, [type]: value }));
  };

  const handleClearFilter = (type) => {
    setFilter((prev) => {
      const newFilter = { ...prev };
      delete newFilter[type]; // Remueve el filtro específico
      return newFilter;
    });
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
          const updatedFeed = [newPost, ...prev].sort(
            (a, b) => new Date(b.published_at) - new Date(a.published_at)
          );
          return updatedFeed;
        });
      });
    };

    subscribe();
  }, []);

  useEffect(() => {
    setFilteredFeed(applyFilter(feed)); // Aplica el filtro cada vez que cambia el feed o el filtro
  }, [feed, filter]);

  const handlePress = (item) => {
    if (item.type === 'event_post') {
      if (item.event_id && typeof item.event_id === 'number') {
        navigation.navigate('EventsLayout', {
          screen: 'EventDetails',
          params: { eventId: item.event_id },
        });
      } else {
        console.error('El evento no tiene un ID válido. Datos recibidos:', item);
      }
    } else if (item.type === 'beer_review') {
      if (item.beer_id && typeof item.beer_id === 'number') {
        navigation.navigate('BeersLayout', {
          screen: 'BeerDetails',
          params: { beerId: item.beer_id },
        });
      } else {
        console.error('La reseña no tiene un ID de cerveza válido. Datos recibidos:', item);
      }
    }
  };
  
  
  const renderFeedItem = ({ item }) => {
    if (item.type === 'event_post') {
      return (
        <TouchableOpacity
          style={styles.feedItem}
          activeOpacity={0.9}
          onPress={() => handlePress(item)}
        >
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
    <TouchableOpacity
      style={styles.feedItem}
      activeOpacity={0.9}
      onPress={() => handlePress(item)}
    >
      <Text style={styles.userHandle}>@{item.user_handle}</Text>
      <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
        {item.description || 'Sin descripción'}
      </Text>
      <Text style={styles.beerDetails}>
        {item.beer_details?.name} ({item.beer_details?.avg_rating || 'N/A'}/5)
      </Text>
      <Text style={styles.barName}>
        {item.bar_name || 'No bar info'}, {item.country || 'No country info'}
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
    <View style={styles.container}>
      {/* Modal de filtro */}
      <Modal
        visible={filterModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalContainer}>
        <ScrollView contentContainerStyle={styles.modalContent}>
          <Text style={styles.modalTitle}>Selecciona un filtro</Text>
          
          <Text style={styles.modalSubtitle}>Bares</Text>
          {filterOptions.bars?.map((bar) => (
            <TouchableOpacity key={bar} onPress={() => handleFilter('bar', bar)}>
              <Text style={styles.modalOption}>{bar}</Text>
            </TouchableOpacity>
          ))}
          
          <Text style={styles.modalSubtitle}>Países</Text>
          {filterOptions.countries?.map((country) => (
            <TouchableOpacity key={country} onPress={() => handleFilter('country', country)}>
              <Text style={styles.modalOption}>{country}</Text>
            </TouchableOpacity>
          ))}
          
          <Text style={styles.modalSubtitle}>Amistades</Text>
          {filterOptions.friends?.map((friend) => (
            <TouchableOpacity key={friend} onPress={() => handleFilter('friend', friend)}>
              <Text style={styles.modalOption}>{friend}</Text>
            </TouchableOpacity>
          ))}
          
          <Text style={styles.modalSubtitle}>Cervezas</Text>
          {filterOptions.beers?.map((beer) => (
            <TouchableOpacity key={beer} onPress={() => handleFilter('beer', beer)}>
              <Text style={styles.modalOption}>{beer}</Text>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity
            style={styles.closeModalButton}
            onPress={() => setFilterModalVisible(false)}
          >
            <Text style={styles.closeModalText}>Cerrar</Text>
          </TouchableOpacity>
        </ScrollView>

        </View>
      </Modal>
      
      {/* Filtro */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Text style={styles.filterText}>Seleccionar filtro</Text>
        </TouchableOpacity>
        {Object.entries(filter).map(([key, value]) => (
          <TouchableOpacity
            key={key}
            style={styles.activeFilter}
            onPress={() => handleClearFilter(key)}
          >
            <Text style={styles.activeFilterText}>
              {key}: {value} ✕
            </Text>
          </TouchableOpacity>
        ))}
      </View>


      {/* Lista */}
      <FlatList
        data={filteredFeed}
        keyExtractor={(item, index) => `${item.type}-${item.id}-${index}`}
        renderItem={renderFeedItem}
        contentContainerStyle={styles.feedContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  filterContainer: { flexDirection: 'row', padding: 10, justifyContent: 'space-between' },
  filterButton: { backgroundColor: '#FF9800', padding: 10, borderRadius: 5 },
  filterText: { color: '#FFF', fontSize: 14 },
  clearFilterButton: { backgroundColor: '#E53935', padding: 10, borderRadius: 5 },
  clearFilterText: { color: '#FFF', fontSize: 14 },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)', justifyContent: 'center' },
  modalContent: { padding: 20 },
  modalTitle: { fontSize: 20, color: '#FF9800', marginBottom: 10 },
  modalSubtitle: { fontSize: 16, color: '#FFF', marginTop: 20 },
  modalOption: { fontSize: 14, color: '#FFA726', marginVertical: 5 },
  closeModalButton: { marginTop: 20, alignItems: 'center' },
  closeModalText: { color: '#FFF' },
  activeFilter: { backgroundColor: '#FF9800', padding: 8, borderRadius: 5, marginHorizontal: 5, },
  activeFilterText: { color: '#FFF', fontSize: 12, },
  
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
