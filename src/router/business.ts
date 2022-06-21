import { RouteRecordRaw } from 'vue-router'

import Layout from '../views/layout/LayoutView.vue'

export const businessRoutes: Array<RouteRecordRaw> = [
    {
      path: '/system',
      redirect: '/system/members',
      meta: {title:'系统管理', icon:'setting'},
      component: Layout,
      children: [
        {
          path: 'members',
          name: 'sysMembers',
          meta: { title: '成员'},
          component:() => import('../views/pages/system/MembersView.vue')
        },
        {
          path: 'role',
          name: 'sysRole',
          meta: { title: '角色列表'},
          component:() => import('../views/pages/system/RoleView.vue')
        },
        {
          path: 'permission',
          name: 'sysPermission',
          meta: { title: '权限列表'},
          component:() => import('../views/pages/system/PermissionView.vue')
        },
      ]
    },
    // {
    //   path: '/system',
    //   redirect: '',
    //   name: 'aaa',
    //   meta: {title:'平台管理', icon:'user'}
    // }
  ]
  