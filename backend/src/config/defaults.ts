import path from "path";

export const defaults: Record<string, any> = {
    PORT: 3000,
    METRICS_ENDPOINT: 'http://localhost:4318/v1/metrics',
    METRICS_INTERVAL: 1000,
    LOGS_ENDPOINT: 'http://localhost:4318/v1/logs',
    TRACES_ENDPOINT: 'http://localhost:4318/v1/traces',
    NODE_ENV: 'development',
    STATISTICS_PATH: path.resolve(__dirname, '../data/statistics.json'),
    TICKET_ARCHIVE_PATH: path.resolve(__dirname, '../data/archive.json'),
    MATERIAS_PATH: path.resolve(__dirname, '../data/materias.pdf'),
    TRAMITES_PATH: path.resolve(__dirname, '../data/tramites.json'),
}