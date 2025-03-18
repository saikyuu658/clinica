import {  createRouter, createWebHistory, } from "vue-router";
import LoginViewVue from "./view/LoginView.vue";

import TriagemViewVue from "./view/TriagemView.vue";
import HomeViewVue from "./view/HomeView.vue";
import UsuariosViewVue from "./view/UsuariosView.vue";
import DashboardViewVue from './view/DashboardView.vue'
import ProntuarioViewVue from "./view/ProntuarioView.vue"
import CmeViewVue from "./view/equipamentos/CmeView.vue";
import MeuInstrumentosView from "./view/equipamentos/MeuInstrumentosView.vue";
const routes = [
  {
    path: "/",
    name: "Login",
    component: LoginViewVue,
  },
  {
    path: "/home/",
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
        path: "esteriziar", 
        component: CmeViewVue,
      },
      {
        path: "myinstrumentos", 
        component: MeuInstrumentosView,
      },
      {
        path: "prontuario", 
        component: ProntuarioViewVue,
      },
      
    ]
  },
];

const router = createRouter({
  routes,
  history: createWebHistory()
});

export default router;