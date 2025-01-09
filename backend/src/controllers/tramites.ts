import { Request, Response } from 'express';
import { TramiteService } from '../services/TramiteService';
import { TramiteManager } from '../classes/TramiteManager';

const tramiteManager = new TramiteManager();
export const obtenerTramites = (req: Request, res: Response) => {
    const tramites = tramiteManager.getTramites();
    res.json(tramites);

}

export const obtenerTramitesActivos = (req: Request, res: Response) => {
    res.send(tramiteManager.getActiveTramites());
}
