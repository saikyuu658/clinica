import axios from "axios";

export const http = axios.create({
  // baseURL: "https://192.168.200.35:3200",
  // baseURL: "https://portal.if.edu.br:3200",
  // baseURL: "https://localhost:3200",
  baseURL: "http://njs.flucianofeijao.com.br:21015"

 
});

export function setHeader(token_acess) {
  http.defaults.headers.common["authorization"] = `Bearer ${token_acess}`;
}
