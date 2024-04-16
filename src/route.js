import { createWebHistory, createRouter } from "vue-router";
import LoginViewVue from "./view/LoginView.vue";

import TriagemViewVue from "./view/principal/TriagemView.vue";
import HomeViewVue from "./view/HomeView.vue";
import UsuariosViewVue from "./view/cadastros/UsuariosView.vue";
import DashboardViewVue from './view/DashboardView.vue'
import SterilizeViewVue from "./view/equipamentos/SterilizeView.vue";
import ManutencaoViewVue from "./view/equipamentos/ManutencaoView.vue";
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
      {
        path: "cme", 
        component: SterilizeViewVue
      },
      {
        path: "manutencao", 
        component: ManutencaoViewVue
      }
      
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;