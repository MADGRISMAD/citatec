import { Ticket, TicketEstado, TramiteType} from "shared-types";
import { BACKEND_URL } from "../constants/url";
import customAxios from "../utils/axios";
import { AxiosResponse } from "axios";
export async function crearTicket(tramiteType: TramiteType, numeroDeControl:number) {
    const url = `/tickets/${tramiteType}/${numeroDeControl}`;
    const res:AxiosResponse<Ticket> = await customAxios.post(url);
    return res.data as Ticket;
}

export async function obtenerSiguienteTicket() {
    const url = "/tickets/siguiente";
    const res:AxiosResponse<Ticket> = await customAxios.get(url);
    return res.data as Ticket;
}

export async function buscarTicket(tramiteType:TramiteType, ticketId:string){
    const url = `/tickets/${tramiteType}/${ticketId}`;
    const res:AxiosResponse<Ticket> = await customAxios.get(url);
    return res.data as Ticket;
}

export async function eliminarTicket(tramiteType:TramiteType, ticketId:string, unschedulable =  false, estado: TicketEstado){
    const url = `/tickets/${tramiteType}/${ticketId}/${unschedulable}/${estado}`;
    const res:AxiosResponse<Ticket> = await customAxios.delete(url);
    return res.data as Ticket;
}

export async function obtenerTodosLosTickets(){
    const url = "/tickets/todos";
    const res:AxiosResponse<Record<TramiteType, Ticket[]>> = await customAxios.get(url);
    return res.data as Record<TramiteType, Ticket[]>;
}

export async function obtenerTicketsDelDia(dia:Date = new Date()){
    const diaToDateString :string = dia.toLocaleDateString('es-MX').replace(/\//g, "-");
    const url = "/tickets/" + diaToDateString;
    const res:AxiosResponse<Ticket[]> = await customAxios.get(url);
    return res.data as Ticket[];
}