import { Router } from 'express';

import { allowRoles } from '../../middlewares/roleMiddleware.js';
import Reportes from '../../db/reportes.js';

const router = Router();

const reportesDb = new Reportes();

// [[TODO]] Mover reportesDb a la capa servicio
router.get(
  '/salones-populares',
  allowRoles('administrador'),
  async (req, res, next) => {
    try {
      const reporte = await reportesDb.salonesPopulares();

      res.json(reporte);
    } catch (error) {
      next(error);
    }
  }
);

export { router };
