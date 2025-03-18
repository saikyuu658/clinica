import { createApp } from "vue";
import App from "./App.vue";
import router from "./route";
import PrimeVue from "primevue/config";
import Tooltip from "primevue/tooltip";
import "primevue/resources/themes/aura-light-blue/theme.css";
import ToastService from "primevue/toastservice";
import "./style.css"

const app = createApp(App)
  .use(PrimeVue)
  .use(router)
  .use(ToastService)
  .directive("tooltip", Tooltip);

  // app.config.globalProperties.API_URL = "http://192.168.102.235:3200";
  app.config.globalProperties.API_URL = "http://192.168.200.35:3200";
app.mount("#app");
