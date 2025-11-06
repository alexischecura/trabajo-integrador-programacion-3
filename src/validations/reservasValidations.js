import { body, query, param } from 'express-validator';

export const crearReservaValidations = [
  body('fecha_reserva')
    .isISO8601()
    .withMessage(
      'La fecha de reserva debe ser una fecha válida en formato YYYY-MM-DD'
    ),
  body('salon_id')
    .isInt({ min: 1 })
    .withMessage('El ID del salón debe ser un entero positivo'),
  body('usuario_id')
    .isInt({ min: 1 })
    .withMessage('El ID del usuario debe ser un entero positivo'),
  body('turno_id')
    .isInt({ min: 1 })
    .withMessage('El ID del turno debe ser un entero positivo'),
  body('servicios')
    .isArray()
    .withMessage('Los servicios deben ser un array')
    .notEmpty()
    .withMessage('Debe haber al menos un servicio seleccionado'),
  body('foto_cumpleaniero')
    .optional({ nullable: true })
    .isURL()
    .withMessage('La foto del cumpleañero debe ser una URL válida'),
  body('tematica')
    .optional({ nullable: true })
    .trim()
    .isLength({ min: 3 })
    .withMessage('La temática debe tener al menos 3 caracteres'),
  body('importe_salon')
    .isFloat({ min: 0 })
    .withMessage('El importe del salón debe ser un número mayor o igual que 0')
];

export const actualizarReservaValidations = [
  // Similar a crearReservaValidations pero todos los campos son opcionales
  body('fecha_reserva')
    .optional()
    .isISO8601()
    .withMessage(
      'La fecha de reserva debe ser una fecha válida en formato YYYY-MM-DD'
    ),
  body('salon_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El ID del salón debe ser un entero positivo'),
  body('usuario_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El ID del usuario debe ser un entero positivo'),
  body('turno_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El ID del turno debe ser un entero positivo'),
  body('foto_cumpleaniero')
    .optional({ nullable: true })
    .isURL()
    .withMessage('La foto del cumpleañero debe ser una URL válida'),
  body('tematica')
    .optional({ nullable: true })
    .trim()
    .isLength({ min: 3 })
    .withMessage('La temática debe tener al menos 3 caracteres'),
  body('importe_salon')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El importe del salón debe ser un número mayor o igual que 0'),
];


export const idParamReserva = [
  param('reserva_id')
    .isInt({ gt: 0 })
    .withMessage('ID inválido'),
];


export const listarReservasValidations = [
  // opcionales: page, limit, sortBy, order, importeTotalMax
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('page debe ser entero >= 1'),
  query('limit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('limit debe ser entero >= 1'),
  query('sortBy')
    .optional()
    .trim()
    .toLowerCase()
    .isIn(['reserva_id', 'tematica', 'importe_salon', 'importe_total'])
    .withMessage('sortBy inválido'),
  query('order')
    .optional()
    .trim()
    .toUpperCase()
    .isIn(['ASC', 'DESC'])
    .withMessage('order debe ser ASC o DESC'),
  query('importeTotalMax')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('importeTotalMax debe ser número >= 0'),
];
