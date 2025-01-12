import express from 'express';
import { obtenerEstadisticas } from '../controllers/statistics';
import { verifyFingerprint } from '../middlewares/authFingerprint';

export const router = express.Router();

router.use(verifyFingerprint)

router.get('/', obtenerEstadisticas);
