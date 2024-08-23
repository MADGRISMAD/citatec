const express = require('express');
const { buscarTicket, crearTicket, eliminarTicket, obtenerSiguienteTicket } = require('../controllers/tickets')
export const router = express();

router.post('/:tramiteType/:numeroDeControl', crearTicket);

router.get("/siguiente", obtenerSiguienteTicket);

router.get('/:tramiteType/:ticketId', buscarTicket);

router.delete('/:tramiteType/:ticketId', eliminarTicket);