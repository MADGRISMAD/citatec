import { TramiteType } from '../enums/TramiteType';
export interface Ticket {
    id: string;
    letra: string;
    numero: number;
    tipoTramite: TramiteType;
    data: JSON;
}