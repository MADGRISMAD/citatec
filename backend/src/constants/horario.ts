import { redondearAMultiploDe5 } from "../utils/tramites";

export function HOY(): Date {
    const hoy :Date = new Date();
    redondearAMultiploDe5(hoy, hoy.getMinutes());
    return hoy;
}
// 8:00 AM
function INICIO_HORARIO(): Date{
    const HOY:Date = new Date();
    return new Date(HOY.getFullYear(), HOY.getMonth(), HOY.getDate(), 8, 0, 0);
    
}
// 4:00 PM
function FIN_HORARIO(): Date {
    const HOY:Date = new Date();
    return new Date(HOY.getFullYear(), HOY.getMonth(), HOY.getDate(), 16, 0, 0);
}

export const HORARIO: Record<string, Date> = {
    INICIO: INICIO_HORARIO(),
    FINAL: FIN_HORARIO(),
};
