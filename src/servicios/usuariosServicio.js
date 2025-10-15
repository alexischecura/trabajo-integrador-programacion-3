import Usuarios from '../db/usuarios.js';
import AppError from '../utiles/AppError.js';

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
    if (resultado.length === 0)
      throw new AppError(`Usuario con id ${usuario_id} no encontrado`, 404);
    return resultado[0];
  };

  buscarPorNombreUsuario = async (nombre_usuario) => {
    const resultado = await this.usuarios.buscarUsuarioPorNombre(
      nombre_usuario
    );
    return resultado;
  };

  crearUsuario = async (datos) => {
    const existente = await this.buscarPorNombreUsuario(datos.nombre_usuario);
    if (existente) {
      throw new AppError('El nombre de usuario ya está en uso', 400);
    }
    datos.tipo_usuario =
      TIPOS_DE_USUARIO[datos.tipo_usuario] || TIPOS_DE_USUARIO.cliente;

    const resultado = await this.usuarios.crearUsuario(datos);
    return resultado.insertId;
  };

  actualizarUsuario = async (usuario_id, datos) => {
    // La función buscarUsuarioPorId lanza una excepción/404 si el usuario no existe.
    await this.buscarUsuarioPorId(usuario_id);

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
      throw new AppError('No hay campos válidos para actualizar', 400);
    }

    if (datosFiltrados.tipo_usuario) {
      datosFiltrados.tipo_usuario =
        TIPOS_DE_USUARIO[datosFiltrados.tipo_usuario] ||
        TIPOS_DE_USUARIO.cliente;
    }

    const resultado = await this.usuarios.actualizarUsuario(
      usuario_id,
      datosFiltrados
    );
    return resultado.affectedRows > 0;
  };

  borrarUsuario = async (usuario_id) => {
    // La función buscarUsuarioPorId lanza una excepción/404 si el usuario no existe.
    await this.buscarUsuarioPorId(usuario_id);

    const resultado = await this.usuarios.borrarUsuario(usuario_id);
    return resultado.affectedRows > 0;
  };
}
