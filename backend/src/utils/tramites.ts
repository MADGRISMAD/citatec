import { TramiteType } from "../enums/TramiteType";

export function isTramiteType(value: TramiteType): boolean {
    return Object.values(TramiteType).includes(value);
}

export function redondearAMultiploDe5(fecha: Date, value: number): void {
    fecha.setMinutes(Math.floor(value / 5) * 5);
    fecha.setSeconds(0);
}