import { Request, Response } from "express";
import { TicketStatsService } from "../classes/TicketStatsService";
import { StatsFilter } from "shared-types";
export async function obtenerEstadisticas(req: Request, res: Response) {
    try {
        const filtros: StatsFilter = 
        {
            fechaInicio: req.query.fechaInicio ? parseInt(req.query.fechaInicio as string) : undefined,
            fechaFin: req.query.fechaFin ? parseInt(req.query.fechaFin as string) : undefined,
            numeroDeControl: req.query.numeroDeControl ? parseInt(req.query.numeroDeControl as string) : undefined,
            tipoTramite: req.query.tipoTramite && req.query.tipoTramite != "Todos" ? req.query.tipoTramite as string : undefined,
        };
        console.log(filtros.numeroDeControl);
        const statsService = new TicketStatsService();
        const historialFiltrado = statsService.filtrarHistorial(filtros);
        const estadisticas = statsService.obtenerEstadisticasDeFiltro(historialFiltrado);
        res.json(estadisticas);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al obtener estadísticas" });
    }
}