import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { useSession } from '../../hooks/useSession';
import HomePage from './index';
import UserPage from './profile';
import BeersLayout from './beers/_layout';  // Incluye BeersLayout
import BarsLayout from './bars/_layout';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function AppLayout() {
  const { session } = useSession();
  const router = useRouter();

  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainTabs} />
      {/* Aquí registramos BeersLayout para que sea accesible globalmente */}
      <Stack.Screen name="BeersLayout" component={BeersLayout} options={{ headerShown: false }} />
      <Stack.Screen name="BarsLayout" component={BarsLayout} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'User':
              iconName = focused ? 'person' : 'person-outline';
              break;
            case 'Beers':
              iconName = focused ? 'beer' : 'beer-outline';
              break;
            case 'Bars':
              iconName = focused ? 'location' : 'location-outline';
              break;
            default:
              iconName = 'help-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF9800',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Beers" component={BeersLayout} />
      <Tab.Screen name="Bars" component={BarsLayout} />
      <Tab.Screen name="User" component={UserPage} />
    </Tab.Navigator>
  );
}
