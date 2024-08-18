import axios from 'axios';
import { BACKEND_URL } from '../constants/url';
export const obtenerTramites = async () => {
    const url = BACKEND_URL + "/tramites";
    return await axios.get(url);
}