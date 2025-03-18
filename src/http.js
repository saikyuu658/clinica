import axios from "axios";

export const http = axios.create({
  // baseURL: "http://192.168.102.235:3200",
  baseURL: "http://192.168.200.35:3200",

 
});

export function setHeader(token_acess) {
  http.defaults.headers.common["authorization"] = `Bearer ${token_acess}`;
}
