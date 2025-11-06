import {body, param} from 'express-validator';

export const crearTurnoValidations = [
  body('hora_desde')
    .notEmpty().withMessage('La hora de inicio es obligatoria'),
  body('hora_hasta')
    .notEmpty().withMessage('La hora de fin es obligatoria')
    .custom((value, { req }) => {
      if (value <= req.body.hora_desde) {
        throw new Error('La hora de fin debe ser mayor a la hora de inicio');
      }
      return true;
    }),
];

export const actualizarTurnoValidations = [
  param('turno_id').isInt({ gt: 0 }).withMessage('ID inválido'),
  body('hora_desde').optional().notEmpty().withMessage('La hora de inicio no puede estar vacía'),
  body('hora_hasta').optional()
    .notEmpty().withMessage('La hora de fin no puede estar vacía')
    .custom((value, { req }) => {
      if (req.body.hora_desde && value <= req.body.hora_desde) {
        throw new Error('La hora de fin debe ser mayor a la hora de inicio');
      }
      return true;
    }),
];

export const idParamTurno = [
  param('turno_id').isInt({ gt: 0 }).withMessage('ID inválido'),
];

