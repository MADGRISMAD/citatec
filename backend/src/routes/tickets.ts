import express from 'express';
import { buscarTicket, crearTicket, eliminarTicket, obtenerSiguienteTicket } from '../controllers/tickets';
export const router = express();

router.post('/', crearTicket);

router.get("/siguiente", obtenerSiguienteTicket);

router.get('/:tramiteType/:ticketId', buscarTicket);

router.delete('/:tramiteType/:ticketId', eliminarTicket);