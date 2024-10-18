// app/(app)/beers/_layout.js
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchBeer from './searchBeer'; 
import BeerDetails from './[beerId]';


const Stack = createNativeStackNavigator();

export default function BeersLayout() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SearchBeer" component={SearchBeer} options={{ title: 'Cervezas'}} />
      <Stack.Screen name="BeerDetails" component={BeerDetails} options={{ title: 'Detalles de la Cerveza' }} />
    </Stack.Navigator>
  );
}
