import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { businessRoutes } from './business'

const baseRoutes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/pages/login/LoginView.vue')
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('../views/pages/aaView.vue')
  }
]

const allRouters = [...baseRoutes, ...businessRoutes]

export const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes: allRouters
})
