import { TramiteType } from '../enums/TramiteType';
import { AlumnoData } from './AlumnoData';
export interface Ticket {
    id: string;
    letra: string;
    numero: number;
    tipoTramite: TramiteType;
    fechaProgramada: Date;
    data: AlumnoData;
}
