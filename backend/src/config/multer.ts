import { Request } from 'express'
import multer, { FileFilterCallback } from 'multer'
import path from 'path'
import { MATERIAS_PATH } from '../constants/paths';
import fs from 'fs'
import ConfigManager from '../classes/ConfigManager';
export const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Asegúrate de que el directorio existe
        const dir = ConfigManager.get("DATA_PATH") as string;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // Usa el nombre del archivo original o un nombre fijo
        cb(null, 'materias.pdf');
    }
});

export const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
): void => {

    if (
        file.mimetype === 'application/pdf'
    ) {
        callback(null, true)
    } else {
        callback(null, false)
    }
}