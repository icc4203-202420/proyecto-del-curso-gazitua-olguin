rails:
rails s -b 0.0.0.0 -p 3001

frontend:
npx expo start -c

en archivo app/services/feedService.js

const WEBSOCKET_URL = 'ws://192.168.1.83:3001/cable';

en archivo config/environments/development.rb
Rails.application.routes.default_url_options[:host] = '192.168.x.x' # Usa tu IP local

en archivo app/services/api.js:
const api = axios.create({
baseURL: 'http://192.168.1.96:3001/api/v1',
});

cambiar la baseURL por tu IP

Usuario de prueba
josefa.olguin@gmail.com
qwerty

Otros usuarios para probar las notificaciones de josefa.olguin (@joolguin)

adrianne@gmail.com
qwerty

dali.barrera@gmail.com
qwerty

En la sección para probar la app, es importante especificar que, debido a la configuración de Expo Notifications, solo se pudo asignar el push token al usuario josefa.olguin@gmail.com. Esto se debe a limitaciones en el manejo de múltiples tokens para distintos usuarios en un mismo dispositivo. Por lo tanto, para probar las notificaciones de etiquetados o solicitudes de amistad, usa alguno de los otros usuarios de prueba o crea uno nuevo. Asegúrate de buscar y etiquetar a josefa.olguin@gmail.com, cuyo handle es @joolguin (incluyendo el @). Las notificaciones aparecerán aunque Josefa no esté conectada a la app, ya que están vinculadas al push token. Sin embargo, si interactúas con cualquier otro usuario, las notificaciones no se mostrarán. Esto confirma que las notificaciones se envían correctamente al usuario que tiene el token asignado.

No olvidar de configurar el archivo app.json
y actualizar

"extra": {
"eas": {
"projectId": "d5f34a5b-ad68-4081-b0c4-2c56d2d06529"
}
},

para poder utilizarlo en expo

y en hooks/useSession.js actualizar la direccion del backend:

// Obtener y guardar el token de notificación
const pushToken = await registerForPushNotificationsAsync();
if (pushToken) {
// Enviar el token al backend
await fetch('http://192.168.1.85:3001/api/v1/users/push_token', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'Authorization': `Bearer ${token}`
},
body: JSON.stringify({ push_token: pushToken })
});
}
