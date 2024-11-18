import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
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
      {/* Fecha del evento */}
      <View style={styles.infoRow}>
        <MaterialIcons name="event" size={24} color="#FF9800" />
        <Text style={styles.date}>{new Date(event.date).toLocaleString()}</Text>
      </View>

      {/* Descripción del evento */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Descripción del Evento</Text>
        <Text style={styles.description}>
          {event.description || 'Sin descripción disponible'}
        </Text>
      </View>

      {/* Información del Bar */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Ubicación del Evento</Text>
        <TouchableOpacity onPress={handleNavigateToBar}>
          <View style={styles.barItem}>
            <MaterialIcons name="location-on" size={28} color="#FF9800" />
            <Text style={styles.barName}>{event.bar?.name || 'No disponible'}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#1C1C1C',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  date: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 12,
  },
  sectionContainer: {
    marginBottom: 24,
    padding: 12,
    backgroundColor: '#1C1C1C',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#FF9800',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 22,
    textAlign: 'justify',
  },
  barItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  barName: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 12,
    fontWeight: 'bold',
  },
});
