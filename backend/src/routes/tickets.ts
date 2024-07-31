import express, { Request, Response } from 'express';
import { TramiteType } from '../enums/TramiteType';
import { buscarTicket, eliminarTicket, obtenerSiguienteTicket } from '../controllers/tickets';
export const router = express();

router.get('/', (req: Request, res: Response): void => {
    res.send('Tickets');
});
router.get("/siguiente", obtenerSiguienteTicket);

router.get('/:tramiteType/:ticketId', buscarTicket);

router.delete('/:tramiteType/:ticketId', eliminarTicket);