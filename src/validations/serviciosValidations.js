import { body, param } from 'express-validator';

export const crearServicioValidations = [
  body('descripcion')
    .trim()
    .notEmpty().withMessage('La descripción es obligatoria')
    .isLength({ min: 3 }).withMessage('La descripción debe tener al menos 3 caracteres'),
  body('importe')
    .isFloat({ min: 0 }).withMessage('El importe debe ser un número mayor o igual que 0'),
];

export const actualizarServicioValidations = [
  param('servicio_id').isInt({ gt: 0 }).withMessage('ID inválido'),
  body('descripcion').optional().trim().isLength({ min: 3 }).withMessage('La descripción debe tener al menos 3 caracteres'),
  body('importe').optional().isFloat({ min: 0 }).withMessage('El importe debe ser un número mayor o igual que 0'),
];