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

  buscarPorNombreUsuario = async (nombre_usuario) => {
    const resultado = await this.usuarios.buscarUsuarioPorNombre(nombre_usuario);
    return resultado; 
  }


  crearUsuario = async (datos) => {
    const existente = await this.buscarPorNombreUsuario(datos.nombre_usuario);
    if (existente) {
      const err = new Error('El nombre de usuario ya está en uso');
      err.status = 400;
      throw err;
    }
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
