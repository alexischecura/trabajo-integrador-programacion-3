import { body, param, query } from 'express-validator';

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

export const listarServiciosValidations = [
  // opcionales: page, limit, sortBy, order, capacidad, importeMax
  query('page').optional().isInt({ min: 1 }).withMessage('page debe ser entero >= 1'),
  query('limit').optional().isInt({ min: 1 }).withMessage('limit debe ser entero >= 1'),
  query('sortBy').optional().isString(),
  query('order').optional().trim().toUpperCase().isIn(['ASC', 'DESC']).withMessage('order debe ser ASC o DESC'),,
  query('importeMax').optional().isFloat({ min: 0 }).withMessage('importeMax debe ser número >= 0'),
];