import { TramiteType } from '../enums/TramiteType';
import { AlumnoData } from './AlumnoData';
export interface Ticket {
    id: string;
    letra: string;
    numero: number;
    tipoTramite: TramiteType;
    // fechaCreacion: FechaTicket;
    fechaProgramada: Date;
    data: AlumnoData;
}