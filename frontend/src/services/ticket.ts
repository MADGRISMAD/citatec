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
    const res:AxiosResponse<Ticket> = await axios.get(url);
    return res.data as Ticket;
}

export async function buscarTicket(tramiteType:TramiteType, ticketId:string){
    const url = BACKEND_URL + `/tickets/${tramiteType}/${ticketId}`;
    const res:AxiosResponse<Ticket> = await axios.get(url);
    return res.data as Ticket;
}

export async function eliminarTicket(tramiteType:TramiteType, ticketId:string, unschedulable =  false){
    const url = BACKEND_URL + `/tickets/${tramiteType}/${ticketId}/${unschedulable}`;
    const res:AxiosResponse<Ticket> = await axios.delete(url);
    return res.data as Ticket;
}

export async function obtenerTodosLosTickets(){
    const url = BACKEND_URL + "/tickets/todos";
    const res:AxiosResponse<Record<TramiteType, Ticket[]>> = await axios.get(url);
    return res.data as Record<TramiteType, Ticket[]>;
}

export async function obtenerTicketsDelDia(dia:Date = new Date()){
    const diaToDateString :string = dia.toLocaleDateString('es-MX').replace(/\//g, "-");
    const url = BACKEND_URL + "/tickets/" + diaToDateString;
    const res:AxiosResponse<Ticket[]> = await axios.get(url);
    return res.data as Ticket[];
}