import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  Image, 
  ActivityIndicator, 
  TouchableOpacity, 
  RefreshControl, 
  Modal, 
  ScrollView 
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { fetchFeedPosts, fetchFeedReviews, subscribeToFeed } from '../services/feedService';

export default function FeedPage() {
  const [feed, setFeed] = useState([]);
  const [filteredFeed, setFilteredFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState({});
  const [filterOptions, setFilterOptions] = useState({});
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // Función para aplicar filtros
  const applyFilter = (feedData) => {
    if (Object.keys(filter).length === 0) return feedData;
    return feedData.filter((item) => {
      if (filter.friend && item.user_handle !== filter.friend) return false;
      if (filter.bar && item.bar_name !== filter.bar) return false;
      if (filter.country && item.country !== filter.country) return false;
      if (filter.beer && item.beer_details?.name !== filter.beer) return false;
      return true;
    });
  };

  // Actualizar opciones de filtro cuando cambia el feed
  useEffect(() => {
    const bars = [...new Set(feed.map((item) => item.bar_name).filter(Boolean))];
    const countries = [...new Set(feed.map((item) => item.country).filter(Boolean))];
    const friends = [...new Set(feed.map((item) => item.user_handle).filter(Boolean))];
    const beers = [...new Set(feed.map((item) => item.beer_details?.name).filter(Boolean))];
    setFilterOptions({ bars, countries, friends, beers });
  }, [feed]);

  // Función para obtener los feeds
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

  // Manejar filtros
  const handleFilter = (type, value) => {
    setFilter((prev) => ({ ...prev, [type]: value }));
    setFilterModalVisible(false);
  };

  const handleClearFilter = (type) => {
    setFilter((prev) => {
      const newFilter = { ...prev };
      delete newFilter[type];
      return newFilter;
    });
  };

  const handleClearAllFilters = () => {
    setFilter({});
  };

  // Manejar refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchFeeds();
    setRefreshing(false);
  };

  // Efecto inicial
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

  // Actualizar feed filtrado
  useEffect(() => {
    setFilteredFeed(applyFilter(feed));
  }, [feed, filter]);

  // Manejar navegación
  const handlePress = (item) => {
    if (item.type === 'event_post' && item.event_id) {
      navigation.navigate('EventsLayout', {
        screen: 'EventDetails',
        params: { eventId: item.event_id },
      });
    } else if (item.type === 'beer_review' && item.beer_id) {
      navigation.navigate('BeersLayout', {
        screen: 'BeerDetails',
        params: { beerId: item.beer_id },
      });
    }
  };

  // Renderizar items del feed
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
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF9800" />
          <Text style={styles.loadingText}>Cargando tu feed...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Modal de filtros */}
      <Modal
        visible={filterModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <ScrollView 
            contentContainerStyle={[
              styles.modalContent,
              { paddingBottom: insets.bottom + 20 }
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtros</Text>
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setFilterModalVisible(false)}
              >
                <Icon name="close-outline" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSubtitle}>Bares</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {filterOptions.bars?.map((bar) => (
                  <TouchableOpacity
                    key={bar}
                    style={[
                      styles.filterOption,
                      filter.bar === bar && styles.filterOptionActive
                    ]}
                    onPress={() => handleFilter('bar', bar)}
                  >
                    <Text style={styles.filterOptionText}>{bar}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSubtitle}>Países</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {filterOptions.countries?.map((country) => (
                  <TouchableOpacity
                    key={country}
                    style={[
                      styles.filterOption,
                      filter.country === country && styles.filterOptionActive
                    ]}
                    onPress={() => handleFilter('country', country)}
                  >
                    <Text style={styles.filterOptionText}>{country}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSubtitle}>Amigos</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {filterOptions.friends?.map((friend) => (
                  <TouchableOpacity
                    key={friend}
                    style={[
                      styles.filterOption,
                      filter.friend === friend && styles.filterOptionActive
                    ]}
                    onPress={() => handleFilter('friend', friend)}
                  >
                    <Text style={styles.filterOptionText}>@{friend}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSubtitle}>Cervezas</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {filterOptions.beers?.map((beer) => (
                  <TouchableOpacity
                    key={beer}
                    style={[
                      styles.filterOption,
                      filter.beer === beer && styles.filterOptionActive
                    ]}
                    onPress={() => handleFilter('beer', beer)}
                  >
                    <Text style={styles.filterOptionText}>{beer}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      </Modal>

      <View style={styles.mainContent}>
        {/* Filtros activos */}
        {Object.keys(filter).length > 0 && (
          <View style={styles.activeFiltersContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterTagsContainer}
            >
              {Object.entries(filter).map(([key, value]) => (
                <TouchableOpacity
                  key={key}
                  style={styles.activeFilterTag}
                  onPress={() => handleClearFilter(key)}
                >
                  <Icon
                    name={
                      key === 'country'
                        ? 'earth-outline'
                        : key === 'bar'
                        ? 'location-outline'
                        : key === 'friend'
                        ? 'person-outline'
                        : 'beer-outline'
                    }
                    size={16}
                    color="#FFF"
                  />
                  <Text style={styles.activeFilterText}>{value}</Text>
                  <Icon name="close-circle" size={16} color="#FFF" />
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.clearAllFiltersButton}
                onPress={handleClearAllFilters}
              >
                <Text style={styles.clearAllFiltersText}>Limpiar filtros</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}

        {/* Botón de filtro */}
        <TouchableOpacity
          style={[styles.filterButton, { bottom: insets.bottom + 16, zIndex: 1000 }]}
          onPress={() => setFilterModalVisible(true)}
        >
          <Icon name="filter-outline" size={24} color="#FFF" />
        </TouchableOpacity>

        {/* Lista de feed */}
        <FlatList
          data={filteredFeed}
          keyExtractor={(item, index) => `${item.type}-${item.id}-${index}`}
          renderItem={renderFeedItem}
          contentContainerStyle={[
            styles.feedContainer,
            { paddingBottom: insets.bottom + 80 }
          ]}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={handleRefresh}
              tintColor="#FF9800"
            />
          }
          ListEmptyComponent={() => (
            <View style={styles.emptyFeedContainer}>
              <Image
                source={require('../../assets/empty-feed.png')}
                style={styles.emptyIcon}
              />
              <Text style={styles.noResultsText}>
                ¡No hay nada por aquí!
              </Text>
              <Text style={styles.suggestionText}>
                Sigue a tus amigos o visita eventos para empezar a llenar tu feed.
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  modalSection: {
    marginBottom: 16,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  filterOption: {
    backgroundColor: '#1E1E1E',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  filterOptionActive: {
    backgroundColor: '#FF9800',
  },
  filterOptionText: {
    color: '#FFF',
    fontSize: 14,
  },
  closeModalButton: {
    padding: 8,
  },
  activeFiltersContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#1E1E1E',
  },
  filterTagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeFilterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9800',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilterText: {
    color: '#FFF',
    fontSize: 14,
    marginLeft: 6,
    marginRight: 6,
  },
  clearAllFiltersButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#E53935',
    borderRadius: 20,
  },
  clearAllFiltersText: {
    color: '#FFF',
    fontSize: 14,
  },
  filterButton: {
    position: 'absolute',
    right: 16,
    backgroundColor: '#FF9800',
    padding: 12,
    borderRadius: 50,
    elevation: 5,
    zIndex: 1000,
  },
  feedContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  feedItem: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
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
    fontSize: 15,
    color: '#FFF',
    lineHeight: 22,
    marginBottom: 8,
  },
  userHandle: {
    fontSize: 14,
    color: '#9E9E9E',
    marginBottom: 6,
  },
  barName: {
    fontSize: 14,
    color: '#FFA726',
    marginBottom: 6,
  },
  timestamp: {
    fontSize: 12,
    color: '#BDBDBD',
    textAlign: 'right',
  },
  beerDetails: {
    fontSize: 16,
    color: '#FFCC80',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  emptyFeedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  noResultsText: {
    fontSize: 20,
    color: '#FF9800',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  suggestionText: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    fontSize: 16,
    color: '#FF9800',
    marginTop: 10,
  },
});

