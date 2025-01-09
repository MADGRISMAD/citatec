import fs from 'fs';
import ConfigManager from './ConfigManager';
import { TramiteConfig } from 'shared-types';

export class TramiteManager {
    constructor() {
        // Inicializar con los trámites por defecto
        this.loadTramitesConfig();
    }

    public validateTramiteType(tramite: string): 'valid' | 'inactive' | 'not_found' {
        const tramites = this.loadTramitesConfig();
        const foundTramite = tramites.find(t => t.nombre === tramite);
        if (!foundTramite) {
            return 'not_found';
        }
        return foundTramite.active ? 'valid' : 'inactive';
    }

    private loadTramitesConfig(): TramiteConfig[] {
        try {
            const configPath: string = ConfigManager.get("TRAMITES_PATH");
            const configFile = fs.readFileSync(configPath, 'utf8');
            const config = JSON.parse(configFile);
            return config.tramites;
        } catch (error) {
            console.error('Error loading tramites config:', error);
            // Cargar configuración por defecto si hay error
            return this.loadDefaultConfig();
        }
    }

    public addTramite(nombre: string, duration: number): void {
        const tramites = this.loadTramitesConfig();
        tramites.push({
            nombre: nombre,
            duration,
            active: true
        } as TramiteConfig);
        this.saveTramitesConfig(tramites);
    }

    public removeTramite(name: string): void {
        const tramites = this.loadTramitesConfig();
        const tramite = tramites.find(t => t.nombre === name);
        if (tramite) {
            tramite.active = false;
            this.saveTramitesConfig(tramites);
        }
    }

    public updateTramiteDuration(name: string, duration: number): void {
        const tramites = this.loadTramitesConfig();
        const tramite = tramites.find(t => t.nombre === name);
        if (tramite) {
            tramite.duration = duration;
            this.saveTramitesConfig(tramites);
        }
    }

    public getTramiteDuration(name: string): number {
        const tramites = this.loadTramitesConfig();
        const tramite = tramites.find(t => t.nombre === name);
        return tramite ? tramite.duration : 0;
    }

    public getActiveTramites(): TramiteConfig[] {
        const tramites = this.loadTramitesConfig();
        return tramites.filter(t => t.active);
    }

    public getTramites(): TramiteConfig[] {
        return this.loadTramitesConfig();
    }

    public getTramite(name: string): TramiteConfig | undefined {
        const tramites = this.loadTramitesConfig();
        return tramites.find(t => t.nombre === name);
    }

    private saveTramitesConfig(tramites: TramiteConfig[]): void {
        fs.writeFileSync(
            ConfigManager.get("TRAMITES_PATH"),
            JSON.stringify({ tramites })
        );
    }

    private loadDefaultConfig(): TramiteConfig[] {
        return [
            { nombre: "Inscripcion", duration: 10, active: true },
            { nombre: "Beca", duration: 5, active: true },
            { nombre: "Certificado", duration: 5, active: true },
            { nombre: "Constancia", duration: 60, active: true }
        ];
    }

    public activateTramite(name: string): void {
        const tramites = this.loadTramitesConfig();
        const tramite = tramites.find(t => t.nombre === name);
        if (tramite) {
            tramite.active = true;
            this.saveTramitesConfig(tramites);
        }
    }
}