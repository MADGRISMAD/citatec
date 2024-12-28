export const defaults: Record<string, any> = {
    PORT: 3000,
    CONFIG_FILE_PATH: './config/config.json',
    LOG_LEVEL: 'info',
    METRICS_ENDPOINT: 'http://localhost:4318/v1/metrics',
    METRICS_INTERVAL: 1000,
    LOGS_ENDPOINT: 'http://localhost:4318/v1/logs',
    TRACES_ENDPOINT: 'http://localhost:4318/v1/traces',
    NODE_ENV: 'development',
}