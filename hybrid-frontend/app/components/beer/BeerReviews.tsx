// components/beer/BeerReviews.tsx
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function BeerReviewsTab({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return <Text style={styles.text}>No hay reseñas para esta cerveza.</Text>;
  }

  return (
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
  );
}

const styles = StyleSheet.create({
  reviewItem: { padding: 10, backgroundColor: '#1C1C1C', marginVertical: 5, borderRadius: 8 },
  reviewUser: { fontSize: 18, color: '#FF9800', fontWeight: 'bold' },
  reviewRating: { fontSize: 16, color: '#FFFFFF' },
  reviewText: { fontSize: 14, color: '#FFFFFF' },
  text: { fontSize: 18, color: '#FFFFFF', textAlign: 'center', marginTop: 20 },
});
