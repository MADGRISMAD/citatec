import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { getFingerprint } from "./fingerprint";


const customAxios = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
  },
});

customAxios.interceptors.request.use(async (config : InternalAxiosRequestConfig) => {
  try {
    const deviceId = await getFingerprint();
    if(config.headers["Content-Type"] != 'multipart/form-data')
    config.headers["device-id"] = deviceId;
    
    return config;
  } catch (error) {
    console.error("Error al obtener fingerprint:", error);
    return config;
  }
});


export default customAxios as AxiosInstance;