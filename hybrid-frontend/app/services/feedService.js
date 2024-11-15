// app/services/feedService.js
import * as SecureStore from 'expo-secure-store';

const WEBSOCKET_URL = 'ws://192.168.1.83:3001/cable';

let ws; // Variable global para el WebSocket
let reconnectAttempts = 0; // Intentos de reconexión

const maxReconnectAttempts = 5; // Número máximo de intentos de reconexión

const connectToWebSocket = async (onReceived) => {
  const token = await SecureStore.getItemAsync('token');
  ws = new WebSocket(`${WEBSOCKET_URL}?token=${token}`);

  ws.onopen = () => {
    console.log("Conectado al WebSocket");
    reconnectAttempts = 0; // Resetear intentos de reconexión al conectar

    ws.send(
      JSON.stringify({
        command: 'subscribe',
        identifier: JSON.stringify({ channel: 'FeedChannel' }),
      })
    );
  };

  ws.onmessage = (event) => {
    const response = JSON.parse(event.data);
    console.log("WebSocket message received:", response);

    if (response.type === 'ping' || response.type === 'confirm_subscription') return; // Ignorar pings y confirmaciones de suscripción

    if (response.message && typeof response.message === 'object') {
      console.log("Publicación recibida en el frontend:", response.message);
      onReceived(response.message);
    } else {
      console.log("Mensaje no procesado o sin datos relevantes:", response);
    }
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  ws.onclose = (e) => {
    console.log("WebSocket connection closed", e);

    // Intento de reconexión automática si la conexión se cierra inesperadamente
    if (reconnectAttempts < maxReconnectAttempts) {
      reconnectAttempts += 1;
      setTimeout(() => {
        console.log(`Intentando reconectar: intento ${reconnectAttempts}`);
        connectToWebSocket(onReceived);
      }, 1000 * reconnectAttempts); // Tiempo de espera incremental
    } else {
      console.log("Máximo número de intentos de reconexión alcanzado.");
    }
  };
};

// Función exportada para suscribirse al feed
export const subscribeToFeed = async (onReceived) => {
  if (!ws || ws.readyState === WebSocket.CLOSED) {
    await connectToWebSocket(onReceived);
  } else {
    console.log("Ya está conectado al WebSocket.");
  }
};
