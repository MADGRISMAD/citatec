import { outputLog, Ticket, TramiteConfig } from "shared-types";
import { Cola } from "./Cola";
import fs from "fs";
import { TicketNotFoundError } from "./Errores";
import { HOY, HORARIO } from "../constants/horario";
import { TIEMPOEXTRA } from "../constants/tramite";
import { ManejadorHuecos } from "./ManejadorHuecos";
import { esDiaDisponible, setSiguienteDiaDisponible } from "../utils/Fecha";
import { redondearAMultiploDe5 } from "../utils/tramites";
import { TicketEstado } from "shared-types/src/types/TicketArchive";
import { TramiteManager } from "./TramiteManager";
import ConfigManager from "./ConfigManager";
import { TICKET_PATH } from "../constants/paths";

const DATA_PATH = ConfigManager.get("DATA_PATH") as string;

export class Colas {
    public fechaAnterior: Date | undefined = undefined;
    public fechaDisponible: Date = new Date(HOY());
    private manejadorHuecos: ManejadorHuecos = new ManejadorHuecos();
    private tramiteManager: TramiteManager;
    // Las colas son un objeto que contiene un conjunto de colas,
    // una por cada tipo de trámite.
    private colas: Map<string, Cola> = new Map();

    // Inicializa las colas
    constructor() {
        this.tramiteManager = new TramiteManager();
        this.initializeColas();
    }

        private initializeColas(): void {
        this.tramiteManager.getActiveTramites().forEach(tramite => {
            this.colas.set(tramite.nombre, new Cola([]));
        });
    }

    // Guarda las colas en el archivo temporal
    private guardarColas() {
        const dataToSave = {
            ...this,
            colas: Object.fromEntries(this.colas)  // Convierte el Map a objeto
        };
        fs.writeFileSync(TICKET_PATH, JSON.stringify(dataToSave));
    }

    // Obtiene las colas del archivo temporal
    public cargarColas(): void {
        if (
            !fs.existsSync(TICKET_PATH) ||
            fs.readFileSync(TICKET_PATH).toString() == "" ||
            Object.keys(JSON.parse(fs.readFileSync(TICKET_PATH).toString())).length == 0
        ) {
            if (!fs.existsSync(DATA_PATH)) {
                fs.mkdirSync(DATA_PATH);
            }
            fs.writeFileSync(TICKET_PATH, JSON.stringify({}));
            this.initializeColas();
            return;
        }
    
        const data: any = JSON.parse(fs.readFileSync(TICKET_PATH).toString());
        
        // Convertir el objeto colas a Map si existe
        if (data.colas) {
            this.colas = new Map(Object.entries(data.colas));
        }
    
        this.tramiteManager.getTramites().forEach(tramite => {
            if (!this.colas.has(tramite.nombre)) {
                this.colas.set(tramite.nombre, new Cola([]));
            } else {
                const colaData = this.colas.get(tramite.nombre);
                this.colas.set(
                    tramite.nombre,
                    Object.setPrototypeOf(colaData, Cola.prototype) as Cola
                );
            }
        });
        
        this.fechaDisponible = new Date(data.fechaDisponible);
        this.manejadorHuecos = new ManejadorHuecos(data.manejadorHuecos.huecos);
    }

    public agregarNuevoTramite(nombre: string, duracion: number): void {
        this.tramiteManager.addTramite(nombre, duracion);
        this.colas.set(nombre, new Cola([]));
        this.guardarColas();
    }

    public activarTramite(nombre: string): void {
        this.tramiteManager.activateTramite(nombre);
        this.colas.set(nombre, new Cola([]));
        this.guardarColas();
    }

    public desactivarTramite(nombre: string): void {
        this.tramiteManager.removeTramite(nombre);
        this.guardarColas();
    }

    public modificarDuracionTramite(nombre: string, nuevaDuracion: number): void {
        this.tramiteManager.updateTramiteDuration(nombre, nuevaDuracion);
        this.guardarColas();
    }

