import { View, Text, FlatList, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type Attendee = { id: string; handle: string };
type AttendeesProps = { friends: Attendee[]; others: Attendee[] };

export default function EventAttendeesTab({ attendees }: { attendees: AttendeesProps }) {
  return (
    <View style={styles.container}>
      {/* Sección de amigos */}
      <Text style={styles.sectionTitle}>Amigos</Text>
      <FlatList
        data={attendees.friends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.attendeeContainer}>
            <MaterialIcons name="person" size={20} color="#FF9800" />
            <Text style={styles.attendee}>@{item.handle}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="group-off" size={40} color="#FF9800" />
            <Text style={styles.emptyText}>No hay amigos confirmados.</Text>
          </View>
        }
      />

      {/* Sección de otros asistentes */}
      <Text style={styles.sectionTitle}>Otros asistentes</Text>
      <FlatList
        data={attendees.others}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.attendeeContainer}>
            <MaterialIcons name="person-outline" size={20} color="#FFFFFF" />
            <Text style={styles.attendee}>@{item.handle}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="group" size={40} color="#FFFFFF" />
            <Text style={styles.emptyText}>No hay otros asistentes confirmados.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#FF9800',
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 10,
    textAlign: 'center',
  },
  attendeeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  attendee: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
});
