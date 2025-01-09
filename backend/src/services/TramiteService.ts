import { Colas } from "../classes/Colas";

// TramiteService.ts
export class TramiteService {
    private colas: Colas;

    constructor() {
        this.colas = new Colas();
    }

    public agregarTramite(nombre: string, duracion: number): void {
        this.colas.agregarNuevoTramite(nombre, duracion);
    }

    public desactivarTramite(nombre: string): void {
        this.colas.desactivarTramite(nombre);
    }

    public modificarDuracionTramite(nombre: string, nuevaDuracion: number): void {
        this.colas.modificarDuracionTramite(nombre, nuevaDuracion);
    }
}