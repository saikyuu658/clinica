import { createWebHistory, createRouter } from "vue-router";
import LoginViewVue from "./view/LoginView.vue";

import TriagemViewVue from "./view/principal/TriagemView.vue";
import HomeViewVue from "./view/HomeView.vue";
import UsuariosViewVue from "./view/cadastros/UsuariosView.vue";
import DashboardViewVue from './view/DashboardView.vue'
const routes = [
  {
    path: "/",
    name: "Login",
    component: LoginViewVue,
  },
  {
    path: "/home",
    name: "Main",
    component: HomeViewVue,
    children: [
      {
        path: "triagem", 
        component: TriagemViewVue
      },
      {
        path: "", 
        component: DashboardViewVue
      },
      {
        path: "usuario", 
        component: UsuariosViewVue
      },
      
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;