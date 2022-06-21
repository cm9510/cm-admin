'use strict'

import { useUserStore } from '@/store'
import { LoadingPlugin, MessagePlugin } from 'tdesign-vue-next'
import { API_RES } from './common'

/**
 * 提示层
 */
export const Toast = (msg:string, code:number):void => {
    if(code === API_RES.SUCCESS){
        MessagePlugin.success(msg)
    }else if(code === API_RES.FAIL){
        MessagePlugin.error(msg)
    }
}

/**
 * 格式化时间
 * @param {时间戳} timestamp
 * @param {格式} type
 * @param {是否返回时间} getTime
 * @returns 
 */
export const datetime = (timestamp:any, type = 1, getTime = true) => {
    if(!timestamp) return '-'

    const _date = new Date(parseInt(timestamp)*1000)
    const y = _date.getFullYear()
    const m = _date.getMonth() + 1
    const d = _date.getDate()
    let h = null
    let i = null
    let s = null
    if(getTime){
        h = _date.getHours() < 10 ? '0'+_date.getHours() : _date.getHours()
        i = _date.getMinutes() < 10 ? '0'+_date.getMinutes() : _date.getMinutes()
        s = _date.getSeconds() < 10 ? '0'+_date.getSeconds() : _date.getSeconds()
    }
    switch(type){
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
export const fetchHttp = (option:any, loading = true, loadTxt = '加载中') => {
    let loadInst:any = null
    if(loading){
        loadInst = LoadingPlugin({ attach: 'body', text: loadTxt });
    }
    const userStore = useUserStore()
    const init:any = {}
    init.headers = {
        'Content-Type': 'application/json',
        'token':userStore.token
    }
    init.method = option.method ? option.method : 'get'
    if(option.fields && Object.keys(option.fields).length > 0){
        if(init.method.toLowerCase() === 'post'){
            init.body = JSON.stringify(option.fields)
        }else{
            let str = ''
            for (const k in option.fields) {
                str += `&${k}=${option.fields[k]}`
            }
            option.url += '?'+str.slice(1)
        }
    }

    return new Promise((resolve, reject) => {
        fetch(option.url, init).then(res => {
            if(loading){
                loadInst.hide()
            }
            if(res.ok && res.status >= 200 && res.status < 300){
                resolve(res.json())
            }else{
                reject(res.statusText)
            }
        }).catch(err => {
            console.log('err=>',err);
            MessagePlugin.error('Error: 请求发送失败')
        })
    })
}