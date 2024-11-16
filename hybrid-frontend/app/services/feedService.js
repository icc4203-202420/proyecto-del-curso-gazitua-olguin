// app/services/feedService.js
import * as SecureStore from 'expo-secure-store';

const WEBSOCKET_URL = 'ws://192.168.1.83:3001/cable';

let ws; // WebSocket global
let reconnectAttempts = 0; // Intentos de reconexión
const maxReconnectAttempts = 5;

const connectToWebSocket = async (onReceived) => {
  const token = await SecureStore.getItemAsync('token');
  ws = new WebSocket(`${WEBSOCKET_URL}?token=${token}`);

  ws.onopen = () => {
    console.log("Conectado al WebSocket");
    reconnectAttempts = 0;
    ws.send(
      JSON.stringify({
        command: 'subscribe',
        identifier: JSON.stringify({ channel: 'FeedChannel' }),
      })
    );
  };

  ws.onmessage = (event) => {
    const response = JSON.parse(event.data);
    console.log('Mensaje recibido:', response);
  
    if (response.message) {
      const { type } = response.message;
  
      if (type === 'event_post') {
        console.log('Publicación de evento:', response.message);
      } else if (type === 'beer_review') {
        console.log('Reseña de cerveza:', response.message);
      } else {
        console.warn('Tipo desconocido:', type, response.message);
      }
    } else {
      console.warn('Mensaje sin contenido procesable:', response);
    }
  };
  
  

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  ws.onclose = () => {
    console.log("WebSocket desconectado.");
    if (reconnectAttempts < maxReconnectAttempts) {
      reconnectAttempts += 1;
      setTimeout(() => connectToWebSocket(onReceived), 1000 * reconnectAttempts);
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

export const fetchFeedPosts = async () => {
  const token = await SecureStore.getItemAsync('token');
  const response = await fetch('http://192.168.1.83:3001/api/v1/feed_posts', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  console.log('Feed Posts Response:', data);
  return data;
};

export const fetchFeedReviews = async () => {
  const token = await SecureStore.getItemAsync('token');
  const response = await fetch('http://192.168.1.83:3001/api/v1/feed_reviews', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  console.log('Feed Reviews Response:', data);
  return data;
};
