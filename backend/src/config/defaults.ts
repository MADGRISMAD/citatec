import path from "path";

export const defaults: Record<string, any> = {
    PORT: 3000,
    METRICS_ENDPOINT: 'http://localhost:4318/v1/metrics',
    METRICS_INTERVAL: 1000,
    LOGS_ENDPOINT: 'http://localhost:4318/v1/logs',
    TRACES_ENDPOINT: 'http://localhost:4318/v1/traces',
    NODE_ENV: 'development',
    DATA_PATH: path.resolve(__dirname, '../data'),
    START_HOUR: 8,
    END_HOUR: 16,
    DAYS: "1-5"
}