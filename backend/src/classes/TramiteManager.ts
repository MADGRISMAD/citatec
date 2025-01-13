import fs from 'fs';
import ConfigManager from './ConfigManager';
import { TramiteConfig } from 'shared-types';
import { TRAMITES_PATH } from '../constants/paths';

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
            const configPath: string = TRAMITES_PATH;
            
            if(!fs.existsSync(configPath)){
                fs.mkdirSync(ConfigManager.get("DATA_PATH"), { recursive: true });
                fs.writeFileSync(
                    configPath,
                    JSON.stringify({ tramites: [] })
                );
            }
            const configFile = fs.readFileSync(configPath, 'utf8');
            const config = JSON.parse(configFile);
            return config.tramites;
        } catch (error) {
            console.error('Error loading tramites config:', error);
            throw error;
            // Cargar configuración por defecto si hay error
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
            TRAMITES_PATH,
            JSON.stringify({ tramites })
        );
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