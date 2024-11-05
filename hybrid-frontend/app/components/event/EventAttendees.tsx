// app/components/event/EventAttendees.tsx

import { View, Text, FlatList, StyleSheet } from 'react-native';

type Attendee = { id: string; handle: string };
type AttendeesProps = { friends: Attendee[]; others: Attendee[] };

export default function EventAttendeesTab({ attendees }: { attendees: AttendeesProps }) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Amigos</Text>
      <FlatList
        data={attendees.friends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={styles.attendee}>@{item.handle}</Text>}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay amigos confirmados.</Text>}
      />

      <Text style={styles.sectionTitle}>Otros asistentes</Text>
      <FlatList
        data={attendees.others}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={styles.attendee}>@{item.handle}</Text>}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay otros asistentes confirmados.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  sectionTitle: { fontSize: 18, color: '#FF9800', marginTop: 24 },
  attendee: { fontSize: 14, color: '#FFFFFF', paddingVertical: 4 },
  emptyText: { color: '#FFFFFF', textAlign: 'center', marginTop: 10 },
});
