import { body } from 'express-validator';

export const loginValidation = [
  body('nombre_usuario')
    .isEmail()
    .withMessage('El nombre de usuario debe tener formato de correo electrónico'),
  body('contrasenia')
    .notEmpty()
    .withMessage('Debe ingresar una contraseña'),
];