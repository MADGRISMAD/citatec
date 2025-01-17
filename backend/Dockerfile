FROM node

WORKDIR /app


EXPOSE 3000

ENV PORT=3000
ENV METRICS_ENDPOINT: 'http://localhost:4318/v1/metrics'
ENV METRICS_INTERVAL: 1000
ENV LOGS_ENDPOINT: 'http://localhost:4318/v1/logs'
ENV TRACES_ENDPOINT: 'http://localhost:4318/v1/traces'
ENV NODE_ENV: 'production'
ENV DATA_PATH: '/data'

COPY package*.json ./
COPY dist/ ./
RUN npm ci --only=production
RUN npm i -g pm2
CMD ["pm2-runtime", "main.bundle.js"]