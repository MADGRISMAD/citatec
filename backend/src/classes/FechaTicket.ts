// DEPRECATED
import { HOY } from "../constants/horario";
import { Dias } from "../enums/Dias";
import { redondearAMultiploDe5 } from "../utils/tramites"

export class FechaTicket {

    public constructor(private fecha: Date = HOY) {
        fecha.setMinutes(redondearAMultiploDe5(fecha.getMinutes()));
        fecha.setSeconds(0);
        this.fecha = fecha;
    }

    public getDate(): Date {
        return this.fecha;
    }

    public setDate(fecha: Date): void {
        fecha.setSeconds(0);
        this.fecha = fecha;
    }

    public getHours(): number {
        return this.fecha.getHours();
    }

    public getMinutes(): number {
        return this.fecha.getMinutes();
    }

    public setSiguienteDiaDisponible(): void {
        this.fecha.setDate(this.fecha.getDate() + 1);
        if (this.fecha.getDay() === Dias.SUNDAY) {
            this.fecha.setDate(this.fecha.getDate() + 1);
        }
        else if (this.fecha.getDay() === Dias.SATURDAY) {
            this.fecha.setDate(this.fecha.getDate() + 2);
        }

    }

    public setHours(hours: number): void {
        this.fecha.setHours(hours);
    }

    public setMinutes(minutes: number): void {
        this.fecha.setMinutes(redondearAMultiploDe5(minutes));
    }
}