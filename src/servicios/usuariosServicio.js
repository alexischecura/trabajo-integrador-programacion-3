import Usuarios from '../db/usuarios.js';

export default class UsuariosServicio {
  constructor() {
    this.usuarios = new Usuarios();
  }

  buscarUsuarios = () => {
    return this.usuarios.buscarUsuarios();
  };

  buscarUsuarioPorId = async (usuario_id) => {
    const resultado = await this.usuarios.buscarUsuarioPorId(usuario_id);
    if (resultado.length === 0) return null;
    return resultado[0];
  };

  crearUsuario = async (datos) => {
    const resultado = await this.usuarios.crearUsuario(datos);
    return resultado.insertId;
  };

  actualizarUsuario = async (usuario_id, datos) => {
    const usuario = await this.buscarUsuarioPorId(usuario_id);
    if (!usuario) {
      return null;
    }
    const resultado = await this.usuarios.actualizarUsuario(usuario_id, datos);
    return resultado.affectedRows > 0;
  };

  borrarUsuario = async (usuario_id) => {
    const usuario = await this.buscarUsuarioPorId(usuario_id);
    if (!usuario) {
      return null;
    }
    const resultado = await this.usuarios.borrarUsuario(usuario_id);
    return resultado.affectedRows > 0;
  };
}
