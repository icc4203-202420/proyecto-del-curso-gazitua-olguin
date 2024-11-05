// app/(app)/events/searchEvent.tsx

import { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { SearchBar } from '@rneui/themed';
import api from '../../services/api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type EventsStackParamList = {
  EventDetails: { eventId: string };
};

export default function SearchEvent() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<EventsStackParamList>>();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        setEvents(response.data.events);
      } catch (error) {
        console.error('Error al cargar los eventos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#FF9800" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Buscar evento..."
        value={search}
        onChangeText={setSearch}
        platform="default"
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchBarInput}
        lightTheme
      />
      <FlatList
        style={styles.Flatlist}
        data={filteredEvents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}>
            <View style={styles.eventItem}>
              <Text style={styles.eventName}>{item.name}</Text>
              <Text style={styles.eventDate}>{new Date(item.date).toLocaleString()}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No se encontraron eventos.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
    backgroundColor: '#000',
  },
  searchBarContainer: { backgroundColor: '#000', borderBottomColor: 'transparent', borderTopColor: 'transparent' },
  searchBarInput: { backgroundColor: '#1C1C1C' },
  Flatlist: { paddingTop: 16 },
  eventItem: { padding: 12, backgroundColor: '#1C1C1C', marginBottom: 10, borderRadius: 8 },
  eventName: { fontSize: 18, color: '#FF9800', fontWeight: 'bold' },
  eventDate: { fontSize: 14, color: '#FFFFFF' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#FFFFFF', textAlign: 'center', marginTop: 20 },
});
