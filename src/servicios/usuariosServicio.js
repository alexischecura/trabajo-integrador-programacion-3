import Usuarios from '../db/usuarios.js';

const TIPOS_DE_USUARIO = {
  administrador: 1,
  empleado: 2,
  cliente: 3,
};

export default class UsuariosServicio {
  constructor() {
    this.usuarios = new Usuarios();
  }

  buscarUsuarios = (options) => {
    if (options.tipoUsuario) {
      options.tipoUsuario = TIPOS_DE_USUARIO[options.tipoUsuario] || null;
    }

    return this.usuarios.buscarUsuarios(options);
  };

  buscarUsuarioPorId = async (usuario_id) => {
    const resultado = await this.usuarios.buscarUsuarioPorId(usuario_id);
    if (resultado.length === 0) return null;
    return resultado[0];
  };

  crearUsuario = async (datos) => {
    datos.tipo_usuario =
      TIPOS_DE_USUARIO[datos.tipo_usuario] || TIPOS_DE_USUARIO.cliente;

    const resultado = await this.usuarios.crearUsuario(datos);
    return resultado.insertId;
  };

  actualizarUsuario = async (usuario_id, datos) => {
    const usuario = await this.buscarUsuarioPorId(usuario_id);
    if (!usuario) {
      return null;
    }
    const camposPermitidos = [
      'nombre',
      'apellido',
      'nombre_usuario',
      'contrasenia',
      'tipo_usuario',
      'celular',
      'foto',
    ];
    const datosFiltrados = Object.fromEntries(
      Object.entries(datos).filter(([key]) => camposPermitidos.includes(key))
    );

    if (Object.keys(datosFiltrados).length === 0) {
      // no hay campos válidos para actualizar
      return null;
    }

    if (datosFiltrados.tipo_usuario) {
      datosFiltrados.tipo_usuario =
        TIPOS_DE_USUARIO[datosFiltrados.tipo_usuario] || TIPOS_DE_USUARIO.cliente;
    }

    const resultado = await this.usuarios.actualizarUsuario(usuario_id, datosFiltrados);
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
