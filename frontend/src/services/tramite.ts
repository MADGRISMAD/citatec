import { AxiosResponse } from 'axios';
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
export async function cambiarTramiteActivo(tramiteType:string, activo:boolean) {
    if(activo)
        return await activarTramite(tramiteType);

    return await desactivarTramite(tramiteType);
}
async function activarTramite(tramiteType:string) {
    const url =  `/tramites/activar`;
    const res:AxiosResponse =  await customAxios.put(url, {nombre: tramiteType});
    return res;
}
async function desactivarTramite(tramiteType:string) {
    const url =  `/tramites/desactivar`;
    const res:AxiosResponse =  await customAxios.put(url, {nombre: tramiteType});
    return res;
}

export async function cambiarDuracionTramite(tramiteType:string, duration:number) {
    const url =  `/tramites/duracion`;
    const res:AxiosResponse =  await customAxios.put(url, {nombre: tramiteType, nuevaDuracion: duration});
    return res.data;
    
}