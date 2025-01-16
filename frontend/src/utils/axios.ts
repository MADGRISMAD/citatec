import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { getFingerprint } from "./fingerprint";
import { BACKEND_URL } from "@/constants/url";

const customAxios = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
  },
});

// customAxios.interceptors.request.use(async (config : InternalAxiosRequestConfig) => {
//   try {
//     const deviceId = await getFingerprint();
//     config.headers["device-id"] = deviceId;
    
//     return config;
//   } catch (error) {
//     console.error("Error al obtener fingerprint:", error);
//     return config;
//   }
// });


export default customAxios as AxiosInstance;