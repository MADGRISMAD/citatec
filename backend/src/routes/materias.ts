import express from 'express';
import multer from 'multer';
import { Request, Response } from 'express';
import fs from 'fs';
import { fileFilter, storage } from '../config/multer';
import { checkFingerprint, verifyFingerprint } from '../middlewares/authFingerprint';
import { MATERIAS_PATH } from '../constants/paths';
import { outputLog } from 'shared-types';
import ConfigManager from '../classes/ConfigManager';

export const router = express.Router();

const upload = multer({
    storage: storage,
    fileFilter,
    limits: {
        fileSize: 1000000 // 1MB
    }
})


// Rutas
router.get('/', checkFingerprint,  (req: Request, res: Response) => {
    try {
        if (!fs.existsSync(MATERIAS_PATH)) {
            return res.status(404).send('No hay materias cargadas');
        }
        const file = fs.readFileSync(MATERIAS_PATH);
        res.contentType('application/pdf');
        res.send(file);
    } catch (error) {
        console.error('Error al leer el archivo:', error);
        res.status(500).send('Error al leer el archivo');
    }
});

router.post('/', upload.single('file'), (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).send('No se recibió ningún archivo');
        }
        return res.status(200).send('Archivo subido correctamente');
    } catch (error) {
        console.error('Error al guardar el archivo:', error);
        return res.status(500).send('Error al guardar el archivo');
    }
});