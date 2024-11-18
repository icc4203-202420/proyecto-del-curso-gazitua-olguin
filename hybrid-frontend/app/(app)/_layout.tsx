import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { useSession } from '../../hooks/useSession';
import UserPage from './profile';
import BeersLayout from './beers/_layout'; // Incluye BeersLayout
import BarsLayout from './bars/_layout'; // Incluye BarsLayout
import UsersLayout from './users/_layout'; // Importamos UsersLayout
import EventsLayout from './events/_layout'; // Importamos EventsLayout
import FeedPage from './FeedPage';
import { KeyboardAvoidingView, Platform } from 'react-native';

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
      <Stack.Screen name="BeersLayout" component={BeersLayout} options={{ headerShown: false }} />
      <Stack.Screen name="BarsLayout" component={BarsLayout} options={{ headerShown: false }} />
      <Stack.Screen name="EventsLayout" component={EventsLayout} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -200} // Ajuste para evitar superposición
    >
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            switch (route.name) {
              case 'Feed':
                iconName = focused ? 'newspaper' : 'newspaper-outline';
                break;
              case 'Yo':
                iconName = focused ? 'person' : 'person-outline';
                break;
              case 'Usuarios':
                iconName = focused ? 'search' : 'search-outline';
                break;
              case 'Cervezas':
                iconName = focused ? 'beer' : 'beer-outline';
                break;
              case 'Bars':
                iconName = focused ? 'location' : 'location-outline';
                break;
              case 'Eventos':
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
          tabBarHideOnKeyboard: true, 
          tabBarStyle: {
            bottom: 0,
            height: 60,
            backgroundColor: '#1C1C1C', 
            borderTopWidth: 0, 
          },
        })}
      >
        <Tab.Screen name="Feed" component={FeedPage} />
        <Tab.Screen name="Cervezas" component={BeersLayout} />
        <Tab.Screen name="Bars" component={BarsLayout} />
        <Tab.Screen name="Eventos" component={EventsLayout} />
        <Tab.Screen name="Usuarios" component={UsersLayout} />
        <Tab.Screen name="Yo" component={UserPage} />
      </Tab.Navigator>
    </KeyboardAvoidingView>
  );
}
