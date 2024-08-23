import { Ticket, TramiteType} from "shared-types";
import { BACKEND_URL } from "../constants/url";
import axios, { AxiosResponse } from "axios";
export async function crearTicket(tramiteType: TramiteType, numeroDeControl:number) {
    const url = `${BACKEND_URL}/tickets/${tramiteType}/${numeroDeControl}`;
    const res:AxiosResponse<Ticket> = await axios.post(url);
    return res.data as Ticket;
}

export async function obtenerSiguienteTicket() {
    const url = BACKEND_URL + "/tickets/siguiente";
    return await axios.get(url);
}

export async function buscarTicket(tramiteType:TramiteType, ticketId:string){
    const url = BACKEND_URL + `/tickets/${tramiteType}/${ticketId}`;
    return await axios.get(url);
}

export async function eliminarTicket(tramiteType:TramiteType, ticketId:string){
    const url = BACKEND_URL + `/tickets/${tramiteType}/${ticketId}`;
    return await axios.delete(url);
}