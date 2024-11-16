import { View, Text, FlatList, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Asegúrate de tener instalada esta librería

export default function BeerReviewsTab({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="rate-review" size={50} color="#FF9800" />
        <Text style={styles.emptyText}>No hay reseñas para esta cerveza.</Text>
        <Text style={styles.emptySubText}>
          Sé el primero en dejar tu opinión y ayudar a otros cerveceros.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.reviewItem}>
            <Text style={styles.reviewUser}>@{item.user.handle}</Text>
            <Text style={styles.reviewRating}>Puntuación: {item.rating}/5</Text>
            <Text style={styles.reviewText}>{item.text}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
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
  reviewItem: {
    padding: 10,
    backgroundColor: '#1C1C1C',
    marginVertical: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewUser: { fontSize: 18, color: '#FF9800', fontWeight: 'bold' },
  reviewRating: { fontSize: 16, color: '#FFFFFF' },
  reviewText: { fontSize: 14, color: '#FFFFFF' },
});
