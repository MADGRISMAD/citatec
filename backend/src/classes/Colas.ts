import { DATA_DIR } from "../constants/paths";
import { TramiteType } from "../enums/TramiteType";
import { Ticket } from "../types/Ticket";
import { Cola } from "./Cola";
import fs from 'fs';
import { NotAnymoreTicketsError, TicketNotFoundError } from "./Errores";
export class Colas {

    // Las colas son un objeto que contiene un conjunto de colas, 
    // una por cada tipo de trámite.
    private colas: Record<TramiteType, Cola> = {} as Record<TramiteType, Cola>;
    // Inicializa las colas
    constructor() {
        Object.values(TramiteType).forEach((tramite: TramiteType) => {
            this.colas[tramite] = new Cola([]);
        });
    }

    // Guarda las colas en el archivo temporal
    private guardarColas() {
        fs.writeFileSync(DATA_DIR, JSON.stringify(this.colas));
    }

    // Obtiene las colas del archivo temporal
    public cargarColas(): Colas {
        if (!fs.existsSync(DATA_DIR)) {
            fs.writeFileSync(DATA_DIR, JSON.stringify({}));
        }

        return JSON.parse(fs.readFileSync(DATA_DIR).toString());
    }

    // Agrega un ticket a la cola correspondiente
    public agregarTicket(ticket: Ticket) {
        this.colas[ticket.tipoTramite].agregarTicket(ticket);
        this.guardarColas();
    }

    public obtenerSiguienteTicket(): Ticket {
        const tramites: TramiteType[] = Object.values(TramiteType);

        for (let i = 0; i < tramites.length; i++) {
            const tramite: TramiteType = tramites[i];
            try {
                const ticket: Ticket = this.obtenerTicket(tramite);
                return ticket;
            }
            catch (e) {
                continue;
            }
        }

        throw new NotAnymoreTicketsError("No hay más tickets en ninguna cola");
    }

    // Obtiene los tickets de una cola
    private obtenerTicket(tramite: TramiteType): Ticket {
        try {
            const ticket: Ticket = this.colas[tramite].obtenerTicket();
            this.guardarColas();
            return ticket;
        }
        catch (e) {
            throw new NotAnymoreTicketsError("No hay más tickets en la cola de " + tramite);
        }
    }

    // Obtiene todos los tickets de una cola
    public obtenerTicketsDeCola(tramite: TramiteType): Ticket[] {

        const tickets: Ticket[] = this.colas[tramite].obtenerTickets();
        return tickets;
    }

    // Obtiene todos los tickets de todas las colas
    public obtenerTickets(): Record<TramiteType, Ticket[]> {

        const tickets: Record<TramiteType, Ticket[]> = {} as Record<TramiteType, Ticket[]>;
        Object.values(TramiteType).forEach((tramite: TramiteType) => {
            tickets[tramite] = this.colas[tramite].obtenerTickets();
        });

        return tickets;
    }

    public buscarTicket(tramite: TramiteType, ticketNumber: number): Ticket {
        const tickets: Ticket[] = this.obtenerTicketsDeCola(tramite);

        const ticket: Ticket | undefined = tickets.find(({ numero }: Ticket) => numero == ticketNumber);

        if (ticket) {
            return ticket;
        }

        throw new TicketNotFoundError("No se encontró el ticket " + ticketNumber + " en la cola de " + tramite);

    }
}