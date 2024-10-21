import { TramiteType } from '../enums/TramiteType';
export interface Ticket {
    id: string;
    letra: string;
    numeroDeControl: number;
    tipoTramite: TramiteType;
    fechaProgramada: Date;
}
