// app/(app)/_layout.js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import { useSession } from '../../hooks/useSession';
import HomePage from './index';
import UserPage from './profile';  // Nueva página de User (Perfil)
import BeersList from './beers/_layout';   // Nueva página de Beers (Cervezas)

const Tab = createBottomTabNavigator();

export default function AppLayout() {
  const { session, logout } = useSession();

  // Si no hay sesión, redirige al login
  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'User') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Beers') {
            iconName = focused ? 'beer' : 'beer-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF9800',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,  // Oculta el header por defecto
      })}
    >
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Beers" component={BeersList} />
      <Tab.Screen name="User" component={UserPage} />
    </Tab.Navigator>
  );
}
