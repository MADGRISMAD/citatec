import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Colas } from './classes/Colas';
import { outputLog, Ticket, TramiteType } from 'shared-types';
import { v4 as uuidv4 } from 'uuid';
const cors = require('cors');
dotenv.config();


const app: Express = express();
const port = process.env.PORT;


app.use(cors({
  origin: 'http://localhost:8080',
}));

// Permite JSON (application/json) en las peticiones
app.use(express.json());


// Crea las colas de los trámites
export let colas: Colas = new Colas();
colas.cargarColas();


const ticket: Ticket = {
  id: uuidv4(),
  letra: 'B',
  numeroDeControl: 1,
  tipoTramite: TramiteType.BECA,
  fechaProgramada: new Date()
}


// colas.agregarTicket(ticket);
// colas.agregarTicket(ticket2);
// outputLog(colas.obtenerTickets());
// Crea una variable global con las colas
app.locals.colas = colas;

// Rutas
import { router as ticketsRouter } from './routes/tickets';
import { router as tramitesRouter } from './routes/tramites';

app.use('/tickets', ticketsRouter);
app.use('/tramites', tramitesRouter);

// HEALTH CHECK
app.get('/health', (req: Request, res: Response) => {
  res.send('Healthy');
});


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});