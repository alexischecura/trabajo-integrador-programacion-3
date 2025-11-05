import { Router } from 'express';

import Reportes from '../../db/reportes.js';

const router = Router();

const reportesDb = new Reportes();

router.get('/salones-populares', async (req, res, next) => {
  try {

    const reporte = await reportesDb.salonesPopulares();


    res.json(reporte);
  } catch (error) {
    next(error);
  }
});

export { router };