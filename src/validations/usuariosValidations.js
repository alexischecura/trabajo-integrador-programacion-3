import { body, param } from 'express-validator';

export const crearUsuarioValidations = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('apellido').trim().notEmpty().withMessage('El apellido es obligatorio'),
  body('nombre_usuario')
    .trim()
    .notEmpty().withMessage('El nombre de usuario es obligatorio')
    .isLength({ min: 3 }).withMessage('El nombre de usuario debe tener al menos 3 caracteres'),
  body('contrasenia')
    .trim()
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('tipo_usuario')
    .isIn(['cliente', 'empleado', 'administrador'])
    .withMessage('Tipo de usuario inválido'),
  body('celular').optional().isMobilePhone('es-AR').withMessage('Número de celular no válido'),
  body('foto').optional().isString().withMessage('La foto debe ser una cadena de texto'),
];

export const actualizarUsuarioValidations = [
  param('usuario_id').isInt({ gt: 0 }).withMessage('ID inválido'),
  body('nombre').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío'),
  body('apellido').optional().trim().notEmpty().withMessage('El apellido no puede estar vacío'),
  body('nombre_usuario').optional().trim().isLength({ min: 3 }).withMessage('El nombre de usuario debe tener al menos 3 caracteres'),
  body('tipo_usuario').optional().isIn(['cliente', 'empleado', 'administrador']).withMessage('Tipo de usuario inválido'),
  body('celular').optional().isMobilePhone('es-AR').withMessage('Número de celular no válido'),
  body('foto').optional().isString().withMessage('La foto debe ser una cadena de texto'),
];