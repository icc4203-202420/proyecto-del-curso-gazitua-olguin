import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import BeerInfoTab from '../../components/beer/BeerInfo';
import BeerBarsTab from '../../components/beer/BeerBars';
import BeerReviewsTab from '../../components/beer/BeerReviews';

const Tab = createMaterialTopTabNavigator();

type BeerDetailsRouteParams = {
  BeerDetails: { beerId: string };
};

type Beer = {
  name: string;
  avg_rating?: number;
  style?: string;
  alcohol?: string;
  hop?: string;
  yeast?: string;
  maltes?: string;
  ibu?: string;
  brewery?: { name: string };
  bars?: { id: string; name: string }[];
  reviews?: { id: string; rating: number; text: string; user: { handle: string } }[];
};

export default function BeerDetails() {
  const route = useRoute<RouteProp<BeerDetailsRouteParams, 'BeerDetails'>>();
  const { beerId } = route.params;
  const navigation = useNavigation();
  const [beer, setBeer] = useState<Beer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBeerDetails = async () => {
      try {
        const response = await api.get(`/beers/${beerId}`);
        setBeer(response.data.beer);
      } catch (error) {
        console.error('Error al cargar los detalles de la cerveza:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBeerDetails();
  }, [beerId]);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <View style={styles.starsContainer}>
        {Array.from({ length: fullStars }).map((_, i) => (
          <Ionicons key={`full-${i}`} name="star" size={18} color="#FF9800" />
        ))}
        {halfStar && <Ionicons name="star-half" size={18} color="#FF9800" />}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Ionicons key={`empty-${i}`} name="star-outline" size={18} color="#FF9800" />
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#FF9800" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  if (!beer) {
    return <Text style={styles.errorText}>No se encontraron detalles para esta cerveza.</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Header con nombre, brewery y rating */}
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {beer.name}
        </Text>
        {beer.brewery?.name && <Text style={styles.brewery}>{beer.brewery.name}</Text>}
        <View style={styles.ratingWrapper}>
          {renderStars(beer.avg_rating || 0)}
          <Text style={styles.ratingText}>
            {beer.avg_rating ? beer.avg_rating.toFixed(1) : 'N/A'} 
          </Text>
        </View>
      </View>

      {/* Configuración del Top Tab Navigator */}
      <Tab.Navigator
        screenOptions={{
          tabBarIndicatorStyle: { backgroundColor: '#FF9800' },
          tabBarLabelStyle: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
          tabBarStyle: { backgroundColor: '#000' },
        }}
      >
        <Tab.Screen name="Info" children={() => <BeerInfoTab beer={beer} />} />
        <Tab.Screen name="Bars" children={() => <BeerBarsTab bars={beer.bars} />} />
        <Tab.Screen name="Reseñas" children={() => <BeerReviewsTab reviews={beer.reviews} />} />
      </Tab.Navigator>

      {/* Botón flotante para abrir el modal */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('ReviewModal', { beerId })}
      >
        <Ionicons name="add-circle" size={60} color="#FF9800" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 42,
    color: '#FF9800',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  brewery: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  ratingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 18, color: '#FFFFFF', marginTop: 10 },
  errorText: { color: '#FFFFFF', textAlign: 'center', marginTop: 20 },
  floatingButton: { position: 'absolute', bottom: 20, right: 20 },
});
