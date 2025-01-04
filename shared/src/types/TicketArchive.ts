import { Ticket } from "./Ticket";


export interface TicketHistorial extends Ticket {
    estado: TicketEstado;
}

export enum TicketEstado {
    ATENDIDO = 'Atendido',
    CANCELADO = 'Cancelado',
    EXPIRADO = 'Expirado'
}