import express, { Request, Response } from 'express';
import { TramiteType } from '../enums/TramiteType';
import { buscarTicket } from '../controllers/tickets';
export const router = express();

router.get('/', (req: Request, res: Response): void => {
    res.send('Tickets');
});

router.get('/:tramiteType/:ticketNumber', buscarTicket);