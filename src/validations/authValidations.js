import { body } from 'express-validator';

export const loginValidation = [
  body('nombre_usuario')
    .isEmail()
    .withMessage('El nombre de usuario debe tener formato de correo electrónico'),
  body('contrasenia')
    .notEmpty()
    .withMessage('Debe ingresar una contraseña'),
];

export const registerValidation = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es obligatorio'),
  body('apellido')
    .notEmpty()
    .withMessage('El apellido es obligatorio'),
  body('nombre_usuario')
    .isEmail()
    .withMessage('El nombre de usuario debe tener formato de correo electrónico'),
  body('contrasenia')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('celular')
    .optional()
    .isMobilePhone('es-AR')
    .withMessage('Número de celular no válido'),
  body('foto')
    .optional()
    .isString()
    .withMessage('La foto debe ser una cadena de texto'),
];