// app/(app)/events/_layout.tsx

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchEvent from './searchEvent';
import EventDetails from './[eventId]';
import addpictureModal from '../../components/modal/addpictureModal'; 

type EventsStackParamList = {
  SearchEvent: undefined;
  EventDetails: { eventId: string };
  addpictureModal: { eventId: string }
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
      {/* Configuramos el modal con la opción de presentación */}
      <Stack.Screen
        name="addpictureModal"
        component={addpictureModal}
        options={{ 
          presentation: 'modal', 
          title: 'Agrega una foto',
        }}
      />
    </Stack.Navigator>
  );
}
