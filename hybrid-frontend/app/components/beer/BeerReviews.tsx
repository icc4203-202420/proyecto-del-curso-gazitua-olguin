import { View, Text, FlatList, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

type BeerReviewsTabProps = {
  reviews?: Array<{
    id: string;
    rating: number;
    text: string;
    user: { handle: string };
  }>;
  refreshing?: boolean;
  onRefresh?: () => void;
};

export default function BeerReviewsTab({ 
  reviews, 
  refreshing = false,
  onRefresh 
}: BeerReviewsTabProps) {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <View style={styles.starsContainer}>
        {Array.from({ length: fullStars }).map((_, i) => (
          <Ionicons key={`full-${i}`} name="star" size={18} color="#FF9800" />
        ))}
        {halfStar && <Ionicons name="star-half" size={18} color="#FF9800" />}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Ionicons key={`empty-${i}`} name="star-outline" size={18} color="#FF9800" />
        ))}
      </View>
    );
  };

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
            refreshing={refreshing}
            onRefresh={onRefresh}
            renderItem={({ item }) => (
              <View style={styles.reviewItem}>
                <View style={styles.headerWrapper}>
                  <Text style={styles.reviewUser}>@{item.user.handle}</Text>
                  <View style={styles.ratingWrapper}>
                    {renderStars(item.rating || 0)}
                    <Text style={styles.ratingText}>{item.rating}</Text>
                  </View>
                </View>
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
    headerWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    ratingWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    starsContainer: {
      flexDirection: 'row',
      marginRight: 8,
    },
    ratingText: {
      fontSize: 16,
      color: '#FFFFFF',
      marginLeft: 4,
    },
    reviewUser: { fontSize: 18, color: '#FF9800', fontWeight: 'bold' },
    reviewText: { fontSize: 14, color: '#FFFFFF' },
  });
  