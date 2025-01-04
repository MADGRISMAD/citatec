import { Dias } from "shared-types";
import { redondearAMultiploDe5 } from "../utils/tramites";

export function HOY(): Date {
    const hoy :Date = new Date();
    redondearAMultiploDe5(hoy, hoy.getMinutes());
    return hoy;
}
// 8:00 AM
function INICIO_HORARIO(): Date{
    const hoy:Date = HOY();
    return new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 8, 0, 0);
    
}
// 4:00 PM
function FIN_HORARIO(): Date {
    const hoy:Date = HOY();
    return new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 0, 0);
}

export const DIAS_DISPONIBLES: Dias[] = [Dias.MONDAY, Dias.TUESDAY, Dias.WEDNESDAY, Dias.THURSDAY , Dias.FRIDAY, Dias.SATURDAY, Dias.SUNDAY];

export const HORARIO: Record<string, Date> = {
    INICIO: INICIO_HORARIO(),
    FINAL: FIN_HORARIO(),
};
