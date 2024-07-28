import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Colas } from './classes/Colas';
import { Ticket } from './types/Ticket';
import { TramiteType } from './enums/TramiteType';
dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

// Crea las colas de los trámites
export let colas = new Colas();
colas.cargarColas();

// const ticket: Ticket = {
//   id: 1,
//   letra: 'A',
//   numero: 1,
//   tipoTramite: TramiteType.BECA,
//   data: { numeroDeControl: 1234568 } as unknown as JSON,
// };

// colas.agregarTicket(ticket);
// colas.guardarColas();
// Crea una variable global con las colas
app.locals.colas = colas;


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});