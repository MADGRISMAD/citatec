import { Request, Response } from "express";
import { Ticket, TicketEstado, TramiteType, outputLog } from "shared-types";
import { colas } from "..";
import { isTramiteType } from "../utils/tramites";
import {
    NotAnymoreTicketsError,
    TicketNotFoundError,
} from "../classes/Errores";
import { v4 as uuidv4 } from "uuid";
import { tramiteLetter } from "../constants/tramite";
export function buscarTicket(req: Request, res: Response) {
    const { tramiteType, ticketId } = req.params as unknown as {
        tramiteType: TramiteType;
        ticketId: string;
    };
    if (!tramiteType || !ticketId) {
        return res.status(400).json({ message: "Missing parameters" });
    }
    if (!isTramiteType(tramiteType)) {
        return res.status(400).json({ message: "Invalid tramite type" });
    }
    const ticket = colas.buscarTicket(tramiteType, ticketId);

    if (ticket) {
        return res.send(ticket) as Response;
    }

    return res.status(404).json({ message: "Ticket not found" });
}

export function obtenerSiguienteTicket(req: Request, res: Response) {
    try {
        
        const ticket: Ticket = colas.obtenerSiguienteTicket();
        
        return res.status(200).send(ticket);
    } catch (e: any) {
        if (e instanceof NotAnymoreTicketsError)
            return res.status(204).json({ message: e.message });
        else e instanceof Error;
        return res.status(500).json({ message: e.message });
    }
}

export function eliminarTicket(req: Request, res: Response) {
    const { tramiteType, ticketId, unschedulable, estado } = req.params as unknown as {
        tramiteType: TramiteType;
        ticketId: string;
        unschedulable: boolean;
        estado: TicketEstado;
    };
    if (!tramiteType || !ticketId) {
        return res.status(400).json({ message: "Missing parameters" });
    }
    if (!isTramiteType(tramiteType)) {
        return res.status(400).json({ message: "Invalid tramite type" });
    }
    try {
        colas.cancelarTicket(tramiteType, ticketId, unschedulable, estado );

        return res.status(200).json({ message: "Ticket deleted" });
    } catch (e: any) {
        if (e instanceof TicketNotFoundError) {
            return res.status(404).json({ message: e.message });
        }
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export function crearTicket(req: Request, res: Response) {
    try {
        const {numeroDeControl, tramiteType} = req.params as unknown as {numeroDeControl: number, tramiteType: TramiteType};
        if (!isTramiteType(tramiteType)) {
            return res.status(400).json({ message: "Invalid tramite type" });
        }
        const ticket = {
            id: uuidv4(),
            letra: tramiteLetter[tramiteType],
            numeroDeControl: numeroDeControl,
            tipoTramite: tramiteType,
        } as Ticket;
        if (!ticket.tipoTramite || !ticket) {
            return res.status(400).json({ message: "Missing parameters" });
        }

        try {
            const ticketExistenteEnTramite: Ticket =
                colas.buscarTicketPorNumControl(
                    tramiteType,
                    ticket.numeroDeControl
                );
            if (ticketExistenteEnTramite) {
                return res.status(400).json({
                    message: "Ya tienes un ticket para este tramite",
                    data: ticketExistenteEnTramite,
                });
            }
        } catch (e: any) {}

        colas.agregarTicket(ticket);
        return res.status(201).send(ticket);
    } catch (e: any) {
        outputLog(e);
        return res.status(500).json({ message: e.message });
    }
}

export function obtenerTodosLosTickets(req: Request, res: Response) {
    try {
        
        const tickets: Record<TramiteType, Ticket[]> = colas.obtenerTodosLosTickets();
        return res.status(200).send(tickets);
    } catch (e: any) {
        if (e instanceof NotAnymoreTicketsError)
            return res.status(204).json({ message: e.message });
        else e instanceof Error;
        return res.status(500).json({ message: e.message });
    }
}
export function obtenerTicketsDelDia(req: Request, res: Response) {
    try {
        const{diaToDateString} = req.params as unknown as {diaToDateString: string};
        const tickets: Ticket[] = colas.obtenerTicketsDelDia(diaToDateString);
        return res.status(200).send(tickets);
    } catch (e: any) {
        if (e instanceof NotAnymoreTicketsError)
            return res.status(204).json({ message: e.message });
        else e instanceof Error;
        return res.status(500).json({ message: e.message });
    }
}