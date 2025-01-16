import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import RegisterView from '../views/RegisterView.vue'
import NuevaCita from '../views/NuevaCita.vue'
import TicketGenerado from '../views/TicketGenerado.vue'
import Dashboard from '../views/DashboardView.vue'
import Login from '../views/LoginView.vue'
import Reporte from '../views/ReportesCitas.vue'
import user from '../views/UserProfile.vue'
import materias from '../views/MateriasDisponibles.vue'
import TramitesView from '@/views/TramitesView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  },
  {
    path: '/',
    name: 'Landing',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/LandingPage.vue')
  },
  {
    path: '/nueva-cita',
    name: 'NuevaCita',
    component: NuevaCita
  },
  {
    path: '/ticket',
    name: 'TicketGenerado',
    component: TicketGenerado
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path : '/reporte',
    name : 'Reporte',
    component : Reporte
  },
  {
    path: '/tramites',
    name: 'Tramites',
    component: TramitesView
  },
  {
    path : '/user',
    name : 'user',
    component : user
  },
  {
    path : '/materias',
    name : 'materias',
    component : materias
  }]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
