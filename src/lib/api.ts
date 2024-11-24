'use strict'

import { ApiResp } from './consts'
import { fetchHttp } from './utils'

export const ApiGetCaptch = (): Promise<ApiResp> => fetchHttp({ url: '/a/captcha', method: 'get', hideLoading: true })//获取验证码
export const ApiLogin = (data: any): Promise<ApiResp> => fetchHttp({ url: '/a/login', method: 'post', body: data })//登入
export const ApiUserInfo = (): Promise<ApiResp> => fetchHttp({ url: '/a/member_info', method: 'get', hideLoading: true })//获取个人信息
export const ApiUpdateInfo = (data: any): Promise<ApiResp> => fetchHttp({ url: '/a/change_info', method: 'post', body: data })//修改个人信息
// export const ApiUserLogs = (data: any): Promise<ApiResp> => fetchHttp({ url: '/a/member_logs', method: 'get', query: data })//个人日志export const 
export const ApiAddPermissionGroup = (data: any): Promise<ApiResp> => fetchHttp({ url: '/a/add_permission_group', method: 'post', body: data })//添加|修改权限分组
export const ApiPermissionGroups = (data: any): Promise<ApiResp> => fetchHttp({ url: '/a/permission_groups', method: 'get', query: data })//权限分组列表
export const ApiAddPermission = (data: any): Promise<ApiResp> => fetchHttp({ url: '/a/add_permission', method: 'post', body: data })//添加|修改权限
export const ApiPermissionList = (data: any): Promise<ApiResp> => fetchHttp({ url: '/a/permission_list', method: 'get', query: data })//权限列表
export const ApiPermissionAll = (): Promise<ApiResp> => fetchHttp({ url: '/a/permission_all', method: 'get' })//所有权限
export const ApiAddRole = (data: any): Promise<ApiResp> => fetchHttp({ url: '/a/add_role', method: 'post', body: data })//添加|修改角色
export const ApiRoleList = (data: any): Promise<ApiResp> => fetchHttp({ url: '/a/role_list', method: 'get', query: data })//角色列表
export const ApiRoleAll = (): Promise<ApiResp> => fetchHttp({ url: '/a/role_all', method: 'get' })//所有角色
export const ApiAddMember = (data: any) => fetchHttp({ url: '/a/add_member', method: 'post', body: data })//添加|修改成员
export const ApiMemberList = (data: any): Promise<ApiResp> => fetchHttp({ url: '/a/members_list', method: 'get', query: data })//成员列表
export const ApiDelSys = (data: any): Promise<ApiResp> => fetchHttp({ url: '/a/del_sys', method: 'post', body: data })//删除成员|角色|权限
export const ApiMemberLogs = (data: any): Promise<ApiResp> => fetchHttp({ url: '/a/member_logs', method: 'get', query: data })//删除成员|角色|权限