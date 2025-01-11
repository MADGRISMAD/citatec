import { TramiteConfig } from "../enums/TramiteConfig";

export interface Ticket {
    id: string;
    letra: string;
    numeroDeControl: number;
    tipoTramite: TramiteConfig;
    // fechaCreacion: FechaTicket;
    fechaProgramada: Date;
    descripcion?: string;
}