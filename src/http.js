import axios from "axios";

export const http = axios.create({
  baseURL: "http://192.168.200.35:3200",
  // baseURL: "http://portal.if.edu.br:3200",
  // baseURL: "http://localhost:3200",

 
});

export function setHeader(token_acess) {
  http.defaults.headers.common["authorization"] = `Bearer ${token_acess}`;
}
