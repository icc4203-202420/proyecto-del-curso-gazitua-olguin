// app/(app)/_layout.js
import { Slot, Redirect } from 'expo-router';
import { useSession } from '../../hooks/useSession';
import { View, StyleSheet, Text } from 'react-native';
import { Button } from '@rneui/themed';

export default function AppLayout() {
  const { session, logout } = useSession();

  // Si no hay sesión, redirige al login
  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.email}>{session.email}</Text>
        <Button title="Salir" onPress={logout} />
      </View>
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#333',
  },
  email: {
    color: 'white',
  },
});
