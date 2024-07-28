import { TramiteType } from '../enums/TramiteType';
export interface Ticket {
    id: number;
    letra: string;
    numero: number;
    tipoTramite: TramiteType;
    data: JSON;
}