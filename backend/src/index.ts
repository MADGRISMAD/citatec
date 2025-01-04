import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Colas } from './classes/Colas';
import { Ticket, TramiteType } from 'shared-types';
import { v4 as uuidv4 } from 'uuid';
import ConfigManager from './classes/ConfigManager';

const cors = require('cors');


const app: Express = express();
const port = ConfigManager.get('PORT');


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


app.locals.colas = colas;

// Rutas
import { router as ticketsRouter } from './routes/tickets';
import { router as tramitesRouter } from './routes/tramites';
import { router as statsRouter } from './routes/stats';

app.use('/tickets', ticketsRouter);
app.use('/tramites', tramitesRouter);
app.use('/stats', statsRouter)
// HEALTH CHECK
app.get('/health', (req: Request, res: Response) => {
  res.send('Healthy');
});


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});