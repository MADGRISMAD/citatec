import { Ticket } from "../types/Ticket";

export class Cola {
    constructor(public tickets: Ticket[]) {
        this.tickets = [] as Ticket[];
    }
    agregarTicket(ticket: Ticket): void {
        this.tickets.push(ticket);
    }
    obtenerTicket(): Ticket {
        return this.tickets.shift() as Ticket;
    }
    obtenerTickets(): Ticket[] {
        return this.tickets as Ticket[];
    }
}