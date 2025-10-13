import { conexion } from './conexion.js';

export default class Salones {
  buscarSalones = async (options = {}) => {
    const {
      page = 1,
      limit = 10,
      sortBy = 'salon_id',
      order = 'ASC',
      capacidad,
      importeMax,
    } = options;

    const offset = (page - 1) * limit;

    let querySQL = 'SELECT * FROM salones WHERE activo=1';
    const values = [];

    if (capacidad) {
      querySQL += ' AND capacidad >= ?';
      values.push(capacidad);
    }

    if (importeMax) {
      querySQL += ' AND importe <= ?';
      values.push(importeMax);
    }

    // Whitelist for sortBy columns to prevent SQL injection
    const allowedSortBy = ['salon_id', 'titulo', 'capacidad', 'importe'];
    if (allowedSortBy.includes(sortBy)) {
      querySQL += ` ORDER BY ${sortBy} ${order === 'DESC' ? 'DESC' : 'ASC'}`;
    }

    querySQL += ' LIMIT ? OFFSET ?';
    values.push(
      parseInt(limit, 10).toString(),
      parseInt(offset, 10).toString()
    );

    const [salones] = await conexion.execute(querySQL, values);

    return salones;
  };

  buscarSalonPorId = async (salon_id) => {
    const querySQL = `
      SELECT * FROM salones WHERE activo=1 AND salon_id = ?`;

    const [resultado] = await conexion.execute(querySQL, [salon_id]);

    return resultado;
  };

  crearSalon = async ({ titulo, direccion, capacidad, importe }) => {
    const querySQL = `
      INSERT INTO salones (titulo, direccion, capacidad, importe) 
      VALUES (?,?,?,?)`;

    const valores = [titulo, direccion, capacidad, importe];

    const [resultado] = await conexion.execute(querySQL, valores);

    return resultado;
  };

  async actualizarSalon(salon_id, datosFiltrados) {
    const campos = Object.keys(datosFiltrados);
    const valores = Object.values(datosFiltrados);

    const setCampos = campos.map((campo) => `${campo} = ?`).join(', ');

    const querySQL = `
    UPDATE salones
    SET ${setCampos}
    WHERE salon_id = ? AND activo = 1
  `;

    return conexion.execute(querySQL, [...valores, salon_id]);
  }

  borrarSalon = async (salon_id) => {
    const querySQL = `
      UPDATE salones 
      SET activo = 0 
      WHERE salon_id = ?`;

    const [resultado] = await conexion.execute(querySQL, [salon_id]);

    return resultado;
  };
}
