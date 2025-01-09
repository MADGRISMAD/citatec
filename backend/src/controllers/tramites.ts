import { Request, Response } from 'express';
import { TramiteService } from '../services/TramiteService';
import { TramiteManager } from '../classes/TramiteManager';

const tramiteService = new TramiteService();
export const obtenerTramites = (req: Request, res: Response) => {
    const tramites = tramiteService.getTramites();
    res.json(tramites);

}

export const obtenerTramitesActivos = (req: Request, res: Response) => {
    res.send(tramiteService.getActiveTramites());
}

export const agregarTramite = (req: Request, res: Response) => {
    const { nombre, duracion } = req.body as { nombre: string, duracion: number };

    if (tramiteService.getTramite(nombre)) {
        res.status(400).send('Tramite ya existe');
        return
    }

    if (duracion < 0) {
        res.status(400).send('Duracion no puede ser negativa');
        return
    }

    if(!nombre || !duracion){
        res.status(400).send('Faltan datos');
        return
    }

    tramiteService.agregarTramite(nombre, duracion);
    res.send('Tramite agregado');
}

export const desactivarTramite = (req: Request, res: Response) => {
    const { nombre } = req.body;

    if (!tramiteService.getTramite(nombre)) {
        res.status(404).send('Tramite no existe');
        return
    }

    if (!nombre) {
        res.status(400).send('Faltan datos');
        return
    }

    tramiteService.desactivarTramite(nombre);
    res.send('Tramite desactivado');
}

export const activarTramite = (req: Request, res: Response) => {
    const { nombre } = req.body;

    if (!tramiteService.getTramite(nombre)) {
        res.status(404).send('Tramite no existe');
        return
    }

    if (!nombre) {
        res.status(400).send('Faltan datos');
        return
    }

    tramiteService.activarTramite(nombre);
    res.send('Tramite activado');
}

export const modificarDuracionTramite = (req: Request, res: Response) => {
    const { nombre, nuevaDuracion } = req.body;

    if (!tramiteService.getTramite(nombre)) {
        res.status(404).send('Tramite no existe');
        return
    }

    if (!nombre || !nuevaDuracion) {
        res.status(400).send('Faltan datos');
        return
    }

    if (nuevaDuracion < 0) {
        res.status(400).send('Duracion no puede ser negativa');
        return
    }

    tramiteService.modificarDuracionTramite(nombre, nuevaDuracion);
    res.send('Duracion modificada');
}