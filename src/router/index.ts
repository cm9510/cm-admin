import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { businessRoutes } from './business'

const baseRoutes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/login/LoginView.vue')
  },
  {
    path: '/user',
    component: () => import('../pages/LayoutView.vue'),
    children: [
      {
        path: '',
        name: 'user',
        meta: { title: '个人中心'},
        component: () => import('../pages/Home.vue'),
      }
    ]
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('../pages/aaView.vue')
  }
]

const allRouters = [...baseRoutes, ...businessRoutes]

export const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes: allRouters
})
