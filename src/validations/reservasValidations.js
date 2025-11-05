import { body } from 'express-validator';

export const crearReservaValidations = [
  body('fecha_reserva')
    .isISO8601().withMessage('La fecha de reserva debe ser una fecha válida en formato YYYY-MM-DD'),
  body('salon_id')
    .isInt({ min: 1 }).withMessage('El ID del salón debe ser un entero positivo'),
  body('usuario_id')
    .isInt({ min: 1 }).withMessage('El ID del usuario debe ser un entero positivo'),
  body('turno_id')
    .isInt({ min: 1 }).withMessage('El ID del turno debe ser un entero positivo'),
  body('foto_cumpleaniero')
    .optional({ nullable: true })
    .isURL().withMessage('La foto del cumpleañero debe ser una URL válida'),
  body('tematica')
    .optional({ nullable: true })
    .trim()
    .isLength({ min: 3 }).withMessage('La temática debe tener al menos 3 caracteres'),
  body('importe_salon')
    .isFloat({ min: 0 }).withMessage('El importe del salón debe ser un número mayor o igual que 0'),
  body('importe_total')
    .isFloat({ min: 0 }).withMessage('El importe total debe ser un número mayor o igual que 0'),
];