    // Agrega un ticket a la cola correspondiente
    public agregarTicket(ticket: Ticket): void {
        this.verificarFechaDisponible();
        const fechaHueco: Date | undefined = this.buscarHuecoDisponible(ticket.tipoTramite);

        if (fechaHueco) {
            ticket.fechaProgramada = new Date(fechaHueco);
            const cola:Cola = this.colas.get(ticket.tipoTramite.nombre) as Cola;
            if (cola) {
                cola.agregarTicket(ticket, true);
            }
        } else {
            ticket.fechaProgramada = this.calcularFechaParaTicket(ticket.tipoTramite);
            this.colas.get(ticket.tipoTramite.nombre)?.agregarTicket(ticket, false);
            this.calcularProximaFechaDisponible(ticket.tipoTramite, ticket.fechaProgramada);
        }
        this.guardarColas();
    }

    private buscarHuecoDisponible(tramite: TramiteConfig): Date | undefined {
        const huecoDisponible =
            this.manejadorHuecos.buscarHuecoDisponible(tramite);
        // Si hay un hueco disponible y no es en el pasado, se devuelve
        if (huecoDisponible && huecoDisponible >= HOY()) {
            const fecha = new Date(huecoDisponible);
            outputLog(
                "Se creó un ticket en un HUECO para el trámite ",
                tramite.nombre,
                " con fecha ",
                fecha
            );
            return fecha;
        }
        return undefined;
    }

