import { Ticket, TramiteType} from "shared-types";
import { BACKEND_URL } from "../constants/url";
import axios from "axios";
export const crearTicket = async (ticket:Ticket) => {
    const url = BACKEND_URL + "/tickets";
    return await axios.post(url, ticket);
}

export const obtenerSiguienteTicket = async () => {
    const url = BACKEND_URL + "/tickets/siguiente";
    return await axios.get(url);
}

export const buscarTicket = async (tramiteType:TramiteType, ticketId:string) => {
    const url = BACKEND_URL + `/tickets/${tramiteType}/${ticketId}`;
    return await axios.get(url);
}

export const eliminarTicket = async (tramiteType:TramiteType, ticketId:string) => {
    const url = BACKEND_URL + `/tickets/${tramiteType}/${ticketId}`;
    return await axios.delete(url);
}