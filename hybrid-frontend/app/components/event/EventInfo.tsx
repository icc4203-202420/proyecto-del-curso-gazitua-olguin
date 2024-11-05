// app/components/event/EventInfo.tsx

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type BarsStackParamList = {
  BarsLayout: { screen: string; params: { barId: string } };
};

type Bar = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

type Event = {
  name: string;
  description: string;
  date: string;
  bar: Bar;
};

export default function EventInfoTab({ event }: { event: Event }) {
  const navigation = useNavigation<NativeStackNavigationProp<BarsStackParamList>>();

  const handleNavigateToBar = () => {
    navigation.navigate('BarsLayout', {
      screen: 'BarDetails',
      params: { barId: event.bar.id },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.date}>{new Date(event.date).toLocaleString()}</Text>
      <Text style={styles.description}>{event.description}</Text>

      {/* Información del Bar */}
      <Text style={styles.sectionTitle}>Ubicación del Evento</Text>
      <TouchableOpacity onPress={handleNavigateToBar}>
        <View style={styles.barItem}>
          <Text style={styles.barName}>Bar: {event.bar?.name || 'No disponible'}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  date: { fontSize: 16, color: '#FFFFFF', marginTop: 8 },
  description: { fontSize: 14, color: '#FFFFFF', marginVertical: 16 },
  sectionTitle: { fontSize: 18, color: '#FF9800', marginTop: 24 },
  barItem: {
    padding: 10,
    backgroundColor: '#1C1C1C',
    marginVertical: 8,
    borderRadius: 8,
  },
  barName: { fontSize: 16, color: '#FF9800', fontWeight: 'bold' },
});
