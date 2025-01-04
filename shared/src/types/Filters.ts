import { TramiteType } from "../enums/TramiteType";

export interface StatsFilter {
    // fechas en milisegundos
    fechaInicio: number;
    fechaFin: number;
    numeroDeControl: number;
    tipoTramite: TramiteType;
}