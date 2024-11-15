import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { useSession } from '../../hooks/useSession';
import HomePage from './index';
import UserPage from './profile';
import BeersLayout from './beers/_layout'; // Incluye BeersLayout
import BarsLayout from './bars/_layout'; // Incluye BarsLayout
import UsersLayout from './users/_layout'; // Importamos UsersLayout
import EventsLayout from './events/_layout'; // Importamos UsersLayout
import FeedPage from './FeedPage';

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
      <Stack.Screen name="EventsLayout" component={EventsLayout} options={{ headerShown: false }} />
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
              case 'Feed':
              iconName = focused ? 'newspaper' : 'newspaper-outline';
              break;
              case 'Me':
                iconName = focused ? 'person' : 'person-outline';
              break;
              case 'Users':
                iconName = focused ? 'search' : 'search-outline';
              break;
              case 'Beers':
                iconName = focused ? 'beer' : 'beer-outline';
              break;
              case 'Bars':
                iconName = focused ? 'location' : 'location-outline';
              break;
              case 'Events':
                iconName = focused ? 'calendar' : 'calendar-outline';
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
      <Tab.Screen name="Feed" component={FeedPage} />
      <Tab.Screen name="Beers" component={BeersLayout} />
      <Tab.Screen name="Bars" component={BarsLayout} />
      <Tab.Screen name="Events" component={EventsLayout} />
      <Tab.Screen name="Users" component={UsersLayout} />
      <Tab.Screen name="Me" component={UserPage} />
    </Tab.Navigator>
  );
}
