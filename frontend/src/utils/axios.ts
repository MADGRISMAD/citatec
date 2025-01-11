import { BACKEND_URL } from "@/constants/url";
import axios from "axios";
import FingerprintJS from '@fingerprintjs/fingerprintjs';

// Función para obtener el fingerprint
const getFingerprint = async () => {
  const fp = await FingerprintJS.load();
  const result = await fp.get();
  return result.visitorId;
};

// Crear instancia de axios
const customAxios = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Agregar interceptor para incluir el fingerprint en cada solicitud
customAxios.interceptors.request.use(async (config) => {
  try {
    const deviceId = await getFingerprint();
    config.headers['Device-ID'] = deviceId;
    return config;
  } catch (error) {
    console.error('Error al obtener fingerprint:', error);
    return config;
  }
});

export default customAxios;