import { AxiosResponse } from 'axios';
import { BACKEND_URL } from '../constants/url';
import customAxios from '@/utils/axios';
import { TramiteConfig } from 'shared-types';


export async function obtenerTramites() {
    const url =  "/tramites";
    const res:AxiosResponse<TramiteConfig[]> =  await customAxios.get(url);
    const tramites:TramiteConfig[]= res.data;  
    return tramites;
}
export async function obtenerTramitesActivos() {
    const url =  "/tramites/activos";
    const res:AxiosResponse<TramiteConfig[]> =  await customAxios.get(url);
    const tramites:TramiteConfig[]= res.data;  
    return tramites;
}