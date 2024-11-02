import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchUser from './searchUser';

type UsersStackParamList = {
  SearchUser: undefined;
  UserDetails: { userId: string };
};

const Stack = createNativeStackNavigator<UsersStackParamList>();

export default function UsersLayout() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#000' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="SearchUser" component={SearchUser} options={{ title: 'Usuarios' }} />
    </Stack.Navigator>
  );
}
