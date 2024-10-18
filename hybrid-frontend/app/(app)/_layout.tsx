import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { useSession } from '../../hooks/useSession';
import HomePage from './index';
import UserPage from './profile';
import BeersLayout from './beers/_layout';

const Tab = createBottomTabNavigator();

export default function AppLayout() {
  const { session } = useSession();
  const router = useRouter();

  if (!session) {
    return <Redirect href="/login" />;
  }

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
      <Tab.Screen name="User" component={UserPage} />
    </Tab.Navigator>
  );
}