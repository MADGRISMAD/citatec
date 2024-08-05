import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Colas } from './classes/Colas';
import { Ticket } from './types/Ticket';
import { TramiteType } from './enums/TramiteType';
import { v4 as uuidv4 } from 'uuid';
dotenv.config();

const app: Express = express();
const port = process.env.PORT;

// Permite JSON (application/json) en las peticiones
app.use(express.json());


// Crea las colas de los trámites
export let colas: Colas = new Colas();
colas.cargarColas();


const ticket: Ticket = {
  id: uuidv4(),
  letra: 'B',
  numero: 1,
  tipoTramite: TramiteType.BECA,
  data: JSON.parse(JSON.stringify({ numControl: 1234 })),
  fechaProgramada: new Date()
}


// colas.agregarTicket(ticket);
// colas.agregarTicket(ticket2);
console.log(colas.obtenerTickets());
// Crea una variable global con las colas
app.locals.colas = colas;


// Rutas
import { router as ticketsRouter } from './routes/tickets';

app.use('/tickets', ticketsRouter);

// HEALTH CHECK
app.get('/health', (req: Request, res: Response) => {
  res.send('Healthy');
});


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});