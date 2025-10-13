process.loadEnvFile();

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './v1/swagger.js';
import { router as salonesRutasV1 } from './v1/rutas/salonesRutas.js';
import { router as usuariosRutasV1 } from './v1/rutas/usuariosRutas.js';
import { router as serviciosRutasV1 } from './v1/rutas/serviciosRutas.js';

const app = express();

app.use(express.json());

// Rutas de la API
app.use('/api/v1/salones', salonesRutasV1);
app.use('/api/v1/usuarios', usuariosRutasV1);
app.use('/api/v1/servicios', serviciosRutasV1);

// Documentación de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
