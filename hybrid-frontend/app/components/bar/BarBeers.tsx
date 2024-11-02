import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type BarsStackParamList = {
  BeersLayout: { screen: string; params: { beerId: string } };
};

export default function BarBeersTab({ beers }) {
  const navigation = useNavigation<NativeStackNavigationProp<BarsStackParamList>>();

  if (!beers || beers.length === 0) {
    return <Text style={styles.text}>No hay cervezas disponibles en este bar.</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={beers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('BeersLayout', {
                screen: 'BeerDetails',
                params: { beerId: item.id },
              })
            }
          >
            <View style={styles.beerItem}>
              <Text style={styles.beerName}>{item.name}</Text>
              <Text style={styles.beerStyle}>{item.style || 'Estilo no disponible'}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  beerItem: { padding: 12, backgroundColor: '#1C1C1C', marginBottom: 10, borderRadius: 8 },
  beerName: { fontSize: 18, color: '#FF9800', fontWeight: 'bold' },
  beerStyle: { fontSize: 14, color: '#FFFFFF' },
  text: { fontSize: 18, color: '#FFFFFF', textAlign: 'center', marginTop: 20 },
});
