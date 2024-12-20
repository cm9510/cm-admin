'use strict'

import { LoadingInstance, LoadingPlugin, MessagePlugin } from 'tdesign-vue-next'
import { API_FAIL_CODE, API_SUCCESS_CODE, RequestParams } from './consts'
import { useUserStore } from '@/store/user'

/**
 * 提示层
 */
export const Toast = (msg: string, code: number): void => {
    if (code === API_SUCCESS_CODE) {
        MessagePlugin.success(msg)
    } else if (code === API_FAIL_CODE) {
        MessagePlugin.error(msg)
    }
}
export const ApiToast = (msg: string, code: number): void => {
    if (code === API_SUCCESS_CODE) {
        MessagePlugin.success(msg)
    } else if (code === API_FAIL_CODE) {
        MessagePlugin.error(msg)
    }
}

//防抖函数
export const debounce = (func: Function, delay: number) => {
    let timerId: any = null;
    return function (this: any, ...args: any[]) {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

/**
 * 格式化时间
 * @param {时间戳} timestamp
 * @param {格式} type
 * @param {是否返回时间} getTime
 * @returns 
 */
export const datetime = (timestamp: any, type = 1, getTime = true) => {
    if (!timestamp) return '-'

    const _date = new Date(parseInt(timestamp) * 1000)
    const y = _date.getFullYear()
    const m = _date.getMonth() + 1
    const d = _date.getDate()
    let h = null
    let i = null
    let s = null
    if (getTime) {
        h = _date.getHours() < 10 ? '0' + _date.getHours() : _date.getHours()
        i = _date.getMinutes() < 10 ? '0' + _date.getMinutes() : _date.getMinutes()
        s = _date.getSeconds() < 10 ? '0' + _date.getSeconds() : _date.getSeconds()
    }
    switch (type) {
        case 1: return getTime ? `${y}-${m}-${d}/${h}:${i}` : `${y}-${m}-${d}`
        case 2: return getTime ? `${y}年${m}月${d}日 ${h}点${i}分` : `${y}年${m}月${d}日`
        case 3: return getTime ? `${y}/${m}/${d} ${h}:${i}:${s}` : `${y}/${m}/${d}`
        default: return '-'
    }
}

/**
 * http请求
 * @param option 参数
 * @param loading 是否展示loading
 * @param loadTxt loading文字
 * @returns
 */
export const fetchHttp = (params: RequestParams, showLoading = true, loadTxt = '加载中'): Promise<any> => {
    const { header, query, path, method, url, body } = params
    const userStore = useUserStore()
    const requestOptions: RequestInit = {
        method,
        headers: {'token': userStore.token,...header},
        body: undefined,
    }

    let finalUrl = url
    if (path) {
        finalUrl += path
    }
    if (query) {
        const queryParams = Object.entries(query).map(([key, value]:any) => `${key}=${encodeURIComponent(value)}`).join('&')
        finalUrl += `?${queryParams}`
    }

    if (body) {
        if (typeof body === 'object') {
            if (Object.keys(body).length > 0) {
                requestOptions.body = JSON.stringify(body);
                requestOptions.headers = {
                    ...requestOptions.headers,
                    'Content-Type': 'application/json;charset=utf-8',
                }
            }
        } else if (body instanceof FormData) {
            requestOptions.body = body
        }
    }

    let loadInst: LoadingInstance|null = null
    if (showLoading) {
        loadInst = LoadingPlugin({ attach: 'body', text: loadTxt });
    }
    return fetch(finalUrl, requestOptions).then((response) => {
        if (!response.ok) {
            MessagePlugin.error(`响应异常：[${response.status}]`)
        }
        if (loadInst) {
            loadInst.hide()
        }
        return response.json()
    }).catch((error) => {
        if (loadInst) {
            loadInst.hide()
        }
        MessagePlugin.error('网络请求错误')
        console.log('Request Error:', error)
        throw new Error(error)
    })
}

//计算时间戳距离当前多少天
export const calculateDays = (timestamp: number): number =>{
    const oneDayInMillis = 86400000; // 一天的毫秒数
    const currentDate = new Date(); // 当前日期
    const targetDate = new Date(timestamp * 1000); // 目标日期
    // 将目标日期设置为 00:00:00
    targetDate.setHours(0, 0, 0, 0);
    // 将当前日期设置为 00:00:00
    currentDate.setHours(0, 0, 0, 0);
    // 计算两个日期的时间差，并取整得到天数
    const timeDiffInMillis = currentDate.getTime() - targetDate.getTime();    
    return Math.ceil(timeDiffInMillis / oneDayInMillis);
}
  