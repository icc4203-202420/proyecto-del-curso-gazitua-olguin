import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchBeer from './searchBeer';
import BeerDetails from './[beerId]';
import ReviewModal from '../../components/modal/reviewModal'; 

// Definimos los tipos del Stack Navigator
type BeersStackParamList = {
  SearchBeer: undefined;
  BeerDetails: { beerId: string };
  ReviewModal: { beerId: string };
};

const Stack = createNativeStackNavigator<BeersStackParamList>();

export default function BeersLayout() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SearchBeer" component={SearchBeer} options={{ title: 'Cervezas' }} />
      <Stack.Screen name="BeerDetails" component={BeerDetails} options={{ title: 'Detalles de la Cerveza' }} />
      {/* Configuramos el modal con la opción de presentación */}
      <Stack.Screen
        name="ReviewModal"
        component={ReviewModal}
        options={{ 
          presentation: 'modal', // Estilo de modal
          title: 'Escribir Reseña',
        }}
      />
    </Stack.Navigator>
  );
}