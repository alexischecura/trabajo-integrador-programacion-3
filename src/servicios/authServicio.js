import Usuarios from '../db/usuarios.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AppError from '../utiles/AppError.js';

export default class AuthServicio {
  constructor() {
    this.usuarios = new Usuarios();
  }

  async login({ nombre_usuario, contrasenia }) {

    const user = await this.usuarios.buscarUsuarioPorNombre(nombre_usuario);

    if (!user) throw { status: 401, message: 'Credenciales inválidas' };

    const coincide = await bcrypt.compare(contrasenia, user.contrasenia);
    if (!coincide) throw new AppError('Credenciales inválidas', 401);

    const payload = {
      usuario_id: user.usuario_id,
      tipo_usuario: user.tipo_usuario,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    return { token, usuario: payload };
  }

  async register({ nombre_usuario, contrasenia, nombre, apellido, celular, foto }) {
    const existente = await this.usuarios.buscarUsuarioPorNombre(nombre_usuario);
    if (existente) {
      throw new AppError('El email ya está en uso', 400);
    }

    const hash = await bcrypt.hash(contrasenia, 10);

    const datos = {
      nombre_usuario,
      contrasenia: hash,
      nombre,
      apellido,
      tipo_usuario: 'cliente',
      celular,
      foto,
    };

    const resultado = await this.usuarios.crearUsuario(datos);
    return { usuario_id: resultado.insertId };
  }
}