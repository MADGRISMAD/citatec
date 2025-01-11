import  express from 'express';
import { buscarTicket, crearTicket, eliminarTicket, obtenerTicketsDelDia } from '../controllers/tickets';
import { verifyFingerprint } from '../middlewares/authFingerprint';
export const router = express();

router.post('/:tramiteType/:numeroDeControl', crearTicket);

// router.get("/siguiente/", obtenerSiguienteTicket);

router.get('/:tramiteType/:ticketId', buscarTicket);

router.delete('/:tramiteType/:ticketId/:unschedulable/:estado', eliminarTicket);

router.get("/:diaToDateString", verifyFingerprint, obtenerTicketsDelDia);