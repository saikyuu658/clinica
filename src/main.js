import { createApp } from 'vue'
import App from './App.vue'
import router from './route'
import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';
import 'primevue/resources/themes/aura-light-blue/theme.css'
import ToastService from 'primevue/toastservice';
const app = createApp(App)
    .use(router)
    .use(PrimeVue)
    .use(ToastService)
    .directive('tooltip', Tooltip)
    
app.config.globalProperties.API_URL = "http://192.168.102.87:3200"
app.mount('#app')
