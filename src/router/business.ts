import { RouteRecordRaw } from 'vue-router'


export const businessRoutes: Array<RouteRecordRaw> = [
    {
      path: '/system',
      redirect: '/system/members',
      meta: {title:'系统管理', icon:'setting'},
      component: () => import('../pages/LayoutView.vue'),
      children: [
        {
          path: 'members',
          name: 'sysMembers',
          meta: { title: '成员'},
          component:() => import('../pages/system/Members.vue')
        },
        {
          path: 'role',
          name: 'sysRole',
          meta: { title: '角色列表'},
          component:() => import('../pages/system/Roles.vue')
        },
        {
          path: 'permission',
          name: 'sysPermission',
          meta: { title: '权限列表'},
          component:() => import('../pages/system/Permission.vue')
        },
        {
          path: 'logs',
          name: 'sysLogs',
          meta: { title: '日志'},
          component:() => import('../pages/system/Logs.vue')
        },
      ]
    }  
  ]
  