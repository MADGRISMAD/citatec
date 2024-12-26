export const defaults: Record<string, any> = {
    PORT: 3000,
    LOG_LEVEL: 'info',
    METRICS_ENDPOINT: 'localhost:4316/v1/metrics',
    LOGS_ENDPOINT: 'localhost:4316/v1/logs',
    TRACES_ENDPOINT: 'localhost:4316/v1/traces',
    NODE_ENV: process.env.NODE_ENV || 'development',
}