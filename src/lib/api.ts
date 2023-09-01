'use strict'

import { fetchHttp } from './utils'

export default {
    getCaptch: (data: any):Promise<any> => fetchHttp({ url: '/m/show_captcha',method: 'get', query: data }, false),//获取验证码
    login: (data: any):Promise<any> => fetchHttp({ url: '/a/login', method: 'post', body: data }),//登入
    logout: ():Promise<any> => fetchHttp({ url: '/a/logout', method: 'post' }),//退出登入
    userInfo: ():Promise<any> => fetchHttp({ url: '/a/user_info',method: 'get' }, false),//获取个人信息
    updateInfo: (data:any):Promise<any> => fetchHttp({ url: '/a/change_info',method: 'post', body:data}),//修改个人信息
    userLogs: (data:any):Promise<any> => fetchHttp({ url: '/a/user_logs',method: 'get', query:data}),//个人日志

    addPermissionGroup: (data: any):Promise<any> => fetchHttp({ url: '/a/add_permission_group', method: 'post', body: data }),//添加|修改权限分组
    permissionGroups: (data:any):Promise<any> => fetchHttp({ url: '/a/permission_groups', method: 'get',query: data }),//权限分组列表
    addPermission: (data: any):Promise<any> => fetchHttp({ url: '/a/add_permission', method: 'post', body: data }),//添加|修改权限
    permissionList: (data: any):Promise<any> => fetchHttp({ url: '/a/permission_list',method: 'get', query: data }),//权限列表
    permissionAll: ():Promise<any> => fetchHttp({ url: '/a/permission_all',method: 'get' }),//所有权限
    addRole: (data: any):Promise<any> => fetchHttp({ url: '/a/add_role', method: 'post', body: data }),//添加|修改角色
    roleList: (data: any):Promise<any> => fetchHttp({ url: '/a/role_list',method: 'get', query: data }),//角色列表
    roleAll: ():Promise<any> => fetchHttp({ url: '/a/role_all' ,method: 'get'}),//所有角色
    addMember: (data: any) => fetchHttp({ url: '/a/add_member', method: 'post', body: data }),//添加|修改成员
    memberList: (data: any):Promise<any> => fetchHttp({ url: '/a/members_list',method: 'get', query: data }),//成员列表
    delSys: (data: any):Promise<any> => fetchHttp({ url: '/a/del_sys', method: 'post', body: data }),//删除成员|角色|权限
    memberLogs: (data: any):Promise<any> => fetchHttp({ url: '/a/member_logs', method: 'get', query: data }),//删除成员|角色|权限
}