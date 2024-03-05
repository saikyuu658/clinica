import { createApp } from 'vue'
import App from './App.vue'
import router from './route'
import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';
import 'primevue/resources/themes/aura-light-blue/theme.css'
import ToastService from 'primevue/toastservice';

createApp(App)
    .use(router)
    .use(PrimeVue)
    .use(ToastService)
    .directive('tooltip', Tooltip)
    .mount('#app')
