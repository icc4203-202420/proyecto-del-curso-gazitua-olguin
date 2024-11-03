// app/(app)/events/[eventId].tsx

import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import api from '../../services/api';
import EventInfoTab from '../../components/event/EventInfo';
import EventAttendeesTab from '../../components/event/EventAttendees';
import { useSession } from '../../../hooks/useSession';

const Tab = createMaterialTopTabNavigator();

type EventDetailsRouteParams = {
  EventDetails: { eventId: string };
};

type Event = {
  id: string;
  name: string;
  description: string;
  date: string;
};

export default function EventDetails() {
  const route = useRoute<RouteProp<EventDetailsRouteParams, 'EventDetails'>>();
  const { eventId } = route.params;
  const [event, setEvent] = useState<Event | null>(null);
  const [attendees, setAttendees] = useState<{ friends: any[]; others: any[] }>({ friends: [], others: [] });
  const [isAttending, setIsAttending] = useState(false);
  const [loading, setLoading] = useState(true);
  const { session } = useSession();
  const userId = session?.user_id;

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventResponse = await api.get(`/events/${eventId}`);
        setEvent(eventResponse.data.event);

        const attendeesResponse = await api.get(`/events/${eventId}/attendees`);
        const hasCheckedIn = attendeesResponse.data.friends.concat(attendeesResponse.data.others)
          .some(user => user.id === parseInt(userId));
        setIsAttending(hasCheckedIn);

        setAttendees(attendeesResponse.data);
      } catch (error) {
        console.error('Error al cargar los detalles del evento:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleCheckIn = async () => {
    try {
      await api.post(`/events/${eventId}/check_in`);
      setIsAttending(true); 
    } catch (error) {
      console.error('Error al confirmar asistencia:', error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#FF9800" style={styles.loading} />;
  }

  if (!event) {
    return <Text style={styles.errorText}>No se encontraron detalles para este evento.</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Header con el nombre del evento y botón de asistencia */}
      <View style={styles.header}>
        <Text style={styles.title}>{event.name}</Text>
        {isAttending ? (
          <View style={styles.attendanceBadge}>
            <Text style={styles.attendanceConfirmed}>Asistencia confirmada</Text>
          </View>
        ) : (
          <TouchableOpacity onPress={handleCheckIn} style={styles.attendButton}>
            <Text style={styles.attendButtonText}>Confirmar asistencia</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Tab Navigator */}
      <Tab.Navigator
        screenOptions={{
          tabBarIndicatorStyle: { backgroundColor: '#FF9800' },
          tabBarLabelStyle: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
          tabBarStyle: { backgroundColor: '#000' },
        }}
      >
        <Tab.Screen name="Info" children={() => <EventInfoTab event={event} />} />
        <Tab.Screen name="Asistentes" children={() => <EventAttendeesTab attendees={attendees} />} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' }, // Fondo oscuro más suave
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    flex: 1,
    fontSize: 26,
    color: '#FF9800',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  attendanceBadge: {
    backgroundColor: '#2C2C2C',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  attendanceConfirmed: { color: '#FF9800', fontSize: 14, fontWeight: '600' },
  attendButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 2,
  },
  attendButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '500' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#FFFFFF', textAlign: 'center', marginTop: 20 },
});

