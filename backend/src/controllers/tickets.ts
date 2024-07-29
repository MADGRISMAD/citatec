import { Request, Response } from "express";
import { TramiteType } from "../enums/TramiteType";
import { Ticket } from "../types/Ticket";
import { colas } from "..";
import { isTramiteType } from "../utils/tramites";

export function buscarTicket(req: Request, res: Response) {
    const { tramiteType, ticketNumber } = req.params as unknown as { tramiteType: TramiteType, ticketNumber: number };
    if (!tramiteType || !ticketNumber) {
        return res.status(400).json({ message: 'Missing parameters' });
    }
    if (!isTramiteType(tramiteType)) {
        return res.status(400).json({ message: 'Invalid tramite type' });
    }
    const ticket = colas.buscarTicket(tramiteType, ticketNumber);

    if (ticket) {
        return res.send(ticket) as Response;
    }

    return res.status(404).json({ message: 'Ticket not found' });

}