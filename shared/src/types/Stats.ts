import { TramiteType } from "../enums/TramiteType";
import { TicketHistorial } from "./TicketArchive";

export interface StatResults {
    total: number,
    atendidos: number,
    cancelados: number,
    expirados: number,
    porTipoTramite: Record<TramiteType, number>,
    tickets: TicketHistorial[]
}