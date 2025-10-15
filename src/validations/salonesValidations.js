import { body, query, param } from 'express-validator';

export const crearSalonValidations = [
  body('titulo')
    .trim()
    .notEmpty().withMessage('El título es obligatorio')
    .isLength({ min: 3 }).withMessage('El título debe tener al menos 3 caracteres'),
  body('direccion')
    .trim()
    .notEmpty().withMessage('La dirección es obligatoria'),
  body('capacidad')
    .isInt({ min: 1 }).withMessage('La capacidad debe ser un entero mayor que 0'),
  body('importe')
    .isFloat({ min: 0 }).withMessage('El importe debe ser un número mayor o igual que 0'),
];

export const actualizarSalonValidations = [
  param('salon_id').isInt({ gt: 0 }).withMessage('ID inválido'),
  body('titulo').optional().trim().isLength({ min: 3 }).withMessage('El título debe tener al menos 3 caracteres'),
  body('direccion').optional().trim().notEmpty().withMessage('La dirección no puede estar vacía'),
  body('capacidad').optional().isInt({ min: 1 }).withMessage('La capacidad debe ser un entero mayor que 0'),
  body('importe').optional().isFloat({ min: 0 }).withMessage('El importe debe ser un número mayor o igual que 0'),
];

export const idParamSalon = [
  param('salon_id').isInt({ gt: 0 }).withMessage('ID inválido'),
];

export const listarSalonesValidations = [
  // opcionales: page, limit, sortBy, order, capacidad, importeMax
  query('page').optional().isInt({ min: 1 }).withMessage('page debe ser entero >= 1'),
  query('limit').optional().isInt({ min: 1 }).withMessage('limit debe ser entero >= 1'),
  query('sortBy').optional().isString(),
  query('order').optional().isIn(['ASC', 'DESC']).withMessage('order debe ser ASC o DESC'),
  query('capacidad').optional().isInt({ min: 1 }).withMessage('capacidad debe ser entero >=1'),
  query('importeMax').optional().isFloat({ min: 0 }).withMessage('importeMax debe ser número >= 0'),
];