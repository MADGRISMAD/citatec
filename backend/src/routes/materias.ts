import express from 'express';
import multer from 'multer';
import { Request, Response } from 'express';
import fs from 'fs';
import { fileFilter } from '../config/multer';
import { verifyFingerprint } from '../middlewares/authFingerprint';
import { MATERIAS_PATH } from '../constants/paths';

export const router = express.Router();

const upload = multer({ fileFilter: fileFilter});


// Rutas
router.get('/', (req: Request, res: Response) => {
    try {
        if (!fs.existsSync(MATERIAS_PATH)) {
            res.status(404).send('No hay materias cargadas');
        }
        const file = fs.readFileSync(MATERIAS_PATH);
        res.contentType('application/pdf');
        res.send(file);
    } catch (error) {
        console.error('Error al leer el archivo:', error);
        res.status(500).send('Error al leer el archivo');
    }
});

router.post('/',verifyFingerprint, upload.single('file'), (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).send('No se recibió ningún archivo');
        }
        fs.writeFileSync(MATERIAS_PATH, req.file.buffer);
        return res.status(200).send('Archivo subido correctamente');
    } catch (error) {
        console.error('Error al guardar el archivo:', error);
        return res.status(500).send('Error al guardar el archivo');
    }
});