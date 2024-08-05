import { Ticket } from "../types/Ticket";
import { NotAnymoreTicketsError } from "./Errores";

export class Cola {
    constructor(public tickets: Ticket[]) {
        this.tickets = [] as Ticket[];
    }
    agregarTicket(ticket: Ticket): void {
        console.log(this.tickets);
        this.tickets.push(ticket);
    }
    obtenerTicket(): Ticket {
        const ticket = this.tickets[0];
        if (ticket)
            return ticket;

        throw new NotAnymoreTicketsError("No hay más tickets en la cola");
    }
    obtenerTickets(): Ticket[] {
        return this.tickets;
    }
    eliminarPrimerTicket(): void {
        this.tickets.shift();
    }
    eliminarTicket(ticket: Ticket): void {
        const index = this.tickets.indexOf(ticket);
        this.tickets.splice(index, 1);
    }
}