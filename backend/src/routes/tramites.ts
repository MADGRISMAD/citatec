import { obtenerTramites } from "../controllers/tramites";

const express = require('express');
export const router = express();

router.get('/', obtenerTramites);