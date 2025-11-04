import { actualizarServicioValidations, crearServicioValidations } from '../../validations/serviciosValidations.js';

import ServiciosControlador from '../../controladores/serviciosControlador.js';
import { allowRoles } from '../../middlewares/roleMiddleware.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';
import express from 'express';
import { validarInputs } from '../../middlewares/validarInputs.js';

const serviciosControlador = new ServiciosControlador();
const router = express.Router();

router.get('/', serviciosControlador.buscarServicios);
router.get('/:servicio_id', serviciosControlador.buscarServicioPorId);

router.post('/', authMiddleware, allowRoles('administrador', 'empleado'), crearServicioValidations, validarInputs, serviciosControlador.crearServicio);
router.put('/:servicio_id', authMiddleware, allowRoles('administrador', 'empleado'), actualizarServicioValidations, validarInputs, serviciosControlador.actualizarServicio);
router.delete('/:servicio_id', authMiddleware, allowRoles('administrador'), serviciosControlador.borrarServicio);

export { router };