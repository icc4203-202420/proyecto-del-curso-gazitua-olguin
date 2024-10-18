// app/(app)/profile.js
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@rneui/themed';
import { useSession } from '../../hooks/useSession';

export default function UserPage() {
  const { session, logout } = useSession();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Perfil del Usuario</Text>
      <Text style={styles.email}>Correo: {session?.email}</Text>
      <Button 
        title="Cerrar Sesión" 
        onPress={logout} 
        buttonStyle={styles.logoutButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  text: {
    color: '#FF9800',
    fontSize: 24,
    marginBottom: 10,
  },
  email: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#FF4436',
  },
});
