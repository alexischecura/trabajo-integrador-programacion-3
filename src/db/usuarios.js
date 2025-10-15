import { conexion } from './conexion.js';

export default class Usuarios {
  buscarUsuarios = async (options = {}) => {
    const {
      page = 1,
      limit = 10,
      sortBy = 'usuario_id',
      order = 'ASC',
      tipoUsuario,
    } = options;

    const offset = (page - 1) * limit;
    let querySQL =
      'SELECT usuario_id, nombre, apellido, nombre_usuario, tipo_usuario, celular, foto FROM usuarios WHERE activo=1';
    const values = [];

    if (tipoUsuario) {
      querySQL += ' AND tipo_usuario = ?';
      values.push(tipoUsuario);
    }
    const allowedSortBy = [
      'usuario_id',
      'nombre',
      'apellido',
      'nombre_usuario',
      'tipo_usuario',
    ];
    if (allowedSortBy.includes(sortBy)) {
      querySQL += ` ORDER BY ${sortBy} ${
        order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'
      }`;
    }

    querySQL += ` LIMIT ? OFFSET ?`;
    values.push(
      parseInt(limit, 10).toString(),
      parseInt(offset, 10).toString()
    );

    const [usuarios] = await conexion.execute(querySQL, values);
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
      SELECT usuario_id, nombre, apellido, nombre_usuario, tipo_usuario, celular, foto 
      FROM usuarios 
      WHERE activo=1 AND nombre_usuario = ?`;
    const [resultado] = await conexion.execute(querySQL, [nombre_usuario]);
    return resultado.length ? resultado[0] : null;
  };

  crearUsuario = async ({ nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto }) => {
    const querySQL = `
      INSERT INTO usuarios (nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto) 
      VALUES (?,?,?,?,?,?,?)`;
    const valores = [
      nombre,
      apellido,
      nombre_usuario,
      contrasenia,
      tipo_usuario,
      celular,
      foto,
    ];
    const [resultado] = await conexion.execute(querySQL, valores);
    return resultado;
  };

  actualizarUsuario = async (usuario_id, datosFiltrados) => {
    const campos = Object.keys(datosFiltrados);
    const valores = Object.values(datosFiltrados);

    const setCampos = campos.map((campo) => `${campo} = ?`).join(', ');

    const querySQL = `
    UPDATE usuarios 
    SET ${setCampos}
    WHERE usuario_id = ? AND activo = 1
  `;

    const [resultado] = await conexion.execute(querySQL, [...valores, usuario_id]);
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
