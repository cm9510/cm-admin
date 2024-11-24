export type ApiResp = {
    code: number,
    msg: string
    data?: any,
}

export const API_SUCCESS_CODE = 1000
export const API_FAIL_CODE = 1001

export const TOKEN_NAME = 'cm-token'

export type RequestParams = {
    url: string
    method: string
    header?: Record<string, string>
    path?: string
    query?: Record<string, any>
    body?: any
    hideLoading?: boolean
    loadTxt?: string
}