import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NuevaCita from '../views/NuevaCita.vue'
import TicketGenerado from '../views/TicketGenerado.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/home',
    name: 'home',
    component: HomeView
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
    path: '/ticket-generado',
    name: 'TicketGenerado',
    component: TicketGenerado
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
