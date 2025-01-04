import express from 'express';
import { obtenerEstadisticas } from '../controllers/statistics';

export const router = express.Router();

router.get('/', obtenerEstadisticas);

// // Endpoint para guardar en historial cuando un ticket es atendido o cancelado
// router.post('/historial', async (req, res) => {
//     try {
//         const ticketHistorial: TicketHistorial = {
//             ...req.body,
//             fechaCreacion: new Date(),
//             fechaAtencion: new Date()
//         };
//         await statsService.guardarEnHistorial(ticketHistorial);
//         res.json({ message: 'Ticket guardado en historial' });
//     } catch (error) {
//         res.status(500).json({ error: 'Error al guardar en historial' });
//     }
// });