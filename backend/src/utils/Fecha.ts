import { Dias } from "../enums/Dias";

export function setSiguienteDiaDisponible(fecha: Date): Date {
    fecha.setDate(fecha.getDate() + 1);
    if (fecha.getDay() === Dias.SUNDAY) {
        fecha.setDate(fecha.getDate() + 1);
    }
    else if (fecha.getDay() === Dias.SATURDAY) {
        fecha.setDate(fecha.getDate() + 2);
    }
    return fecha;
}
export function compararRangosDeFechas(a: [Date, Date], b: [Date, Date]): number {
    if(a[0].getTime() !== b[0].getTime()) return a[0].getTime() - b[0].getTime();
    return a[1].getTime() - b[1].getTime();
}