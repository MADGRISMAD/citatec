import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'
// 1. Importa tu componente global
import IpModal from '@/views/IpModal.vue'

// 2. Crea la app
const app = createApp(App)

// 3. Regístralo globalmente
app.component('IpModal', IpModal)

// 4. Usa el router (u otros plugins que tengas)
app.use(router)

// 5. Monta la app
app.mount('#app')
