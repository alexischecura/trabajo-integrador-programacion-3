import { conexion } from './conexion.js';

export default class Servicios {
  buscarServicios = async () => {
    const querySQL = 'SELECT * FROM servicios WHERE activo=1';
    const [servicios] = await conexion.execute(querySQL);
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

  actualizarServicio = async (
    servicio_id,
    { descripcion, importe }
  ) => {
    const querySQL = `
    UPDATE servicios 
    SET descripcion = ?, importe = ?
    WHERE servicio_id = ? AND activo = 1
  `;
    const valores = [descripcion, importe, servicio_id];
    const [resultado] = await conexion.execute(querySQL, valores);
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
