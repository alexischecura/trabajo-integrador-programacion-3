import { Router } from 'express';

import { allowRoles } from '../../middlewares/roleMiddleware.js';
import ReportesControlador from '../../controladores/reportesControlador.js';
import { validarIngresoPorPeriodo } from '../../validations/reportesValidations.js';
import { validarInputs } from '../../middlewares/validarInputs.js';

const router = Router();

const reportesControlador = new ReportesControlador();

router.get(
  '/salones-populares',
  allowRoles('administrador'),
  reportesControlador.salonesPopulares
);

router.get(
  '/ingreso-por-periodo',
  allowRoles('administrador'),
  validarIngresoPorPeriodo,
  validarInputs,
  reportesControlador.ingresoPorPeriodo
);

export { router };
