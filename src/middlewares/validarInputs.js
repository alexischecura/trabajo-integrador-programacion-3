import { validationResult } from 'express-validator';

export const validarInputs = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const detalles = errors.array().map(err => ({
      campo: err.param,
      mensaje: err.msg,
      valor: err.value
    }));
    return res.status(400).json({
      ok: false,
      mensaje: 'Datos de entrada inválidos',
      errores: detalles
    });
  }
  next();
};