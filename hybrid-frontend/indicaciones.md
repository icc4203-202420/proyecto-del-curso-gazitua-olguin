rails:
rails s -b 0.0.0.0 -p 3001

frontend:
npx expo start -c

en archivo app/services/api.js:
const api = axios.create({
baseURL: 'http://192.168.1.96:3001/api/v1',
});

cambiar la baseURL por tu IP
