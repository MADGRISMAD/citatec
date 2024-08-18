import { TramiteType } from 'shared-types';
import { Request, Response } from 'express';
export const obtenerTramites = async (req: Request, res: Response) => {
    res.status(200).send(Object.values(TramiteType));
}
