import { TramiteType } from "../enums/TramiteType";

export function isTramiteType(value: TramiteType): boolean {
    return Object.values(TramiteType).includes(value);
}

export function redondearAMultiploDe5(value: number): number {
    return Math.floor(value / 5) * 5;
}