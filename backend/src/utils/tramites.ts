import { TramiteType } from "../enums/TramiteType";

export function isTramiteType(value: TramiteType): boolean {
    return Object.values(TramiteType).includes(value);
}