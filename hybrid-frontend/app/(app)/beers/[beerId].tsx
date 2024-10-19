// app/(app)/beers/[beerId].tsx
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
      {/* Header con el nombre y rating */}
      <View style={styles.header}>
        <Text style={styles.title}>{beer.name}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={24} color="#FF9800" />
          <Text style={styles.ratingText}>
            {beer.avg_rating ? beer.avg_rating.toFixed(1) : 'N/A'} / 5
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: { fontSize: 24, color: '#FF9800', fontWeight: 'bold' },
  ratingContainer: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 18, color: '#FFFFFF', marginLeft: 8 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 18, color: '#FFFFFF', marginTop: 10 },
  errorText: { color: '#FFFFFF', textAlign: 'center', marginTop: 20 },
  floatingButton: { position: 'absolute', bottom: 20, right: 20 },
});
