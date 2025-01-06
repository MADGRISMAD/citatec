import { AxiosResponse } from 'axios';
import { BACKEND_URL } from '../constants/url';
import { SetTramiteDuration } from 'shared-types';
import customAxios from '@/utils/axios';


export async function obtenerTramites() : Promise<SetTramiteDuration[]> {
    const url =  "/tramites";
    const res:AxiosResponse<SetTramiteDuration[]> =  await customAxios.get(url);
    const tramites:SetTramiteDuration[]= res.data;  
    return tramites;
}