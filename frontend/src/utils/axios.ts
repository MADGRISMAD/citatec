import axios, {AxiosInstance } from "axios";
import { getFingerprint } from "./fingerprint";
class CustomAxiosInstance {
  private axiosInstance: AxiosInstance = axios.create();  

  constructor() {

    const backend_url = localStorage.getItem('backend_url');
    const port = localStorage.getItem('port');
    
    this.axiosInstance = axios.create({
      baseURL: `http://${backend_url}:${port}`,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",  
      },
    });

    this.setupInterceptors();
    
  }

  setupInterceptors() {
    this.axiosInstance.interceptors.request.use(async (config) => {
      try {
        const deviceId = await getFingerprint();
        config.headers['Device-ID'] = deviceId;
        return config;
      } catch (error) {
        console.error('Error al obtener fingerprint:', error);
        return config;
      }
    });
  }

  // Función para cambiar la baseURL
  setBaseURL() {    
    // Actualizar localStorage
    const url = localStorage.getItem('backend_url');
    const port = localStorage.getItem('port');
    // Actualizar la baseURL de la instancia
    this.axiosInstance.defaults.baseURL = `http://${url}:${port}`;
  }

  // Getter para obtener la instancia de axios
  getInstance() {
    return this.axiosInstance;
  }
}

// Crear y exportar una única instancia
const customAxios = new CustomAxiosInstance();
export default customAxios.getInstance();

// Exportar la función setBaseURL para poder usarla desde otros archivos
export const setBaseURL = () => {
  customAxios.setBaseURL();
};