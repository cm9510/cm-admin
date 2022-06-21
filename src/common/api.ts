'use strict'

import { fetchHttp } from './utils'

export default {
    getCaptch: (data: any) => fetchHttp({ url: '/m/show_captcha', fields: data }, false),//获取验证码
    login:  (data: any) => fetchHttp({ url: '/a/login', method:'post', fields: data }),//登入

    addPermission:  (data: any) => fetchHttp({ url: '/a/add_permission', method:'post', fields: data }),//添加|修改权限
    permissionList:  (data: any) => fetchHttp({ url: '/a/permission_list', fields: data }),//权限列表
    permissionAll:  () => fetchHttp({ url: '/a/permission_all' }),//所有权限
    addRole:  (data: any) => fetchHttp({ url: '/a/add_role', method:'post', fields: data }),//添加|修改角色
    roleList:  (data: any) => fetchHttp({ url: '/a/role_list', fields: data }),//角色列表
    roleAll:  () => fetchHttp({ url: '/a/role_all' }),//所有角色
    addMember:  (data: any) => fetchHttp({ url: '/a/add_member', method:'post', fields: data }),//添加|修改成员
    memberList:  (data: any) => fetchHttp({ url: '/a/members_list', fields: data }),//成员列表
    delSys:  (data: any) => fetchHttp({ url: '/a/del_sys', method:'post', fields: data }),//删除成员|角色|权限
}