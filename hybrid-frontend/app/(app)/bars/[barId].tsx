import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
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

  return (
    <View style={styles.container}>
      {/* Header con el nombre del bar */}
      <View style={styles.header}>
        <Text style={styles.title}>{bar.name}</Text>
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
  header: { padding: 16 },
  title: { fontSize: 24, color: '#FF9800', fontWeight: 'bold' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 18, color: '#FFFFFF', marginTop: 10 },
  errorText: { color: '#FFFFFF', textAlign: 'center', marginTop: 20 },
});
