export interface ApiRes {
    code:number,
    data:any,
    msg:string
}

export const API_RES = {
    SUCCESS:100,
    FAIL: 101
}

export const TOKEN_NAME = 'cm-token'

export declare interface RequestParams {
    url: string
    method: string
    header?: Record<string, string>
    path?: string
    query?: Record<string, any>
    body?: any
}