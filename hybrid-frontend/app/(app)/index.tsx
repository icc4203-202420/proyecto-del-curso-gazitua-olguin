import { View, Text, StyleSheet } from 'react-native';
import { useSession } from '../../hooks/useSession';
import { Button } from '@rneui/themed';

const HomePage = () => {
  const { session, logout } = useSession();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido, {session.email}</Text>
      <Button title="Salir" onPress={logout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    color: '#fff',
  },
});

export default HomePage;
