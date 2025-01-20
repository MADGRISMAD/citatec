# Como correr el programa
## Instalación
En la carpeta shared:
```bash
npm i
npm run build
```

En la carpeta backend:
```bash
npm i
npm run build
docker build -t backend:latest .
```

En la carpeta frontend: 
```bash
npm i
npm run build
docker build -t frontend:latest .
```

En la raíz:
```bash
docker-compose create
docker-compose start
```

ó

```bash
docker compose create
docker compose start
```

**Nota**: Esto depende de la versión de Docker Compose


El frontend es accesible por el puerto 80 en protocolo HTTP, el backend solo es accesible desde el frontend.
Hay variables de entorno que se pueden personalizar, estas son:
### Backend
- PORT: 3000
- METRICS_ENDPOINT: 'http://localhost:4318/v1/metrics'
- METRICS_INTERVAL: 1000
- TRACES_ENDPOINT: 'http://localhost:4318/v1/traces'
- NODE_ENV: 'development'
- DATA_PATH: path.resolve(__dirname, '../data')
- START_HOUR: 8
- END_HOUR: 16
- DAYS: "1-5"


### Frontend
- BACKEND_HOST: 'http://localhost:3000'

**Nota**: El valor a la derecha es el por defecto para cada uno, PORT, DATA_PATH y BACKEND_HOST no se recomienda que sean modificados cuando se trabaja con el archivo Docker Compose proveido.

**AVISO**: La zona horaria está configurada para la Ciudad de México, esta se puede modificar en el archivo docker-compose.yaml, puede verlos en https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

### Configurar su horario
START_HOUR y END_HOUR son usados para definir la hora de entrada y de salida en formato de 24 horas.
DAYS define los días en los que se laborará, la lista es:
- Domingo: 0
- Lunes: 1
- Martes: 2
- Miércoles: 3
- Jueves: 4
- Viernes: 5
- Sábado: 6

Por ejemplo: si usas 1-5, va a tomar de Lunes a Viernes. También se puede usar un solo día si es necesario. Utilizando 1-1 se eligirá el día Lunes como horario laboral solamente.

**AVISO**: Esto no hace función de descanso, tickets creados antes de un cambio de horario que los pusiera "fuera de horario", no serán movidos.

## Datos
Los archivos usados por el programa pueden ser editados en la carpeta *data* que se crea en el mismo nivel en donde docker-compose. Este creará archivos conforme requiera lectura de estos, pero estos son:
* adminDevices.json
* data.json
* historial.json
* materias.pdf (este no será creado, usted requiere subir uno)
* tramites.json

## Autenticación como coordinador
La autenticación solo es posible administrarla directamente al archivo de *adminDevices*. Para hacerlo, tiene que añadir la siguiente estructura:
```json
[
    ...
    {
        "sid": "identificadorPrueba",
        "fingerprint" : "7660b98e396e2818239b740d50f42cfc"
    },
    {
        "sid": "EjemploPCTecnologico",
        "fingerprint" : "7660b98e396e2818239b740d51231452"
    },
    ...
]
```

El *fingerprint* es obtenido de cualquier página que requiera permisos de coordinador en la parte superior. Este tiene que ser añadido manualmente.

**Nota**: Este fingerprint puede cambiar en el mismo dispositivo, algunos factores como actualizaciones pueden cambiar este fingerprint. Puede ver más aquí: https://dev.fingerprint.com/docs/identification-accuracy-and-confidence