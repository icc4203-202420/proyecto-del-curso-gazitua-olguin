import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'; // Asegúrate de tener instalada esta librería
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type BeersStackParamList = {
  BarsLayout: { screen: string; params: { barId: string } };
};

export default function BeerBarsTab({ bars }) {
  const navigation = useNavigation<NativeStackNavigationProp<BeersStackParamList>>();

  if (!bars || bars.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="storefront-outline" size={60} color="#FF9800" />
        <Text style={styles.emptyText}>No hay bares disponibles.</Text>
        <Text style={styles.emptySubText}>
          Aún no se han registrado bares para esta cerveza. ¡Vuelve más tarde!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bars}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('BarsLayout', {
                screen: 'BarDetails',
                params: { barId: item.id },
              })
            }
          >
            <View style={styles.barItem}>
              <MaterialIcons name="location-on" size={28} color="#FF9800" />
              <Text style={styles.barName}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 20,
    color: '#FF9800',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
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
    fontSize: 18,
    color: '#FF9800',
  },
});
