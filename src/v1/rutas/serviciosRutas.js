import express from 'express';
import { body } from 'express-validator';
import ServiciosControlador from '../../controladores/serviciosControlador.js';
import { crearServicioValidations, actualizarServicioValidations } from '../../validations/serviciosValidations.js';
import { validarInputs } from '../../middlewares/validarInputs.js';

const serviciosControlador = new ServiciosControlador();

const router = express.Router();

router.get('/', serviciosControlador.buscarServicios);
router.get('/:servicio_id', serviciosControlador.buscarServicioPorId);

router.post('/', crearServicioValidations, validarInputs, serviciosControlador.crearServicio);
router.put('/:servicio_id', actualizarServicioValidations, validarInputs, serviciosControlador.actualizarServicio);
router.delete('/:servicio_id', serviciosControlador.borrarServicio);

export { router };