import express, { Express, Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { Colas } from './classes/Colas';
import { Ticket, TramiteType } from 'shared-types';
import { v4 as uuidv4 } from 'uuid';
import { ConfigManager } from './classes/ConfigLoader';
import { defaults } from './config/defaults';

const cors = require('cors');
dotenv.config();

export const config = ConfigManager.getInstance({
  configPath: process.env.CONFIG_FILE_PATH,
  defaults: {
    ...defaults
  },
});

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