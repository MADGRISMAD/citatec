import { FechaTicket } from '../classes/FechaTicket';
import { TramiteType } from '../enums/TramiteType';
export interface Ticket {
    id: string;
    letra: string;
    numero: number;
    tipoTramite: TramiteType;
    fechaCreacion: FechaTicket;
    fechaProgramada?: FechaTicket;
    data: JSON;
}