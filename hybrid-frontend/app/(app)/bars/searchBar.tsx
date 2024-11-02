import { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import api from '../../services/api'; // Usamos la API configurada para las llamadas
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Definimos los tipos de parámetros de la navegación
type BarsStackParamList = {
  BarDetails: { barId: string };
};

export default function SearchBar() {
  const [bars, setBars] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<BarsStackParamList>>();

  useEffect(() => {
    const fetchBars = async () => {
      try {
        const response = await api.get('/bars');
        setBars(response.data.bars); 
      } catch (error) {
        console.error('Error al cargar los bares:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBars();
  }, []);

  const filteredBars = bars.filter((bar) =>
    bar.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#FF9800" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar bares..."
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredBars}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('BarDetails', { barId: item.id })}>
            <View style={styles.barItem}>
              <Text style={styles.barName}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No se encontraron bares.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#000' },
  searchInput: { backgroundColor: '#fff', padding: 8, borderRadius: 8, marginBottom: 16 },
  barItem: { padding: 12, backgroundColor: '#1C1C1C', marginBottom: 10, borderRadius: 8 },
  barName: { fontSize: 18, color: '#FF9800', fontWeight: 'bold' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#FFFFFF', textAlign: 'center', marginTop: 20 },
});
