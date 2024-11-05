import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    // Configura el comportamiento de notificaciones en primer plano
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
