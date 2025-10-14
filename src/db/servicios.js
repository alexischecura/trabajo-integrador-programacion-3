import { conexion } from './conexion.js';

export default class Servicios {
  buscarServicios = async (options = {}) => {
    const {
      page = 1,
      limit = 10,
      sortBy = 'servicio_id',
      order = 'ASC',
      importeMax,
    } = options;

    const offset = (page - 1) * limit;
    let querySQL = 'SELECT * FROM servicios WHERE activo=1';
    const values = [];

    if (importeMax) {
      querySQL += ' AND importe <= ?';
      values.push(importeMax);
    }

    const allowedSortBy = ['servicio_id', 'descripcion', 'importe'];
    if (allowedSortBy.includes(sortBy)) {
      querySQL += ` ORDER BY ${sortBy} ${order === 'DESC' ? 'DESC' : 'ASC'}`;
    }

    querySQL += ` LIMIT ? OFFSET ?`;
    values.push(
      parseInt(limit, 10).toString(),
      parseInt(offset, 10).toString()
    );

    const [servicios] = await conexion.execute(querySQL, values);

    return servicios;
  };

  buscarServicioPorId = async (servicio_id) => {
    const querySQL = `
      SELECT * FROM servicios WHERE activo=1 AND servicio_id = ?`;
    const [resultado] = await conexion.execute(querySQL, [servicio_id]);
    return resultado;
  };

  crearServicio = async ({ descripcion, importe }) => {
    const querySQL = `
      INSERT INTO servicios (descripcion, importe) 
      VALUES (?,?)`;
    const valores = [descripcion, importe];
    const [resultado] = await conexion.execute(querySQL, valores);
    return resultado;
  };

  actualizarServicio = async (servicio_id, datosFiltrados) => {
    const campos = Object.keys(datosFiltrados);
    const valores = Object.values(datosFiltrados);

    const setCampos = campos.map((campo) => `${campo} = ?`).join(', ');

    const querySQL = `
    UPDATE servicios 
    SET ${setCampos}
    WHERE servicio_id = ? AND activo = 1
  `;
    const [resultado] = await conexion.execute(querySQL, [
      ...valores,
      servicio_id,
    ]);
    return resultado;
  };

  borrarServicio = async (servicio_id) => {
    const querySQL = `
      UPDATE servicios 
      SET activo = 0 
      WHERE servicio_id = ?`;
    const [resultado] = await conexion.execute(querySQL, [servicio_id]);

    return resultado;
  };
}
