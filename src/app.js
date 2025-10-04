import express from 'express';
import { router as salonesRutasV1 } from './v1/rutas/salonesRutas.js';

process.loadEnvFile();

const app = express();

app.use(express.json());

app.use('/api/v1/salones', salonesRutasV1);

export default app;
