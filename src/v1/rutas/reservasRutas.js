import { Router } from 'express';
import AppError from '../../utiles/AppError.js';
import { body, validationResult } from 'express-validator';
import Reservas from '../../db/reservas.js';

const router = Router();
const reservasDb = new Reservas();

router.get('/exportar/csv', async (req, res, next) => {
  try {
    const csv = await reservasDb.exportarCSV();
    res.header('Content-Type', 'text/csv');
    res.attachment('reporte-reservas.csv');
    res.send(csv);
  } catch (error) {

    next(error);
  }
});

const validacionesReserva = [
  body('usuario_id')
    .isInt({ min: 1 })
    .withMessage('El ID de usuario debe ser un número entero positivo.'),
  body('salon_id')
    .isInt({ min: 1 })
    .withMessage('El ID de salón debe ser un número entero positivo.'),
  body('fecha_reserva')
    .isDate()
    .withMessage('La fecha_reserva no es válida (Formato AAAA-MM-DD).'),
  body('hora_inicio')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('La hora_inicio debe tener formato HH:MM (ej: 17:00).'),
  body('hora_fin')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('La hora_fin debe tener formato HH:MM (ej: 21:00).'),
];


router.post('/', validacionesReserva, async (req, res, next) => {
  try {

    const errores = validationResult(req);
    if (!errores.isEmpty()) {

      const errorMsg = errores
        .array()
        .map((e) => e.msg)
        .join('. ');
      throw new AppError(errorMsg, 400); 
    }


    const resultado = await reservasDb.crearReserva(req.body);


    res.status(201).json({
      estado: 'exito',
      mensaje: 'Reserva creada exitosamente.',
      id_reserva: resultado.insertId,
    });
  } catch (error) {

    next(error);
  }
});

export { router };