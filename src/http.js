

import axios from "axios"

export const http = axios.create({
    baseURL: "http://192.168.103.0:3200/",
})

export function setHeader(token_acess){
    http.defaults.headers.common['authorization'] = `Bearer ${token_acess}`

}


