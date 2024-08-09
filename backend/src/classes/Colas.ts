import { DATA_DIR } from "../constants/paths";
import { TramiteType } from "../enums/TramiteType";
import { Ticket } from "../types/Ticket";
import { Cola } from "./Cola";
import fs from "fs";
import { NotAnymoreTicketsError, TicketNotFoundError } from "./Errores";
import { HOY, HORARIO } from "../constants/horario";
import { TIEMPOEXTRA, tramiteDuration } from "../constants/tramite";
import { ManejadorHuecos } from "./ManejadorHuecos";
import { setSiguienteDiaDisponible } from "../utils/Fecha";
import { redondearAMultiploDe5 } from "../utils/tramites";
export class Colas {
    // Fecha hasta la cual se está disponible para sacar tickets
    public fechaDisponible: Date = new Date(HOY());
    private manejadorHuecos: ManejadorHuecos = new ManejadorHuecos();

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
        fs.writeFileSync(DATA_DIR, JSON.stringify(this));
    }

    // Obtiene las colas del archivo temporal
    public cargarColas(): void {
        if (
            !fs.existsSync(DATA_DIR) ||
            fs.readFileSync(DATA_DIR).toString() == "" ||
            Object.keys(JSON.parse(fs.readFileSync(DATA_DIR).toString()))
                .length == 0
        ) {
            fs.writeFileSync(DATA_DIR, JSON.stringify({}));
            Object.values(TramiteType).forEach((tramite: TramiteType) => {
                // Previene que crashee si se agrega un nuevo trámite
                this.colas[tramite] = new Cola([]);
            });
            return;
        }
        const data: Colas = JSON.parse(fs.readFileSync(DATA_DIR).toString());
        // Carga las colas
        Object.values(TramiteType).forEach((tramite: TramiteType) => {
            // Previene que crashee si se agrega un nuevo trámite
            if (!data.colas[tramite]) {
                data.colas[tramite] = new Cola([]);
            } else {
                this.colas[tramite] = Object.setPrototypeOf(
                    data.colas[tramite],
                    Cola.prototype
                ) as Cola;
            }
        });
        this.fechaDisponible = new Date(data.fechaDisponible);
        this.manejadorHuecos = new ManejadorHuecos(data.manejadorHuecos.huecos);
        this.verificarFechaDisponible();
    }

    // Agrega un ticket a la cola correspondiente
    public agregarTicket(ticket: Ticket): void {
        const fechaHueco : Date | null = this.buscarHuecoDisponible(ticket.tipoTramite);
        // Si hay un hueco disponible, se agrega el ticket ahí
        if (fechaHueco) {
            ticket.fechaProgramada = new Date(fechaHueco);
            this.colas[ticket.tipoTramite].agregarTicket(ticket);
        }
        else {
            // Si no hay hueco disponible, se calcula la fecha para el ticket
            ticket.fechaProgramada = this.calcularFechaParaTicket(
                ticket.tipoTramite
            );
            this.colas[ticket.tipoTramite].agregarTicket(ticket);
            this.calcularProximaFechaDisponible(
                ticket.tipoTramite,
                ticket.fechaProgramada
            );

        }
        this.guardarColas();
    }

    private buscarHuecoDisponible(tramite: TramiteType): Date | null {
        const huecoDisponible =
            this.manejadorHuecos.buscarHuecoDisponible(tramite);
        if (huecoDisponible) {
            const fecha = new Date(huecoDisponible);
            console.log(
                "Se creó un ticket en un HUECO para el trámite ",
                tramite,
                " con fecha ",
                fecha
            );
            return fecha;
        }
        return null;
    }

    // Calcula la fecha para el ticket creado
    private calcularFechaParaTicket(tramite: TramiteType): Date {
        // Sin tiempo extra porque al final del día no se atienden más trámites
        const minutosTramite = tramiteDuration[tramite];

        this.verificarFechaDisponible();

        let fecha = new Date(this.fechaDisponible);

        const horaDisponible = fecha.getHours();

        // Si la fecha del trámite termina después del horario de cierre, se pasa al siguiente día
        if (
            horaDisponible >= HORARIO.FINAL.getHours() ||
            (horaDisponible == HORARIO.FINAL.getHours() - 1 &&
                fecha.getMinutes() >= 60 - minutosTramite)
        ) {
            // Iniciando el siguiente día
            fecha = setSiguienteDiaDisponible(fecha);
            fecha.setHours(HORARIO.INICIO.getHours());
            redondearAMultiploDe5(fecha, TIEMPOEXTRA);

            // Llena el hueco con la fecha que se saltó
            const hueco: Date = new Date(fecha);
            redondearAMultiploDe5(hueco, 60);
            this.manejadorHuecos.agregarHueco(fecha, hueco);
        } else {
            redondearAMultiploDe5(fecha, fecha.getMinutes());
        }
        console.log(
            "Se creó un ticket al FINAL para el trámite ",
            tramite,
            " con fecha ",
            fecha
        );
        return fecha;
    }

    // Calcula la próxima fecha disponible para sacar un ticket
    private calcularProximaFechaDisponible(
        tramite: TramiteType,
        fechaUltimoTicket: Date
    ): void {
        const nuevaFecha = new Date(fechaUltimoTicket);
        // Suma el tiempo del trámite
        const minutos = tramiteDuration[tramite] + TIEMPOEXTRA;

        //Suma el tiempo extra (ya se sumó el tiempo de trámite)
        redondearAMultiploDe5(nuevaFecha, nuevaFecha.getMinutes() + minutos);
        // Sobrescribe la fecha disponible global
        this.fechaDisponible = nuevaFecha;
        console.log("Fecha para la siguiente cita: ", nuevaFecha);
    }

    // Obtiene el siguiente ticket de la cola
    public obtenerSiguienteTicket(): Ticket {
        const tramites: TramiteType[] = Object.values(TramiteType);

        for (const tramite of tramites) {
            try {
                const ticket: Ticket = this.obtenerTicket(
                    tramite as TramiteType
                );
                console.log(
                    "Se obtuvo el ticket ",
                    ticket.numero,
                    " de la cola de ",
                    tramite,
                    " con fecha ",
                    ticket.fechaProgramada
                );
                return ticket;
            } catch (e) {
                continue;
            }
        }

        throw new NotAnymoreTicketsError("No hay más tickets en ninguna cola");
    }

    // Obtiene los tickets de una cola
    private obtenerTicket(tramite: TramiteType): Ticket {
        try {
            const ticket: Ticket = this.colas[tramite].obtenerTicket();
            return ticket;
        } catch (e: any) {
            throw new NotAnymoreTicketsError(
                "No hay más tickets en la cola de " + tramite
            );
        }
    }

    // Obtiene todos los tickets de una cola
    public obtenerTicketsDeCola(tramite: TramiteType): Ticket[] {
        const tickets: Ticket[] = this.colas[tramite].obtenerTickets();
        return tickets;
    }

    // Obtiene todos los tickets de todas las colas
    public obtenerTickets(): Record<TramiteType, Ticket[]> {
        const tickets: Record<TramiteType, Ticket[]> = {} as Record<
            TramiteType,
            Ticket[]
        >;
        Object.values(TramiteType).forEach((tramite: TramiteType) => {
            tickets[tramite] = this.colas[tramite].obtenerTickets();
        });

        return tickets;
    }

    // Busca un ticket en una cola
    public buscarTicket(tramite: TramiteType, ticketId: string): Ticket {
        const tickets: Ticket[] = this.obtenerTicketsDeCola(tramite);

        const ticket: Ticket | undefined = tickets.find(
            ({ id }: Ticket) => id == ticketId
        );
        if (ticket) {
            return ticket;
        }

        throw new TicketNotFoundError(
            "No se encontró el ticket " + ticketId + " en la cola de " + tramite
        );
    }

    public buscarTicketPorNumControl(
        tramite: TramiteType,
        numControl: number
    ): Ticket {
        const tickets: Ticket[] = this.obtenerTicketsDeCola(tramite);

        const ticket: Ticket | undefined = tickets.find(
            ({ data }: Ticket) => data.numControl == numControl
        );
        if (ticket) {
            return ticket;
        }

        throw new TicketNotFoundError(
            "No se encontró el ticket con número de control " +
                numControl +
                " en la cola de " +
                tramite
        );
    }

    // Cancela la cita de un ticket
    public cancelarTicket(tramiteType: TramiteType, ticketId: string): void {
        try {
            const ticket: Ticket = this.buscarTicket(tramiteType, ticketId);

            this.colas[tramiteType].eliminarTicket(ticket);

            this.manejadorHuecos.cancelarTicket(ticket);

            this.guardarColas();
        } catch (e) {
            console.log(e);
            throw new TicketNotFoundError(
                "No se encontró el ticket " +
                    ticketId +
                    " en la cola de " +
                    tramiteType
            );
        }
    }

    private verificarFechaDisponible(): void {
        if (this.fechaDisponible < HOY()) {
            this.fechaDisponible = HOY();
        }
    }
}
