import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchBar from './searchBar';
import BarDetails from './[barId]';

// Definimos los tipos del Stack Navigator
type BarsStackParamList = {
  SearchBar: undefined;
  BarDetails: { barId: string };
};

const Stack = createNativeStackNavigator<BarsStackParamList>();

export default function BarsLayout() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#000' }, 
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' }, 
      }}
    >
      <Stack.Screen name="SearchBar" component={SearchBar} options={{ title: 'Bares' }} />
      <Stack.Screen name="BarDetails" component={BarDetails} options={{ title: 'Detalles del Bar' }} />
    </Stack.Navigator>
  );
}
