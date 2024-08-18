import { TramiteType } from "../../../shared/src/enums/TramiteType";

export function isTramiteType(value: TramiteType): boolean {
    return Object.values(TramiteType).includes(value);
}

export function redondearAMultiploDe5(fecha: Date, minutos: number): void {
    fecha.setMinutes(Math.ceil(minutos / 5) * 5,0, 0);
}