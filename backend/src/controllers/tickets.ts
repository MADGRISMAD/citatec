import { Request, Response } from "express";
import { TramiteType } from "../enums/TramiteType";
import { Ticket } from "../types/Ticket";
import { colas } from "..";
import { isTramiteType } from "../utils/tramites";
import { NotAnymoreTicketsError, TicketNotFoundError } from "../classes/Errores";
import { v4 as uuidv4 } from "uuid";

export function buscarTicket(req: Request, res: Response) {
    const { tramiteType, ticketId } = req.params as unknown as { tramiteType: TramiteType, ticketId: string };
    if (!tramiteType || !ticketId) {
        return res.status(400).json({ message: 'Missing parameters' });
    }
    if (!isTramiteType(tramiteType)) {
        return res.status(400).json({ message: 'Invalid tramite type' });
    }
    const ticket = colas.buscarTicket(tramiteType, ticketId);

    if (ticket) {
        return res.send(ticket) as Response;
    }

    return res.status(404).json({ message: 'Ticket not found' });

}

export function obtenerSiguienteTicket(req: Request, res: Response) {
    try {
        const ticket: Ticket = colas.obtenerSiguienteTicket();
        return res.status(200).send(ticket);

    }
    catch (e: any) {
        if (e instanceof NotAnymoreTicketsError)
            return res.status(204).json({ message: e.message });

        else (e instanceof Error)
        return res.status(500).json({ message: e.message });

    }
}

export function eliminarTicket(req: Request, res: Response) {
    const { tramiteType, ticketId } = req.params as unknown as { tramiteType: TramiteType, ticketId: string };
    console.log(tramiteType, ticketId);
    if (!tramiteType || !ticketId) {
        return res.status(400).json({ message: 'Missing parameters' });
    }
    if (!isTramiteType(tramiteType)) {
        return res.status(400).json({ message: 'Invalid tramite type' });
    }
    try {
        colas.cancelarTicket(tramiteType, ticketId);
        return res.status(200).json({ message: 'Ticket deleted' });
    }
    catch (e: any) {
        if (e instanceof TicketNotFoundError) {
            return res.status(404).json({ message: e.message });
        }
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export function crearTicket(req: Request, res: Response) {
    try {

        const ticket = {
            id: uuidv4(),
            ...req.body
        } as Ticket;
        if (!ticket.tipoTramite || !ticket) {
            return res.status(400).json({ message: 'Missing parameters' });
        }
        if (!isTramiteType(ticket.tipoTramite)) {
            return res.status(400).json({ message: 'Invalid tramite type' });
        }

        try {
            const ticketExistenteEnTramite = colas.buscarTicketPorNumControl(ticket.tipoTramite, ticket.data.numControl);
            if (ticketExistenteEnTramite) {
                return res.status(400).json({ message: 'El número de control ya tiene un ticket en la cola de ' + ticketExistenteEnTramite.tipoTramite, data: ticketExistenteEnTramite });
            }

        }
        catch { }



        colas.agregarTicket(ticket);
        return res.status(201).send(ticket);
    }
    catch (e: any) {
        return res.status(500).json({ message: e.message });
    }
}