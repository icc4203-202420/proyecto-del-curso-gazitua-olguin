// app/(app)/beers/[beerId].tsx
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import api from '../../services/api';

// Definimos los tipos de los parámetros de la ruta
type BeerDetailsRouteParams = {
  BeerDetails: {
    beerId: string;
  };
};

// Definimos los tipos de los datos de la API
type Review = {
  id: string;
  rating: number;
  text: string;
  user: {
    handle: string;
  };
};

type Bar = {
  id: string;
  name: string;
};

type Beer = {
  name: string;
  style?: string;
  alcohol?: string;
  brewery?: {
    name: string;
  };
  bars?: Bar[];
  reviews?: Review[];
};

export default function BeerDetails() {
  const route = useRoute<RouteProp<BeerDetailsRouteParams, 'BeerDetails'>>();
  const { beerId } = route.params;
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
    return <ActivityIndicator size="large" color="#FF9800" style={styles.loading} />;
  }

  if (!beer) {
    return <Text style={styles.errorText}>No se encontraron detalles para esta cerveza.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{beer.name}</Text>
      <Text style={styles.text}>Estilo: {beer.style || 'No disponible'}</Text>
      <Text style={styles.text}>Alcohol: {beer.alcohol || 'No disponible'}</Text>

      <Text style={styles.sectionTitle}>Cervecería:</Text>
      <Text style={styles.text}>{beer.brewery?.name || 'No disponible'}</Text>

      <Text style={styles.sectionTitle}>Bares que la sirven:</Text>
      {beer.bars && beer.bars.length > 0 ? (
        <FlatList
          data={beer.bars}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.barItem}>
              <Text style={styles.barName}>{item.name}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.text}>No hay bares disponibles para esta cerveza.</Text>
      )}

      <Text style={styles.sectionTitle}>Reseñas:</Text>
      {beer.reviews && beer.reviews.length > 0 ? (
        <FlatList
          data={beer.reviews}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.reviewItem}>
              <Text style={styles.reviewUser}>@{item.user.handle}</Text>
              <Text style={styles.reviewRating}>Puntuación: {item.rating}/5</Text>
              <Text style={styles.reviewText}>{item.text}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.text}>No hay reseñas para esta cerveza.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    color: '#FF9800',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#FF9800',
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
  },
  text: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
  },
  barItem: {
    padding: 10,
    backgroundColor: '#1C1C1C',
    borderRadius: 8,
    marginVertical: 5,
  },
  barName: {
    fontSize: 18,
    color: '#FF9800',
    fontWeight: 'bold',
  },
  barAddress: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  reviewItem: {
    padding: 10,
    backgroundColor: '#1C1C1C',
    borderRadius: 8,
    marginVertical: 5,
  },
  reviewUser: {
    fontSize: 18,
    color: '#FF9800',
    fontWeight: 'bold',
  },
  reviewRating: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  reviewText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
});
