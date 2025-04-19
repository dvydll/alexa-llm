# Alexa LLM

Este proyecto contiene una implementación de un servidor MCP (Model Context Protocol) que incluye herramientas para interactuar con APIs y realizar cálculos específicos. A continuación, se detalla la estructura del directorio y una breve descripción de los componentes principales.

## Estructura del directorio

```
/home/dvyd/dev/personal/alexa-llm
├── biome.jsonc
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── build/
│   ├── index.js
│   ├── env/
│   │   └── index.js
│   ├── helpers/
│   │   └── index.js
│   └── tools/
│       ├── calculate-bmi.js
│       ├── fetch-weather.js
│       ├── get-alerts.js
│       └── get-forecast.js
├── src/
│   ├── index.ts
│   ├── env/
│   │   └── index.ts
│   ├── helpers/
│   │   └── index.ts
│   ├── models/
│   │   └── index.d.ts
│   └── tools/
│       ├── calculate-bmi.ts
│       ├── fetch-weather.ts
│       ├── get-alerts.ts
│       └── get-forecast.ts
└── .vscode/
    └── mcp.json
```

## Descripción de los componentes

### Archivos principales
- **biome.jsonc**: Configuración para el formateador y linter del proyecto.
- **package.json**: Archivo de configuración de npm que define las dependencias y scripts del proyecto.
- **pnpm-lock.yaml**: Archivo de bloqueo para gestionar las versiones exactas de las dependencias.
- **tsconfig.json**: Configuración del compilador TypeScript.

### Directorio `build/`
Contiene los archivos JavaScript generados después de compilar el proyecto TypeScript. Este directorio incluye:
- **index.js**: Punto de entrada principal del servidor MCP.
- **env/**: Variables de entorno y configuración.
- **helpers/**: Funciones auxiliares para realizar solicitudes y formatear datos.
- **tools/**: Herramientas específicas como cálculo de BMI y obtención de datos meteorológicos.

### Directorio `src/`
Contiene el código fuente del proyecto en TypeScript. Este directorio incluye:
- **index.ts**: Punto de entrada principal del servidor MCP.
- **env/**: Variables de entorno y configuración.
- **helpers/**: Funciones auxiliares para realizar solicitudes y formatear datos.
- **models/**: Definiciones de tipos y modelos utilizados en el proyecto.
- **tools/**: Herramientas específicas como cálculo de BMI y obtención de datos meteorológicos.

### Directorio `.vscode/`
Contiene configuraciones específicas para Visual Studio Code, incluyendo:
- **mcp.json**: Configuración de servidores MCP para interactuar con diferentes servicios.

## Cómo ejecutar el proyecto

1. Instala las dependencias:
   ```bash
   pnpm install
   ```

2. Compila el proyecto:
   ```bash
   pnpm build
   ```

3. Inicia el servidor MCP en modo desarrollo:
   ```bash
   pnpm dev
   ```

## Herramientas incluidas

- **get-forecast**: Obtiene el pronóstico del tiempo para una ubicación específica.
- **get-alerts**: Recupera alertas meteorológicas para un estado.
- **calculate-bmi**: Calcula el Índice de Masa Corporal (BMI) basado en altura y peso.

Si necesitas más información, consulta los archivos fuente en el directorio `src/`.