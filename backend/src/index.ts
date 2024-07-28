import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Colas } from './classes/Colas';
dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

// Crea las colas de los trámites
export let colas = new Colas();
colas.cargarColas();

// Crea una variable global con las colas
app.locals.colas = colas;


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});