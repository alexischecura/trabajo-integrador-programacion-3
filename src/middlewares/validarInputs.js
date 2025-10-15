import { validationResult } from 'express-validator';
import AppError from '../utiles/AppError.js';

export const validarInputs = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const detalles = errors.array().map((err) => ({
      campo: err.path,
      mensaje: err.msg,
      valor: err.value,
    }));
    
    const error = new AppError('Datos de entrada inválidos.', 400);
    error.data = detalles;
    return next(error);
  }
  next();
};
