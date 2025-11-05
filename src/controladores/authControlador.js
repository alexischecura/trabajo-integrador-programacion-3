import { validationResult } from 'express-validator';

const authServicio = new AuthServicio();

export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }

    const { nombre_usuario, contrasenia } = req.body;
    const data = await authServicio.login({ nombre_usuario, contrasenia });

    res.status(200).json({
      ok: true,
      mensaje: 'Inicio de sesión exitoso',
      ...data,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      ok: false,
      mensaje: error.message || 'Error en autenticación',
    });
  }
};