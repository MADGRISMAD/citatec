import { TramiteConfig } from "shared-types";
import { colas } from "..";
import { Colas } from "../classes/Colas";
import { TramiteManager } from "../classes/TramiteManager";

// TramiteService.ts
const tramiteManager = new TramiteManager();
export class TramiteService {
    private colas: Colas;
    
    constructor() {
        this.colas = colas;
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
    
    public getTramites(): TramiteConfig[] {
        return tramiteManager.getTramites();
    }
    public getActiveTramites(): TramiteConfig[] {
        return tramiteManager.getActiveTramites();
    }
    public getTramite(nombre: string): TramiteConfig | undefined {
        return tramiteManager.getTramite(nombre);
    }
    
    public activarTramite(nombre: string): void {
        this.colas.activarTramite(nombre);
    }
    public validateTramiteType(tramite: string) {
        if (this.getTramite(tramite)) {
            return this.getTramite(tramite)?.active;
        }
        return false;
    }
}