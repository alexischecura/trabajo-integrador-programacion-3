import { conexion } from './conexion.js';

export default class Usuarios {
  buscarUsuarios = async () => {
    const querySQL = 'SELECT usuario_id, nombre, apellido, nombre_usuario, tipo_usuario, celular, foto FROM usuarios WHERE activo=1';
    const [usuarios] = await conexion.execute(querySQL);
    return usuarios;
  };

  buscarUsuarioPorId = async (usuario_id) => {
    const querySQL = `
      SELECT usuario_id, nombre, apellido, nombre_usuario, tipo_usuario, celular, foto FROM usuarios WHERE activo=1 AND usuario_id = ?`;
    const [resultado] = await conexion.execute(querySQL, [usuario_id]);
    return resultado;
  };

  buscarUsuarioPorNombre = async (nombre_usuario) => {
    const querySQL = `
      SELECT usuario_id, nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto 
      FROM usuarios 
      WHERE activo=1 AND nombre_usuario = ?`;
    const [resultado] = await conexion.execute(querySQL, [nombre_usuario]);
    return resultado.length ? resultado[0] : null;
  };

  crearUsuario = async ({ nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto }) => {
    const querySQL = `
      INSERT INTO usuarios (nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const valores = [
      nombre ?? null,
      apellido ?? null,
      nombre_usuario ?? null,
      contrasenia ?? null,
      tipo_usuario ?? null,
      celular ?? null,
      foto ?? null
    ];

    const [resultado] = await conexion.execute(querySQL, valores);
    return resultado;
  };

  actualizarUsuario = async (
    usuario_id,
    { nombre, apellido, nombre_usuario, tipo_usuario, celular, foto }
  ) => {
    const querySQL = `
    UPDATE usuarios 
    SET nombre = ?, apellido = ?, nombre_usuario = ?, tipo_usuario = ?, celular = ?, foto = ?
    WHERE usuario_id = ? AND activo = 1
  `;
    const valores = [nombre, apellido, nombre_usuario, tipo_usuario, celular, foto, usuario_id];
    const [resultado] = await conexion.execute(querySQL, valores);
    return resultado;
  };

  borrarUsuario = async (usuario_id) => {
    const querySQL = `
      UPDATE usuarios 
      SET activo = 0 
      WHERE usuario_id = ?`;
    const [resultado] = await conexion.execute(querySQL, [usuario_id]);
    return resultado;
  };
}
