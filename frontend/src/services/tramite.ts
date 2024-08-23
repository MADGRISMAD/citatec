import axios, { AxiosResponse } from 'axios';
import { BACKEND_URL } from '../constants/url';
import { SetTramiteDuration } from 'shared-types';


export async function obtenerTramites() : Promise<SetTramiteDuration[]> {
    const url = BACKEND_URL + "/tramites";
    const res:AxiosResponse<SetTramiteDuration[]> =  await axios.get(url);
    const tramites:SetTramiteDuration[]= res.data;  
    return tramites;
}