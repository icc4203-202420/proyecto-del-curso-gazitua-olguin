// components/beer/BeerBars.tsx
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function BeerBarsTab({ bars }) {
  if (!bars || bars.length === 0) {
    return <Text style={styles.text}>No hay bares disponibles.</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
      data={bars}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.barItem}>
          <Text style={styles.barName}>{item.name}</Text>
        </View>
      )}
    />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000'},
  barItem: { padding: 10, backgroundColor: '#1C1C1C', marginVertical: 16, borderRadius: 10 },
  barName: { fontSize: 18, color: '#FF9800' },
  text: { fontSize: 18, color: '#FFFFFF', textAlign: 'center', marginTop: 20 },
});
