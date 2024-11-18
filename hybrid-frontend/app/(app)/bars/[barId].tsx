import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute, RouteProp } from '@react-navigation/native';
import api from '../../services/api';
import BarBeersTab from '../../components/bar/BarBeers';
import BarEventsTab from '../../components/bar/BarEvents';

const Tab = createMaterialTopTabNavigator();

type BarDetailsRouteParams = {
  BarDetails: { barId: string };
};

type Bar = {
  name: string;
  address?: { line1: string; line2: string; city: string };
  image_url?: string;
  beers?: { id: string; name: string; style: string }[];
  events?: { id: string; name: string; date: string; description: string }[];
};

export default function BarDetails() {
  const route = useRoute<RouteProp<BarDetailsRouteParams, 'BarDetails'>>();
  const { barId } = route.params;
  const [bar, setBar] = useState<Bar | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBarDetails = async () => {
      try {
        const response = await api.get(`/bars/${barId}`);
        setBar(response.data);
      } catch (error) {
        console.error('Error al cargar los detalles del bar:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBarDetails();
  }, [barId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9800" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  if (!bar) {
    return <Text style={styles.errorText}>No se encontraron detalles para este bar.</Text>;
  }

  const renderAddress = (address) => {
    if (!address) return <Text style={styles.noAddress}>Dirección no disponible</Text>;

    const { line1, line2, city } = address;
    const formattedAddress = [line1, line2, city].filter(Boolean).join(', ');

    return (
      <View style={styles.addressContainer}>
        <MaterialIcons name="location-on" size={20} color="#FF9800" />
        <Text style={styles.address}>{formattedAddress}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header con el nombre del bar y dirección */}
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {bar.name}
        </Text>
        {renderAddress(bar.address)}
      </View>

      {/* Configuración del Top Tab Navigator */}
      <Tab.Navigator
        screenOptions={{
          tabBarIndicatorStyle: { backgroundColor: '#FF9800' },
          tabBarLabelStyle: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
          tabBarStyle: { backgroundColor: '#000' },
        }}
      >
        <Tab.Screen name="Cervezas" children={() => <BarBeersTab beers={bar.beers} />} />
        <Tab.Screen name="Eventos" children={() => <BarEventsTab events={bar.events} />} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 42,
    color: '#FF9800',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  address: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
    textAlign: 'center',
  },
  noAddress: {
    fontSize: 16,
    color: '#FF9800',
    marginTop: 8,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 10,
  },
  errorText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
  },
});
