# Instrucciones para Configuración y Uso del Proyecto

## Configuración del Backend (Rails)

1. Inicia el servidor de Rails con el siguiente comando:

   ```bash
   rails s -b 0.0.0.0 -p 3001
   ```

2. En el archivo `config/environments/development.rb`, actualiza la URL por tu IP local:

   ```ruby
   Rails.application.routes.default_url_options[:host] = '192.168.x.x' # Usa tu IP local
   ```

3. Asegúrate de cambiar `x.x` por la dirección IP local de tu máquina.

---

## Configuración del Frontend (Expo)

### **Se está utilizando la version 51 de expo**

1. Inicia Expo con el siguiente comando:

   ```bash
   npx expo start -c
   ```

2. En el archivo `app.json`, actualiza la configuración con tu ID de proyecto para Expo:

   ```json
   "extra": {
     "eas": {
       "projectId": "d5f34a5b-ad68-4081-b0c4-2c56d2d06529"
     }
   },
   ```

3. En el archivo `hooks/useSession.js`, actualiza la dirección del backend:
   ```javascript
   const pushToken = await registerForPushNotificationsAsync();
   if (pushToken) {
     await fetch("http://192.168.1.85:3001/api/v1/users/push_token", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
         Authorization: "Bearer ${token}",
       },
       body: JSON.stringify({ push_token: pushToken }),
     });
   }
   ```

---

## Configuración de Servicios

### WebSockets

1. En el archivo `app/services/feedService.js`, configura la URL del WebSocket con tu IP local:
   ```javascript
   const WEBSOCKET_URL = "ws://192.168.1.83:3001/cable";
   ```

### API Base URL

1. En el archivo `app/services/api.js`, actualiza la baseURL por tu IP local:
   ```javascript
   const api = axios.create({
     baseURL: "http://192.168.1.96:3001/api/v1",
   });
   ```

---

## Usuarios de Prueba

### Usuario Principal:

- **Email:** josefa.olguin@gmail.com
- **Contraseña:** qwerty
- **Handle:** @joolguin

### Otros Usuarios para Pruebas:

1. **Email:** adrianne@gmail.com  
   **Contraseña:** qwerty
2. **Email:** dali.barrera@gmail.com  
   **Contraseña:** qwerty

---

## Notificaciones Push

### Notas Importantes:

- El push token se asigna al **primer usuario** que inicia sesión en la aplicación en un dispositivo.
- Para probar notificaciones:
  - Usa cualquiera de los otros usuarios de prueba para etiquetar o enviar solicitudes de amistad al usuario asignado con el push token (por ejemplo, **josefa.olguin@gmail.com**).
  - Las notificaciones aparecerán en el dispositivo del usuario con el push token incluso si no está conectado.

---

## Consideraciones Adicionales

1. **Direcciones IP:** Recuerda actualizar todas las direcciones IP mencionadas en los archivos de configuración con la IP local.

---

¡Disfruta desarrollando y probando la aplicación!
