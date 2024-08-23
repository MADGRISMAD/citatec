import { SetTramiteDuration, TramiteType } from 'shared-types';
import { Request, Response } from 'express';
import { tramiteDuration } from '../constants/tramite';

export const obtenerTramites = async (req: Request, res: Response) => {
    // Une el enum TramiteType y el tiempo de cada tramite
    const tramites:TramiteType[] = Object.values(TramiteType);
    let respuesta: SetTramiteDuration[] = [];
    for(let i = 0; i < tramites.length; i++){
        const object: SetTramiteDuration = {tramite: tramites[i], duration: tramiteDuration[tramites[i]] }
        respuesta.push(object);
    }

    res.send(respuesta);
}
