import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Configuración para el manejo de notificaciones en primer plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Función para registrar el token de notificación push
export async function registerForPushNotificationsAsync() {
  // Configuración para Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // Solicitud de permisos
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  // Verificar si el usuario concedió los permisos
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notifications!');
    return null;
  }

  // Obtener el token de notificación de Expo
  const projectId = Constants.expoConfig.extra.eas.projectId || 'tu-project-id';
  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  return token;
}

// Función para enviar notificaciones locales (opcional)
export async function sendLocalNotification(title, body) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: null,
  });
}
