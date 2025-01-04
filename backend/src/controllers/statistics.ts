import { Request, Response } from "express";
import { TicketStatsService } from "../classes/TicketStatsService";
import { TramiteType } from "shared-types";
export async function obtenerEstadisticas(req: Request, res: Response) {
    try {
        const filtros = {
            fechaInicio: req.query.fechaInicio
                ? new Date(req.query.fechaInicio as string)
                : undefined,
            fechaFin: req.query.fechaFin
                ? new Date(req.query.fechaFin as string)
                : undefined,
            numeroDeControl: req.query.numeroDeControl
                ? Number(req.query.numeroDeControl)
                : undefined,
            tipoTramite: req.query.tipoTramite as TramiteType,
        };
        const statsService = new TicketStatsService();
        const estadisticas = await statsService.obtenerEstadisticas(filtros);
        res.json(estadisticas);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener estadísticas" });
    }
}