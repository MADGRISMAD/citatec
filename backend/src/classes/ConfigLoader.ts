import fs from 'fs';
import { ConfigOptions } from '../interfaces/ConfigOptions';

export class ConfigManager {
    private static instance: ConfigManager;
    private configPath?: string;
    private defaults: Record<string, any>;
    private fileConfig: Record<string, any> | null = null;
    private cache: Record<string, any> = {};

    private constructor(options: Partial<ConfigOptions> = {}) {
        this.configPath = options.configPath;
        this.defaults = options.defaults || {};

        if (this.configPath && !fs.existsSync(this.configPath)) {
            throw new Error(`Config file not found: ${this.configPath}`);
        }
    }

    public static getInstance(options: Partial<ConfigOptions> = {}): ConfigManager {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager(options);
        }
        return ConfigManager.instance;
    }

    private loadFileConfig(): Record<string, any> {
        if (!this.fileConfig && this.configPath) {
            try {
                const content = fs.readFileSync(this.configPath, 'utf8');
                this.fileConfig = JSON.parse(content);
            } catch (error) {
                console.error(`Error loading config file: ${error instanceof Error ? error.message : 'Unknown error'}`);
                throw error;
            }
        }
        return this.fileConfig || {};
    }

    public get<T>(key: string, defaultValue?: T): T {
        // Revisar el caché primero
        if (this.cache[key] !== undefined) {
            return this.cache[key] as T;
        }

        let value: T | undefined;

        // 1. Primero buscar en variables de entorno
        const envValue = process.env[key];
        if (envValue !== undefined) {
            value = envValue as unknown as T;
        }

        // 2. Si no se encuentra en env, buscar en archivo de configuración
        if (value === undefined && this.configPath) {
            const config = this.loadFileConfig();
            value = config[key] as T;
        }

        // 3. Si aún no hay valor, usar el default proporcionado o el default global
        if (value === undefined) {
            value = (defaultValue !== undefined ? defaultValue : this.defaults[key]) as T;
        }

        // Guardar en caché
        this.cache[key] = value;
        return value;
    }

    public getSecret<T>(key: string, defaultValue?: T): T {
        // Para secrets, SOLO usar variables de entorno en producción
        const envValue = process.env[key] as unknown as T;
        if (envValue !== undefined) {
            return envValue;
        }

        // En desarrollo, permitir buscar en archivo de configuración
        if (process.env.NODE_ENV === 'development') {
            const fileValue = this.get(key, defaultValue);
            if (fileValue !== undefined) {
                return fileValue;
            }
        }

        if (defaultValue === undefined) {
            throw new Error(`Secret ${key} not found and no default value provided`);
        }

        return defaultValue;
    }

    // Método para limpiar el caché si es necesario
    public clearCache(): void {
        this.cache = {};
    }
}

export default ConfigManager.getInstance();