import {Ticket} from "shared-types"
import { NotAnymoreTicketsError } from "./Errores";

export class Cola {
    constructor(public tickets: Ticket[]) {
        this.tickets = [] as Ticket[];
    }
    agregarTicket(ticket: Ticket, esHueco: boolean = false): void {
        if (esHueco) {
            for (let i = 0; i < this.tickets.length; i++) {
                const fechaTicket = new Date(this.tickets[i].fechaProgramada);
                // Si la fecha del ticket es menor a la fecha del nuevo ticket, lo inserta en esa posición
                if (fechaTicket < ticket.fechaProgramada) {
                    this.tickets.splice(i, 0, ticket);
                    return;
                }
            }
        }
        this.tickets.push(ticket);
    }
    obtenerTicket(): Ticket {
        const ticket = this.tickets[0];
        if (ticket) return ticket;

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
