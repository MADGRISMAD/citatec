import { DIAS_DISPONIBLES } from "../constants/horario";

export function setSiguienteDiaDisponible(fecha: Date): Date {
    while(true) {
        fecha.setDate(fecha.getDate() + 1);
        if(esDiaDisponible(fecha)) break;
    }
    return fecha;
}
export function compararRangosDeFechas(a: [Date, Date], b: [Date, Date]): number {
    if(a[0].getTime() !== b[0].getTime()) return a[0].getTime() - b[0].getTime();
    return a[1].getTime() - b[1].getTime();
}

export function esDiaDisponible(fecha: Date): boolean {
    return DIAS_DISPONIBLES.includes(fecha.getDay());
}