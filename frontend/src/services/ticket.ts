import { Ticket, TicketEstado} from "shared-types";
import customAxios from "../utils/axios";
import { AxiosResponse } from "axios";
export async function crearTicket(body: object, tramiteType: string, numeroDeControl:string) {
    const url = `/tickets/${tramiteType}/${numeroDeControl}`;
    console.log(url);
    const res:AxiosResponse<Ticket> = await customAxios.post(url, body);
    console.log(res.data);
    return res.data as Ticket;
}

export async function obtenerSiguienteTicket() {
    const url = "/tickets/siguiente";
    const res:AxiosResponse<Ticket> = await customAxios.get(url);
    return res.data as Ticket;
}

export async function buscarTicket(tramiteType:string, ticketId:string){
    const url = `/tickets/${tramiteType}/${ticketId}`;
    const res:AxiosResponse<Ticket> = await customAxios.get(url);
    return res.data as Ticket;
}

export async function eliminarTicket(tramiteType:string, ticketId:string, unschedulable =  false, estado: TicketEstado){
    const url = `/tickets/${tramiteType}/${ticketId}/${unschedulable}/${estado}`;
    const res:AxiosResponse<Ticket> = await customAxios.delete(url);
    return res.data as Ticket;
}

export async function obtenerTodosLosTickets(){
    const url = "/tickets/todos";
    const res:AxiosResponse<Record<string, Ticket[]>> = await customAxios.get(url);
    return res.data as Record<string, Ticket[]>;
}

export async function obtenerTicketsDelDia(dia:Date = new Date()){
    const diaToDateString :string = dia.toLocaleDateString('es-MX').replace(/\//g, "-");
    const url = "/tickets/" + diaToDateString;
    const res:AxiosResponse<Ticket[]> = await customAxios.get(url);
    return res.data as Ticket[];
}
