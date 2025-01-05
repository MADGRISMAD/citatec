import { TramiteType, TicketEstado, TicketHistorial, StatsFilter, StatResults } from "shared-types";
import fs from 'fs';
import ConfigManager from "./ConfigManager";
export class TicketStatsService {
    private historialPath:string = ConfigManager.get("TICKET_ARCHIVE_PATH");

    constructor() {
        this.crearArchivo();
    }
    private crearArchivo(): void {
        if (!fs.existsSync(this.historialPath)) {
            try {
                fs.writeFileSync(this.historialPath, JSON.stringify([]));
            } catch (error) {
                throw new Error("Error al crear el archivo de historial");
            }
        }
    }
    async guardarEnHistorial(ticket: TicketHistorial): Promise<void> {
        this.crearArchivo();
        const historial:TicketHistorial[] = await this.obtenerHistorial();
        historial.push(ticket);
        fs.writeFileSync(this.historialPath , JSON.stringify(historial));
    }

    async obtenerEstadisticas(filtros?: Partial<StatsFilter>) : Promise<StatResults> {
        const historial = await this.obtenerHistorial();
        let ticketsFiltrados = historial;

        // Aplicar filtros
        if (filtros) {
            ticketsFiltrados = historial.filter(ticket => {
                let cumpleFiltros = true;
                if  (filtros.fechaInicio){

                    cumpleFiltros = cumpleFiltros && 
                    new Date(ticket.fechaProgramada).getTime() >= filtros.fechaInicio
                }
                if (filtros.fechaFin) {
                    cumpleFiltros = cumpleFiltros && 
                    new Date(ticket.fechaProgramada).getTime() <= filtros.fechaFin;
                }

                if (filtros.numeroDeControl) {
                    cumpleFiltros = cumpleFiltros && 
                        ticket.numeroDeControl == filtros.numeroDeControl;
                }

                if (filtros.tipoTramite) {
                    cumpleFiltros = cumpleFiltros && 
                        ticket.tipoTramite == filtros.tipoTramite;
                }
                return cumpleFiltros;
            });
        }

        return {
            total: ticketsFiltrados.length,
            atendidos: ticketsFiltrados.filter(t => t.estado === TicketEstado.ATENDIDO).length,
            cancelados: ticketsFiltrados.filter(t => t.estado === TicketEstado.CANCELADO).length,
            expirados: ticketsFiltrados.filter(t => t.estado === TicketEstado.EXPIRADO).length,
            porTipoTramite: this.agruparPorTipoTramite(ticketsFiltrados),
            tickets: ticketsFiltrados.sort((a, b) => new Date(b.fechaProgramada).getTime() - new Date(a.fechaProgramada).getTime())
        } as StatResults;
    }

    private agruparPorTipoTramite(tickets: TicketHistorial[]) {
        return tickets.reduce((acc, ticket) => {
            acc[ticket.tipoTramite] = (acc[ticket.tipoTramite] || 0) + 1;
            return acc;
        }, {} as Record<TramiteType, number>);
    }

    private async obtenerHistorial(): Promise<TicketHistorial[]> {
        try {
            const data = JSON.parse(fs.readFileSync(this.historialPath, 'utf-8'));
            if (Object.keys(data).length === 0)
                return [] as TicketHistorial[];
            return data as TicketHistorial[];
        } catch (error) {
            throw new Error("Error al obtener el historial");
        }
    }
}