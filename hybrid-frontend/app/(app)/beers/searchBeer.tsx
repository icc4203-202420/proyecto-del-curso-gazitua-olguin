import { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import api from '../../services/api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Definimos los tipos del Stack Navigator
type BeersStackParamList = {
  BeerDetails: { beerId: string };
};

export default function SearchBeer() {
  const [beers, setBeers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<BeersStackParamList>>(); // Tipamos la navegación

  useEffect(() => {
    const fetchBeers = async () => {
      try {
        const response = await api.get('/beers');
        setBeers(response.data.beers);
      } catch (error) {
        console.error('Error al cargar las cervezas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBeers();
  }, []);

  const filteredBeers = beers.filter((beer) =>
    beer.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#FF9800" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar cerveza..."
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        style={styles.Flatlist}
        data={filteredBeers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('BeerDetails', { beerId: item.id })}>
            <View style={styles.beerItem}>
              <Text style={styles.beerName}>{item.name}</Text>
              <Text style={styles.beerStyle}>{item.style || 'Estilo no disponible'}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No se encontraron cervezas.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:16,
    paddingHorizontal: 16,
    backgroundColor: '#000',
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  Flatlist:{
    paddingTop:16,
  },
  beerItem: {
    padding: 12,
    backgroundColor: '#1C1C1C',
    marginBottom: 10,
    borderRadius: 8,
  },
  beerName: {
    fontSize: 18,
    color: '#FF9800',
    fontWeight: 'bold',
  },
  beerStyle: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
  },
});
