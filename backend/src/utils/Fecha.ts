import { DIAS_DISPONIBLES } from "../constants/horario";

export function setSiguienteDiaDisponible(fecha: Date): Date {
    while(true) {
        fecha.setDate(fecha.getDate() + 1);
        if(esDiaDisponible(fecha)) break;
    }
    return fecha;
}
export function compararRangosDeFechas(a: [Date, Date], b: [Date, Date]): number {
    const A : [Date, Date] = [new Date(a[0]), new Date(a[1])];
    const B : [Date, Date] = [new Date(b[0]), new Date(b[1])];
    if(A[0].getTime() !== B[0].getTime()) return A[0].getTime() - B[0].getTime();
    return A[1].getTime() - B[1].getTime();
}

export function esDiaDisponible(fecha: Date): boolean {
    return DIAS_DISPONIBLES.includes(fecha.getDay());
}