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