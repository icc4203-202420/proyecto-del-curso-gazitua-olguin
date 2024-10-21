// components/beer/BeerBars.tsx
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function BeerBarsTab({ bars }) {
  if (!bars || bars.length === 0) {
    return <Text style={styles.text}>No hay bares disponibles.</Text>;
  }

  return (
    <FlatList
      data={bars}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.barItem}>
          <Text style={styles.barName}>{item.name}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  barItem: { padding: 10, backgroundColor: '#1C1C1C', marginVertical: 5, borderRadius: 8 },
  barName: { fontSize: 18, color: '#FF9800' },
  text: { fontSize: 18, color: '#FFFFFF', textAlign: 'center', marginTop: 20 },
});
