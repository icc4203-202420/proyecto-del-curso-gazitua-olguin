// components/beer/BeerInfo.tsx
import { View, Text, StyleSheet } from 'react-native';

export default function BeerInfoTab({ beer }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Estilo: {beer.style || 'No disponible'}</Text>
      <Text style={styles.text}>Alcohol: {beer.alcohol || 'No disponible'}</Text>
      <Text style={styles.text}>Hop: {beer.hop || 'No disponible'}</Text>
      <Text style={styles.text}>Yeast: {beer.yeast || 'No disponible'}</Text>
      <Text style={styles.text}>Maltes: {beer.maltes || 'No disponible'}</Text>
      <Text style={styles.text}>IBU: {beer.alcohol || 'No disponible'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#000', flex: 1 },
  text: { fontSize: 24, color: '#FFFFFF', marginBottom: 24, marginHorizontal: 16, marginTop: 16 },
});
