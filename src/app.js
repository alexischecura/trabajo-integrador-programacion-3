process.loadEnvFile();

import authRutas from './v1/rutas/authRutas.js';
import express from 'express';
import { router as salonesRutasV1 } from './v1/rutas/salonesRutas.js';
import { router as serviciosRutasV1 } from './v1/rutas/serviciosRutas.js';
import { swaggerSpec } from './v1/swagger.js';
import swaggerUi from 'swagger-ui-express';
import { router as usuariosRutasV1 } from './v1/rutas/usuariosRutas.js';

const app = express();

app.use(express.json());

// Rutas de la API
app.use('/api/v1/salones', salonesRutasV1);
app.use('/api/v1/usuarios', usuariosRutasV1);
app.use('/api/v1/servicios', serviciosRutasV1);
app.use('/api/v1/auth', authRutas);

// Documentación de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
