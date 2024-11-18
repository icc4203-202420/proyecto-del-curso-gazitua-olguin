import { View, Text, StyleSheet } from 'react-native';

export default function BeerInfoTab({ beer }) {
  const renderInfoRow = (label, value) => (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={value !== 'No disponible' ? styles.value : styles.valueUnavailable}>
        {value || 'No disponible'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderInfoRow('ESTILO', beer.style)}
      {renderInfoRow('ALCOHOL', beer.alcohol)}
      {renderInfoRow('HOP', beer.hop)}
      {renderInfoRow('YEAST', beer.yeast)}
      {renderInfoRow('MALTES', beer.maltes)}
      {renderInfoRow('IBU', beer.ibu)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#000',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#1C1C1C',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    color: '#FF9800',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  valueUnavailable: {
    fontSize: 16,
    color: '#757575',
    fontStyle: 'italic',
  },
});
