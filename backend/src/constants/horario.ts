import { Dias } from "shared-types";
import { redondearAMultiploDe5 } from "../utils/tramites";
import ConfigManager from "../classes/ConfigManager";

export function HOY(): Date {
    const hoy :Date = new Date();
    redondearAMultiploDe5(hoy, hoy.getMinutes());
    return hoy;
}

if (ConfigManager.get("START_HOUR") as number < 0 || ConfigManager.get("START_HOUR") as number > 23) {
    throw new Error("Invalid START_HOUR value");
}

if (ConfigManager.get("END_HOUR") as number < 0 || ConfigManager.get("END_HOUR") as number > 23) {
    throw new Error("Invalid END_HOUR value");
}

if(ConfigManager.get("START_HOUR") >= ConfigManager.get("END_HOUR")) {
    throw new Error("START_HOUR must at least 1 hour before END_HOUR");
}

function INICIO_HORARIO(): Date{
    const hoy:Date = HOY();
    return new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), ConfigManager.get("START_HOUR"), 0, 0);
    
}


function FIN_HORARIO(): Date {
    const hoy:Date = HOY();
    return new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), ConfigManager.get("END_HOUR"), 0, 0);
}

const RANGO_DIAS = ConfigManager.get("DAYS") as string;
const [INICIO_DIAS, FINAL_DIAS]= RANGO_DIAS.split("-").map(Number);

export const DIAS_DISPONIBLES: Dias[] = [];

if (INICIO_DIAS < 0 || INICIO_DIAS > 6) {
    throw new Error("Invalid DAYS value");
}

if (FINAL_DIAS < 0 || FINAL_DIAS > 6) {
    throw new Error("Invalid DAYS value");
}

if (INICIO_DIAS > FINAL_DIAS) {
    throw new Error("Invalid DAYS value");
}

for (let i = INICIO_DIAS; i <= FINAL_DIAS; i++) {
    DIAS_DISPONIBLES.push(i );
}
export const HORARIO: Record<string, Date> = {
    INICIO: INICIO_HORARIO(),
    FINAL: FIN_HORARIO(),
};
