import Usuarios from '../db/usuarios.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default class AuthServicio {
  constructor() {
    this.usuarios = new Usuarios();
  }

  async login({ nombre_usuario, contrasenia }) {
    const user = await this.usuarios.buscarUsuarioPorNombre(nombre_usuario);
    if (!user) throw { status: 401, message: 'Credenciales inválidas' };

    const coincide = await bcrypt.compare(contrasenia, user.contrasenia);
    if (!coincide) throw { status: 401, message: 'Credenciales inválidas' };

    const payload = {
      usuario_id: user.usuario_id,
      tipo_usuario: user.tipo_usuario,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    return { token, usuario: payload };
  }
}