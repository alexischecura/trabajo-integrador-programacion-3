import AuthServicio from '../servicios/authServicio.js';

export default class AuthControlador {
  constructor() {
    this.authServicio = new AuthServicio();
  }

  login = async (req, res, next) => {
    try {
      const { nombre_usuario, contrasenia } = req.body;

      const data = await this.authServicio.login({
        nombre_usuario,
        contrasenia,
      });

      res.status(200).json({
        ok: true,
        mensaje: 'Inicio de sesión exitoso',
        ...data,
      });
    } catch (error) {
      next(error);
    }
  };
  register = async (req, res, next) => {
    const { nombre_usuario, contrasenia, nombre, apellido, celular, foto } =
      req.body;

    const data = await this.authServicio.register({
      nombre_usuario,
      contrasenia,
      nombre,
      apellido,
      celular,
      foto,
    });

    res.status(200).json({
      ok: true,
      mensaje: 'Registro exitoso',
      ...data,
    });
  };
}
