import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import './assets/tailwind.css'
// import dgram from 'dgram';
// const client = dgram.createSocket('udp4');

// client.on('listening', () => {
//   client.setBroadcast(true);
// });

// client.on('message', (msg:string, rinfo: { address: any }) => {
//   try {
//     const data = JSON.parse(msg.toString());
//     if (data.type === 'backend-discovery') {
//       const backendUrl = `http://${rinfo.address}:${data.port}`;
//       // Guardar la URL del backend
//     }
//   } catch (e) {
//     console.error('Mensaje inválido recibido');
//   }
// });

// client.bind(45678);

createApp(App).use(router).mount('#app')
