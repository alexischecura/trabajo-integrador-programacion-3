process.loadEnvFile();

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './v1/swagger.js';
import { router as salonesRutasV1 } from './v1/rutas/salonesRutas.js';
import { router as usuariosRutasV1 } from './v1/rutas/usuariosRutas.js';
import { router as serviciosRutasV1 } from './v1/rutas/serviciosRutas.js';
import { router as reservasRutasV1 } from './v1/rutas/reservasRutas.js';
import { errorHandler } from './middlewares/errorHandler.js';
import AppError from './utiles/AppError.js';

const app = express();

app.use(express.json());

// Rutas de la API
app.use('/api/v1/salones', salonesRutasV1);
app.use('/api/v1/usuarios', usuariosRutasV1);
app.use('/api/v1/servicios', serviciosRutasV1);
app.use('/api/v1/reservas', reservasRutasV1);

// Documentación de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res, next) => {
  next(
    new AppError(
      `No se encuentra la ruta ${req.originalUrl} en este servidor`,
      404
    )
  );
});

app.use(errorHandler);

export default app;
