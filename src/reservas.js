process.loadEnvFile();

import express from 'express';
import { swaggerSpec } from './v1/swagger.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';

import authRutas from './v1/rutas/authRutas.js';
import { router as salonesRutasV1 } from './v1/rutas/salonesRutas.js';
import { router as serviciosRutasV1 } from './v1/rutas/serviciosRutas.js';
import { router as reservasRutasV1 } from './v1/rutas/reservasRutas.js';
import { router as turnosRutasV1 } from './v1/rutas/turnosRutas.js';
import { router as reportesRutasV1 } from './v1/rutas/reportesRutas.js';
import { router as usuariosRutasV1 } from './v1/rutas/usuariosRutas.js';

import { authMiddleware } from './middlewares/authMiddleware.js';
import { errorHandler } from './middlewares/errorHandler.js';
import AppError from './utiles/AppError.js';

const app = express();

let logStream = fs.createWriteStream(path.join('./access.log'), { flags: 'a' });

app.use(express.json());
app.use(morgan('dev'));
app.use(morgan('combined', { stream: logStream }));
app.use(cors());

// Rutas públicas
app.use('/api/v1/auth', authRutas);

// Rutas de privadas
app.use(authMiddleware);
app.use('/api/v1/salones', salonesRutasV1);
app.use('/api/v1/usuarios', usuariosRutasV1);
app.use('/api/v1/servicios', serviciosRutasV1);
app.use('/api/v1/reservas', reservasRutasV1);
app.use('/api/v1/turnos', turnosRutasV1);
app.use('/api/v1/reportes', reportesRutasV1);

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
