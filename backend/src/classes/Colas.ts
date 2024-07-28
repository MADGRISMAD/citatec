import { DATA_DIR } from "../constants/paths";
import { TramiteType } from "../enums/TramiteType";
import { Ticket } from "../types/Ticket";
import { Cola } from "./Cola";
import fs from 'fs';
export class Colas {

    // Las colas son un objeto que contiene un conjunto de colas, 
    // una por cada tipo de trámite.
    public colas: Record<TramiteType, Cola> = {} as Record<TramiteType, Cola>;
    // Inicializa las colas
    constructor() {
        Object.values(TramiteType).forEach((tramite: TramiteType) => {
            this.colas[tramite] = new Cola([]);
        });
    }

    // Guarda las colas en el archivo temporal
    public guardarColas() {
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

    // Obtiene los tickets de una cola
    public obtenerTicket(tramite: TramiteType): Ticket {
        const ticket: Ticket = this.colas[tramite].obtenerTicket();
        this.guardarColas();
        return ticket;
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


}