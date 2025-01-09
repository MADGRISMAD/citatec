import fs from 'fs';
import ConfigManager from './ConfigManager';
import { TramiteConfig } from 'shared-types';

export class TramiteManager {
    private tramites: Map<string, TramiteConfig> = new Map();

    constructor() {
        // Inicializar con los trámites por defecto
        this.loadTramitesConfig();
    }

    public validateTramiteType(tramite: string): 'valid' | 'inactive' | 'not_found' {
        if (!this.tramites.has(tramite)) {
            return 'not_found';
        }
        return this.tramites.get(tramite)!.active ? 'valid' : 'inactive';
    }

    private loadTramitesConfig(): void {
        try {
            const configPath:string = ConfigManager.get("TRAMITES_PATH");
            const configFile = fs.readFileSync(configPath, 'utf8');
            const config = JSON.parse(configFile);
            
            config.tramites.forEach((tramite: TramiteConfig) => {
                this.tramites.set(tramite.nombre, tramite);
            });
        } catch (error) {
            console.error('Error loading tramites config:', error);
            // Cargar configuración por defecto si hay error
            this.loadDefaultConfig();
        }
    }

    public addTramite(nombre: string, duration: number): void {
        this.tramites.set(nombre, {
            nombre: nombre,
            duration,
            active: true
        });
    }

    public removeTramite(name: string): void {
        this.tramites.get(name)!.active = false;
    }

    public updateTramiteDuration(name: string, duration: number): void {
        const tramite = this.tramites.get(name);
        if (tramite) {
            tramite.duration = duration;
        }
    }

    public getTramiteDuration(name: string): number {
        return this.tramites.get(name)?.duration || 0;
    }

    public getActiveTramites(): TramiteConfig[] {
        return Array.from(this.tramites.entries())
            .filter(([_, config]) => config.active)
            .map(([_, tramite]) => tramite);
    }
    public getTramites(): TramiteConfig[] {
        return Array.from(this.tramites.entries()).map(([_, tramite]) => tramite);
    }
    public getTramite(name: string): TramiteConfig | undefined {
        return this.tramites.get(name);
    }

    private saveTramitesConfig(): void {
        fs.writeFileSync(
            ConfigManager.get("TRAMITES_PATH"), 
            JSON.stringify(Array.from(this.tramites.entries()))
        );
    }

    private loadDefaultConfig(): void {
        this.addTramite("Inscripcion", 10);
        this.addTramite("Beca", 5);
        this.addTramite("Certificado", 5);
        this.addTramite("Constancia", 60);
    }
}