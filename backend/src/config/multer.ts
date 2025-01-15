import { Request } from 'express'
import multer, { FileFilterCallback } from 'multer'
import path from 'path'
import { MATERIAS_PATH } from '../constants/paths';
import fs from 'fs'
export const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Asegúrate de que el directorio existe
        const dir = path.dirname(MATERIAS_PATH);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // Usa el nombre del archivo original o un nombre fijo
        cb(null, path.basename(MATERIAS_PATH));
    }
});

export const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
): void => {
    const ext= path.extname(file.originalname)
    const allowedExtensions = ['.pdf']
    if (
        allowedExtensions.includes(ext)
    ) {
        callback(null, true)
    } else {
        callback(null, false)
    }
}