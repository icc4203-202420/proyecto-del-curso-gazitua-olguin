// app/(app)/events/_layout.tsx

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchEvent from './searchEvent';
import EventDetails from './[eventId]';

type EventsStackParamList = {
  SearchEvent: undefined;
  EventDetails: { eventId: string };
};

const Stack = createNativeStackNavigator<EventsStackParamList>();

export default function EventsLayout() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#000' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="SearchEvent" component={SearchEvent} options={{ title: 'Eventos' }} />
      <Stack.Screen name="EventDetails" component={EventDetails} options={{ title: 'Detalles del Evento' }} />
    </Stack.Navigator>
  );
}
