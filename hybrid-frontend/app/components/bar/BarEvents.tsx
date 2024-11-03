// app/components/bar/BarEventsTab.tsx

import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type EventsStackParamList = {
  EventsLayout: { screen: string; params: { eventId: string } };
};

export default function BarEventsTab({ events }) {
  const navigation = useNavigation<NativeStackNavigationProp<EventsStackParamList>>();

  if (!events || events.length === 0) {
    return <Text style={styles.text}>No hay eventos próximos en este bar.</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('EventsLayout', {
                screen: 'EventDetails',
                params: { eventId: item.id },
              })
            }
          >
            <View style={styles.eventItem}>
              <Text style={styles.eventName}>{item.name}</Text>
              <Text style={styles.eventDate}>
                {new Date(item.date).toLocaleDateString()} - {new Date(item.date).toLocaleTimeString()}
              </Text>
              <Text style={styles.eventDescription}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  eventItem: { marginBottom: 16, padding: 12, backgroundColor: '#1C1C1C', borderRadius: 8 },
  eventName: { fontSize: 18, color: '#FF9800', fontWeight: 'bold' },
  eventDate: { fontSize: 16, color: '#FFFFFF', marginVertical: 4 },
  eventDescription: { fontSize: 14, color: '#FFFFFF' },
  text: { fontSize: 18, color: '#FFFFFF', textAlign: 'center', marginTop: 20 },
});
