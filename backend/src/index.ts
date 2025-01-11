import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Colas } from './classes/Colas';
import ConfigManager from './classes/ConfigManager';
import dgram from 'dgram';
import { checkFingerprint } from './middlewares/authFingerprint';

const cors = require('cors');


const app: Express = express();
const port = ConfigManager.get('PORT');


app.use(cors({
  origin: ['http://localhost:8080', 'https://localhost:8080', true]
}));

// Permite JSON (application/json) en las peticiones
app.use(express.json());


// Crea las colas de los trámites
export let colas: Colas = new Colas();
colas.cargarColas();




app.locals.colas = colas;

// middleware
app.use(checkFingerprint);

// Rutas
import { router as ticketsRouter } from './routes/tickets';
import { router as tramitesRouter } from './routes/tramites';
import { router as statsRouter } from './routes/stats';
import { router as materiasRouter } from './routes/materias';
app.use('/tickets', ticketsRouter);
app.use('/tramites', tramitesRouter);
app.use('/stats', statsRouter)
app.use('/materias', materiasRouter)
// HEALTH CHECK
app.get('/health', (req: Request, res: Response) => {
  res.send('Healthy');
});
const server = dgram.createSocket('udp4');

server.bind(() => {
  server.setBroadcast(true);
  setInterval(() => {
    server.send(JSON.stringify({
      type: 'backend-discovery',
      port: port // puerto donde corre tu API
    }), 45678, '255.255.255.255');
  }, 5000);
});



app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});