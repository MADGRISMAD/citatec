import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { getFingerprint } from "./fingerprint";

const BACKEND_HOST = process.env.BACKEND_HOST || "http://localhost:3000";

const customAxios = axios.create({
  baseURL: BACKEND_HOST + "/api",
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