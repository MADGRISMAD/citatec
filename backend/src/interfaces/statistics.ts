import { TramiteType } from "shared-types";

export interface BaseStats {
    total: number;
    resueltos: number;
    pendientes: number;
    porTramite: {
        [key in TramiteType]: {
            total: number;
            resueltos: number;
            pendientes: number;
        };
    };
}

export interface HourlyStats extends BaseStats {
    hora: number;
    ticketsPorMinuto: {
        minuto: number;
        cantidad: number;
    }[];
    comparacionAnterior: {
        diferencia: number;
        porcentaje: number;
    };
}

export interface DailyStats extends BaseStats {
    fecha: string;
    distribucionHoraria: {
        [hora: number]: HourlyStats;
    };
    horasPico: {
        hora: number;
        cantidad: number;
    }[];
}

export interface MonthlyStats extends BaseStats {
    mes: number;
    año: number;
    distribucionDiaria: {
        [dia: number]: DailyStats;
    };
    diasMasActivos: {
        dia: number;
        cantidad: number;
    }[];
    promediosDiarios: {
        tickets: number;
        tiempoResolucion: number;
    };
}
