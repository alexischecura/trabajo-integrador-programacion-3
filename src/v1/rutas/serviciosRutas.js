import express from 'express';
import { body } from 'express-validator';
import ServiciosControlador from '../../controladores/serviciosControlador.js';

const serviciosControlador = new ServiciosControlador();

const router = express.Router();

router.get('/', serviciosControlador.buscarServicios);

router.get('/:servicio_id', serviciosControlador.buscarServicioPorId);

router.post(
  '/',
  [
    body('descripcion').notEmpty().withMessage('La descripción es obligatoria'),
    body('importe').isFloat({ min: 0 }).withMessage('El importe debe ser un número mayor o igual que 0'),
  ],
  serviciosControlador.crearServicio
);

router.put(
  '/:servicio_id',
  [
    body('descripcion').notEmpty().withMessage('La descripción es obligatoria'),
    body('importe').isFloat({ min: 0 }).withMessage('El importe debe ser un número mayor o igual que 0'),
  ],
  serviciosControlador.actualizarServicio
);

router.delete('/:servicio_id', serviciosControlador.borrarServicio);

export { router };
