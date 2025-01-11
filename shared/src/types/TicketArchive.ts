import { Ticket } from "./Ticket";

export enum TicketEstado {
    ATENDIDO = 'ATENDIDO',
    CANCELADO = 'CANCELADO',
    EXPIRADO = 'EXPIRADO'
}

export interface TicketHistorial extends Ticket {
    estado: TicketEstado;
}

export interface StatsBase {
    total: number;
    atendidos: number;
    cancelados: number;
    expirados: number;}

export interface Stats extends StatsBase {
    porTipoTramite: Record<string, number>;
    tickets: TicketHistorial[];
}


export const createEmptyStats = (): Stats => {
    return {
        total: 0,
        atendidos: 0,
        cancelados: 0,
        expirados: 0,
        // Llenar todos los tipos de  tramites con cero
        porTipoTramite: {},
        tickets: []
    }
};

export const createEmptyStatsBase = (): StatsBase => {
    return {
        total: 0,
        atendidos: 0,
        cancelados: 0,
        expirados: 0
    }
}

// Funciones auxiliares para el manejo de trámites en las estadísticas
export const ensureTramiteStats = (stats: Stats, tramite: string): void => {
    if (!stats.porTipoTramite[tramite]) {
        stats.porTipoTramite[tramite] = 0;
    }
};

export const addTramiteToStats = (stats: Stats, tramite: string): void => {
    ensureTramiteStats(stats, tramite);
};

export const removeTramiteFromStats = (stats: Stats, tramite: string): void => {
    delete stats.porTipoTramite[tramite];
};


export const getTramiteStats = (stats: Stats, tramite: string): number | undefined => {
    return stats.porTipoTramite[tramite];
};