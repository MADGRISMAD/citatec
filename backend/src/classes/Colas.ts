import { DATA_DIR, DATA_FOLDER } from "../constants/paths";
import { Ticket, TramiteType, outputLog } from "shared-types";
import { Cola } from "./Cola";
import fs from "fs";
import { NotAnymoreTicketsError, TicketNotFoundError } from "./Errores";
import { HOY, HORARIO } from "../constants/horario";
import { TIEMPOEXTRA, tramiteDuration } from "../constants/tramite";
import { ManejadorHuecos } from "./ManejadorHuecos";
import { esDiaDisponible, setSiguienteDiaDisponible } from "../utils/Fecha";
import { redondearAMultiploDe5 } from "../utils/tramites";
import { TicketEstado } from "shared-types/src/types/TicketArchive";
export class Colas {
    // Fecha hasta la cual se está disponible para sacar tickets
    public fechaAnterior: Date | undefined = undefined;
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
            if (!fs.existsSync(DATA_FOLDER)) {
                fs.mkdirSync(DATA_FOLDER);
            }
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
    }

    // Agrega un ticket a la cola correspondiente
    public agregarTicket(ticket: Ticket): void {
        this.verificarFechaDisponible();
        const fechaHueco: Date | undefined = this.buscarHuecoDisponible(
            ticket.tipoTramite
        );
        // Si hay un hueco disponible, se agrega el ticket ahí
        if (fechaHueco) {
            ticket.fechaProgramada = new Date(fechaHueco);
            this.colas[ticket.tipoTramite].agregarTicket(ticket, true);
        } else {
            // Si no hay hueco disponible, se calcula la fecha para el ticket
            ticket.fechaProgramada = this.calcularFechaParaTicket(
                ticket.tipoTramite
            );
            this.colas[ticket.tipoTramite].agregarTicket(ticket, false);
            this.calcularProximaFechaDisponible(
                ticket.tipoTramite,
                ticket.fechaProgramada
            );
        }
        this.guardarColas();
    }

    private buscarHuecoDisponible(tramite: TramiteType): Date | undefined {
        const huecoDisponible =
            this.manejadorHuecos.buscarHuecoDisponible(tramite);
        // Si hay un hueco disponible y no es en el pasado, se devuelve
        if (huecoDisponible && huecoDisponible >= HOY()) {
            const fecha = new Date(huecoDisponible);
            outputLog(
                "Se creó un ticket en un HUECO para el trámite ",
                tramite,
                " con fecha ",
                fecha
            );
            return fecha;
        }
        return undefined;
    }

    // Calcula la fecha para el ticket creado
    private calcularFechaParaTicket(tramite: TramiteType): Date {
        // Sin tiempo extra porque al final del día no se atienden más trámites
        const minutosTramite = tramiteDuration[tramite];

        let fecha = new Date(this.fechaDisponible);

        const horaDisponible = fecha.getHours();
        // Si el trámite es creado fuera de un día válido, se programa para el siguiente día válido
        if(!esDiaDisponible(fecha)) {
            fecha = setSiguienteDiaDisponible(fecha);
            fecha.setHours(HORARIO.INICIO.getHours(), TIEMPOEXTRA, 0, 0);
        }
        /* Si el trámite es creado dentro de un día válido, continua */
        else if (
            esDiaDisponible(fecha) &&
            horaDisponible + minutosTramite / 60 < HORARIO.FINAL.getHours()
        )
            redondearAMultiploDe5(fecha, fecha.getMinutes());
        else {
            /* 
            Si el trámite no cabe al final del día, se programa para el siguiente día
            y se crea un hueco en el tiempo que fué saltado */
            const inicioHueco: Date = new Date(fecha);
            const finalHueco: Date = new Date(fecha);
            finalHueco.setHours(HORARIO.FINAL.getHours(), 0, 0);
            outputLog(
                "Se creó un hueco en el tiempo ",
                inicioHueco,
                " - ",
                finalHueco
            );
            // outputLog(
            //     "Fecha inicial: ",
            //     inicioHueco,
            //     ", fecha final:",
            //     finalHueco
            // );
            this.manejadorHuecos.agregarHueco(inicioHueco, finalHueco);

            // Iniciando el siguiente día disponible
            fecha = setSiguienteDiaDisponible(fecha);
            fecha.setHours(HORARIO.INICIO.getHours());
            redondearAMultiploDe5(fecha, TIEMPOEXTRA);
        }
        outputLog(
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
        outputLog("Fecha para la siguiente cita: ", nuevaFecha);
    }

    // Obtiene el siguiente ticket de las colas
    public obtenerSiguienteTicket(): Ticket {
        const tramites: TramiteType[] = Object.values(TramiteType);

        for (const tramite of tramites) {
            try {
                const ticket: Ticket = this.obtenerTicket(
                    tramite as TramiteType
                );
                outputLog(
                    "Se obtuvo el ticket ",
                    ticket.numeroDeControl,
                    " de la cola de ",
                    tramite,
                    " con fecha ",
                    ticket.fechaProgramada
                );
                // Sumar el tiempo del trámite
                const fechaFinal = new Date(ticket.fechaProgramada.getTime() + tramiteDuration[ticket.tipoTramite as TramiteType] * 60 * 1000);
                // Si la fecha del ticket es mayor a la fecha actual, se devuelve
                if(fechaFinal >= HOY())
                    return ticket;
                // Si no, se cancela el ticket y se sigue buscando
                else {
                    this.manejadorHuecos.cancelarTicket(ticket);
                    this.colas[tramite].eliminarTicket(ticket, TicketEstado.EXPIRADO);
                    this.guardarColas();
                }
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
            (ticket: Ticket) =>
                ticket.numeroDeControl == numControl &&
                new Date(ticket.fechaProgramada) >= HOY()
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
    public cancelarTicket(tramiteType: TramiteType, ticketId: string, unschedulable: boolean = false, estado: TicketEstado = TicketEstado.EXPIRADO): void {
        try {
            const ticket: Ticket = this.buscarTicket(tramiteType, ticketId);

            this.colas[tramiteType].eliminarTicket(ticket,estado);
            outputLog("Eliminando ticket", tramiteType, ticketId, unschedulable, estado);

            // Si el ticket no es reprogramable, se cancela sin crear hueco
            if(!unschedulable)
                this.manejadorHuecos.cancelarTicket(ticket);


            this.guardarColas();
        } catch (e) {
            outputLog(e);
            throw new TicketNotFoundError(
                "No se encontró el ticket " +
                    ticketId +
                    " en la cola de " +
                    tramiteType
            );
        }
    }
    // Obten los tickets de todas las colas
    public obtenerTodosLosTickets(): Record<TramiteType, Ticket[]> {
        const tickets: Record<TramiteType, Ticket[]> = {} as Record<TramiteType, Ticket[]>;
        const tramites: TramiteType[] = Object.values(TramiteType);
        for (const tramite of tramites) {
            tickets[tramite] = this.colas[tramite].obtenerTickets();
        }

        return tickets;
    }


    public obtenerTicketsDelDia(diaToDateString:string): Ticket[] {
        let tickets: Ticket[] = [];
        const tramites: TramiteType[] = Object.values(TramiteType);
        for (const tramite of tramites) {
            tickets.push(...this.obtenerTicketsDeCola(tramite));
        }

        tickets = tickets.filter((ticket: Ticket) => {
            const ticketToDateString = new Date(ticket.fechaProgramada).toLocaleDateString('es-MX').replace(/\//g, "-");
            return ticketToDateString == diaToDateString;
        });

        tickets = tickets.sort((a: Ticket, b: Ticket) => {
            return new Date(a.fechaProgramada).getTime() - new Date(b.fechaProgramada).getTime();
        });
        
        return tickets;
    }

    // Asegura que la fecha disponible no sea en el pasado
    private verificarFechaDisponible(): void {
        if (this.fechaDisponible < HOY()) {
            this.fechaDisponible = HOY();
        }
    }
}
