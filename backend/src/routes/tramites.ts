import { agregarTramite, desactivarTramite, modificarDuracionTramite, obtenerTramites, obtenerTramitesActivos } from "../controllers/tramites";

const express = require('express');
export const router = express();

router.get('/', obtenerTramites);

router.get('/activos', obtenerTramitesActivos);

router.post('/', agregarTramite);

router.put('/', desactivarTramite);

router.put('/duracion/', modificarDuracionTramite);