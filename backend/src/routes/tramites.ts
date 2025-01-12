import {
    activarTramite,
    agregarTramite,
    desactivarTramite,
    modificarDuracionTramite,
    obtenerTramites,
    obtenerTramitesActivos,
} from "../controllers/tramites";
import { verifyFingerprint } from "../middlewares/authFingerprint";

const express = require("express");
export const router = express();

router.get("/", verifyFingerprint, obtenerTramites);

router.get("/activos", obtenerTramitesActivos);

router.post("/", verifyFingerprint, agregarTramite);

router.put("/activar", verifyFingerprint, activarTramite);

router.put("/desactivar", verifyFingerprint, desactivarTramite);

router.put("/duracion", verifyFingerprint, modificarDuracionTramite);