    // Calcula la fecha para el ticket creado
    private calcularFechaParaTicket(tramite: TramiteConfig): Date {
        // Sin tiempo extra porque al final del día no se atienden más trámites
        const minutosTramite = tramite.duration;

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
            tramite.nombre,
            " con fecha ",
            fecha
        );
        this.guardarColas()
        return fecha;
    }

    // Calcula la próxima fecha disponible para sacar un ticket
    private calcularProximaFechaDisponible(
        tramite: TramiteConfig,
        fechaUltimoTicket: Date
    ): void {
        const nuevaFecha = new Date(fechaUltimoTicket);
        // Suma el tiempo del trámite
        const minutos = tramite.duration + TIEMPOEXTRA;

        //Suma el tiempo extra (ya se sumó el tiempo de trámite)
        redondearAMultiploDe5(nuevaFecha, nuevaFecha.getMinutes() + minutos);
        // Sobrescribe la fecha disponible global
        this.fechaDisponible = nuevaFecha;
        outputLog("Fecha para la siguiente cita: ", nuevaFecha);
    }

    // Obtiene el siguiente ticket de las colas
    // public obtenerSiguienteTicket(): Ticket {
    //     const tramites: TramiteType[] = Object.values(TramiteType);

    //     for (const tramite of tramites) {
    //         try {
    //             const ticket: Ticket = this.obtenerTicket(
    //                 tramite as TramiteType
    //             );
    //             outputLog(
    //                 "Se obtuvo el ticket ",
    //                 ticket.numeroDeControl,
    //                 " de la cola de ",
    //                 tramite,
    //                 " con fecha ",
    //                 ticket.fechaProgramada
    //             );
    //         } catch (e) {
    //             continue;
    //         }
    //     }

    //     throw new NotAnymoreTicketsError("No hay más tickets en ninguna cola");
    // }

    // // Obtiene los tickets de una cola
    // private obtenerTicket(tramite: TramiteType): Ticket {
    //     try {
    //         const ticket: Ticket = this.colas[tramite].obtenerTicket();
    //         return ticket;
    //     } catch (e: any) {
    //         throw new NotAnymoreTicketsError(
    //             "No hay más tickets en la cola de " + tramite
    //         );
    //     }
    // }

    // Obtiene todos los tickets de una cola
    public obtenerTicketsDeCola(tramite: string): Ticket[] {
        return this.colas.get(tramite)?.obtenerTickets() || [];
    }

    // Obtiene todos los tickets de todas las colas
    public obtenerTickets(): Record<string, Ticket[]> {
        const tickets: Record<string, Ticket[]> = {};
        this.tramiteManager.getActiveTramites().forEach(tramite => {
            tickets[tramite.nombre] = this.obtenerTicketsDeCola(tramite.nombre);
        });
        return tickets;
    }

    // Busca un ticket en una cola
    public buscarTicket(tramite: string, ticketId: string): Ticket {
        const tickets = this.obtenerTicketsDeCola(tramite);
        const ticket = tickets.find(({ id }) => id == ticketId);
        
        if (!ticket) {
            throw new TicketNotFoundError(
                `No se encontró el ticket ${ticketId} en la cola de ${tramite}`
            );
        }
        
        return ticket;
    }

    public buscarTicketPorNumControl(
        tramite: string,
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
    public cancelarTicket(tramite: string, ticketId: string, unschedulable: boolean = false, estado: TicketEstado = TicketEstado.EXPIRADO): void {
        try {
            const ticket: Ticket = this.buscarTicket(tramite, ticketId);

            const cola = this.colas.get(tramite);
            if (cola) {
                cola.eliminarTicket(ticket, estado);
            }
            outputLog("Eliminando ticket", tramite, ticketId, unschedulable, estado);
            
            // Si el ticket no es reprogramable, se cancela sin crear hueco
            if(unschedulable != true){
                this.manejadorHuecos.cancelarTicket(ticket);
            }


            this.guardarColas();
        } catch (e) {
            outputLog(e);
            throw new TicketNotFoundError(
                "No se encontró el ticket " +
                    ticketId +
                    " en la cola de " +
                    tramite
            );
        }
    }
    // Obten los tickets de todas las colas
    public obtenerTodosLosTickets(): Map<string, Ticket[]> {
        const tickets: Map<string, Ticket[]> = {} as Map<string, Ticket[]>;
        const tramites: string[] = this.tramiteManager.getActiveTramites().map(tramite => tramite.nombre);
        for (const tramite of tramites) {
            const cola = this.colas.get(tramite);
            if (cola) {
                tickets.set(tramite, cola.obtenerTickets());
            }
        }

        return tickets;
    }


    public obtenerTicketsDelDia(diaToDateString:string): Ticket[] {
        let tickets: Ticket[] = [];
        const tramites: string[] = this.tramiteManager.getTramites().map(tramite => tramite.nombre);
        for (const tramite of tramites) {
            tickets.push(...this.obtenerTicketsDeCola(tramite));
        }
        // Filtrar los tickets que no son del día o que ya pasaron, los pasados se cancelan
        tickets = tickets.filter((ticket: Ticket) => {
            const fechaFinalizacion = new Date(ticket.fechaProgramada).getTime() + this.tramiteManager.getTramiteDuration(ticket.tipoTramite.nombre) * 60 * 1000;
            if(fechaFinalizacion < HOY().getTime()){
                const cola = this.colas.get(ticket.tipoTramite.nombre);
                if (cola) {
                    cola.eliminarTicket(ticket, TicketEstado.EXPIRADO);
                }
                return false;
            }
            const ticketToDateString = new Date(ticket.fechaProgramada).toLocaleDateString('es-MX').replace(/\//g, "-");
            return ticketToDateString == diaToDateString;
        });

        tickets = tickets.sort((a: Ticket, b: Ticket) => {
            return new Date(a.fechaProgramada).getTime() - new Date(b.fechaProgramada).getTime();
        });
        
        

                //         // Sumar el tiempo del trámite
                // const fechaFinal = new Date(ticket.fechaProgramada.getTime() + tramiteDuration[ticket.tipoTramite as TramiteType] * 60 * 1000);
                // // Si la fecha del ticket es mayor a la fecha actual, se devuelve
                // console.log(fechaFinal, HOY(), fechaFinal >= HOY());
                // if(fechaFinal >= HOY())
                //     return ticket;
                // // Si no, se cancela el ticket y se sigue buscando
                // else {
                //     console.log("ENTRA");
                //     this.manejadorHuecos.cancelarTicket(ticket);
                //     this.colas[tramite].eliminarTicket(ticket, TicketEstado.EXPIRADO);
                //     this.guardarColas();
                // }

        return tickets;
    }

    // Asegura que la fecha disponible no sea en el pasado
    private verificarFechaDisponible(): void {
        if (this.fechaDisponible < HOY()) {
            this.fechaDisponible = HOY();
        }
    }
}
