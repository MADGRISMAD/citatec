import { Ticket } from "../types/Ticket";
import { NotAnymoreTicketsError } from "./Errores";

export class Cola {
    constructor(public tickets: Ticket[]) {
        this.tickets = [] as Ticket[];
    }
    agregarTicket(ticket: Ticket): void {
        this.tickets.push(ticket);
    }
    obtenerTicket(): Ticket {
        const ticket = this.tickets.shift();
        if (ticket)
            return ticket;

        throw new NotAnymoreTicketsError("No hay más tickets en la cola");
    }
    obtenerTickets(): Ticket[] {
        return this.tickets;
    }
}