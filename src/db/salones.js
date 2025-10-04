import { conexion } from './conexion.js';

export default class Salones {
  
  buscarSalones = async () => {
    const querySQL = 'SELECT * FROM salones WHERE activo=1';

    const [salones] = await conexion.execute(querySQL);

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

  actualizarSalon = async (
    salon_id,
    { titulo, direccion, capacidad, importe }
  ) => {
    const querySQL = `
    UPDATE salones 
    SET titulo = ?, direccion = ?, capacidad = ?, importe = ? 
    WHERE salon_id = ? AND activo = 1
  `;
    const valores = [titulo, direccion, capacidad, importe, salon_id];

    const [resultado] = await conexion.execute(querySQL, valores);
    return resultado;
  };

  borrarSalon = async (salon_id) => {
    const querySQL = `
      UPDATE salones 
      SET activo = 0 
      WHERE salon_id = ?`;

    const [resultado] = await conexion.execute(querySQL, [salon_id]);

    return resultado;
  };
}
