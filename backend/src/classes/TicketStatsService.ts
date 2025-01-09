// TicketStatsService.ts
import fs from 'fs';
import path from 'path';
import { createEmptyStats, createEmptyStatsBase, Ticket } from 'shared-types';
import { 
    TicketEstado, 
    TicketHistorial, 
    Stats, 
    StatsBase,
    addTramiteToStats,
    removeTramiteFromStats,
    getTramiteStats
} from 'shared-types/src/types/TicketArchive';
import { StatsFilter } from 'shared-types';

export class TicketStatsService {
    private historialPath: string;

    constructor() {
        this.historialPath = path.join(__dirname, '../data/historial.json');
    }

    public guardarEnHistorial(ticket: TicketHistorial): void {
        try {
            let historial: TicketHistorial[] = [];
            
            if (fs.existsSync(this.historialPath)) {
                historial = JSON.parse(fs.readFileSync(this.historialPath, 'utf8'));
            }

            historial.push(ticket);
            fs.writeFileSync(this.historialPath, JSON.stringify(historial, null, 2));
        } catch (error) {
            console.error('Error saving to history:', error);
        }
    }

    public obtenerHistorial(): TicketHistorial[] {
        try {
            if (fs.existsSync(this.historialPath)) {
                return JSON.parse(fs.readFileSync(this.historialPath, 'utf8'));
            }
            return [];
        } catch (error) {
            console.error('Error reading history:', error);
            return [];
        }
    }

    public filtrarHistorial(filtros: StatsFilter): TicketHistorial[] {
        const historial = this.obtenerHistorial();
        
        return historial.filter(ticket => {
            const fechaTicket = new Date(ticket.fechaProgramada).getTime();
            let cumpleCondiciones = true
            if (filtros.fechaInicio ) {
                cumpleCondiciones = cumpleCondiciones && fechaTicket >= filtros.fechaInicio;
            }
            if(filtros.fechaFin){
                cumpleCondiciones = cumpleCondiciones && fechaTicket <= filtros.fechaFin;
            }
            if(filtros.tipoTramite){
                
            cumpleCondiciones = cumpleCondiciones &&
                                 ticket.tipoTramite.nombre == filtros.tipoTramite;
            }
            if(filtros.numeroDeControl){
                cumpleCondiciones = cumpleCondiciones &&
                                 ticket.numeroDeControl == filtros.numeroDeControl;
            }

            return cumpleCondiciones;
        });
    }

    public obtenerEstadisticasDeFiltro(tickets: TicketHistorial[]): Stats {
        const stats = createEmptyStats();
        stats.atendidos = tickets.filter(ticket => ticket.estado === TicketEstado.ATENDIDO).length;
        stats.cancelados = tickets.filter(ticket => ticket.estado === TicketEstado.CANCELADO).length;
        stats.expirados = tickets.filter(ticket => ticket.estado === TicketEstado.EXPIRADO).length;
        stats.total = tickets.length;
        
        for (const ticket of tickets) {
            addTramiteToStats(stats, ticket.tipoTramite.nombre);
            stats.porTipoTramite[ticket.tipoTramite.nombre]++;
        }

        stats.tickets = tickets;
        return stats;
    }
}